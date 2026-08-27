#!/usr/bin/env python3
"""build-master-template.py — generate the DataArt Corporate branded PPTX template.

Builds `<kit>/pptx/dataart-corporate-template.pptx`: a 16:9 presentation carrying a
DataArt-branded slide master — themed palette + Arial, grid drawing-guides, and a
grid-driven set of named layouts (Cover, Section, Statement, Content 1/2/3/4-col,
Numbered cards, Table, Final/Contacts, Export Carrier). `export-pptx.py` loads this
file as its base, so every exported deck ships the brand master + reusable layouts
in PowerPoint's Layout menu (not the generic Office defaults).

WHY a checked-in template (and not Presentation() at export time): python-pptx
cannot synthesise a slide master / new layouts from scratch. The robust path is to
edit the 11 stock layouts of a base file IN PLACE (rename, restyle, reposition,
set background, add chrome) — no part synthesis, no "repair" prompts — and persist
the result. This script is that one-time build; rerun it whenever the kit grid,
palette, or assets change.

GRID = kit canon (Figma node 2108-706 + shared/layouts.css), @1920×1080:
  margins L/R 153.333 · content 1613.333 · heading y=114.667 (h 96 / 182.667)
  content top 280 (1-line head) / 358.667 (2-line) · content bottom 930.667
  footer band y=952 h=53.333 · gutter 42.667 · logo 1569.333,141.333 197.333×32

Usage:
    python3 build-master-template.py [--kit DIR] [--output FILE]
Exit codes: 0 ok · 1 missing dep · 2 bad args · 3 kit not found · 5 build error
"""

from __future__ import annotations

import argparse
import copy
import re
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    from pptx import Presentation
    from pptx.util import Emu
    from pptx.oxml.ns import qn
    from pptx.opc.packuri import PackURI
    from pptx.opc.constants import RELATIONSHIP_TYPE as RT, CONTENT_TYPE as CT
    from pptx.parts.slide import SlideLayoutPart
    from lxml import etree
except ImportError as e:  # pragma: no cover
    sys.stderr.write(
        "build-master-template.py: missing dependency: %s\n"
        "Install with:  pip install python-pptx\n" % e
    )
    sys.exit(1)

# --- canvas + grid (px @1920×1080) ------------------------------------------
EMU_PER_PX = 6350                       # 1920px → 12192000 EMU
SLIDE_W_EMU, SLIDE_H_EMU = 12192000, 6858000
PX_TO_PT = 0.5                          # 1920px → 960pt of slide width

MARGIN_L, CONTENT_W, MARGIN_R = 153.333, 1613.333, 1766.666
HEAD_X, HEAD_Y, HEAD_W = 153.333, 114.667, 1613.333
HEAD_H1, HEAD_H2 = 96.0, 182.667
ACCENT = (153.333, 210.667, 146.667, 8.0)          # black rule at bottom of heading (kit .heading-rule = --c-text-default)
CONTENT_TOP1, CONTENT_H1 = 280.0, 650.667          # 1-line heading
CONTENT_TOP2, CONTENT_H2 = 358.667, 572.0          # 2-line heading
GUTTER = 42.667
COL_W = {1: 1613.333, 2: 785.333, 3: 509.333, 4: 372.0}
# Exact column left-edges from Figma (node 2108-706). NOT a uniform gutter
# formula: the kit anchors the last column to the right margin (1766.666), so the
# final 4-col gutter is 40, not 42.667 — reproduce the canon verbatim.
COL_X = {
    1: [153.333],
    2: [153.333, 981.333],
    3: [153.333, 705.333, 1257.333],
    4: [153.333, 568.0, 982.667, 1394.667],
}
FOOTER_Y = 985.333
LOGO = (1544.0, 138.667, 222.667, 36.0)            # content-slide logo zone (kit .logo, right edge 1766.667)
COVER_LOGO = (195.0, 181.0, 426.0, 69.0)           # large logo on covers

# kit heading sizes — px → pt (×0.5). All kit headings are weight 400 (regular).
# PT_H3 = 29.333 = 58.667px = base H3 44 ×4/3 (kit .slide-heading); matches H0/H1 scaling.
PT_H0, PT_H1, PT_H3, PT_H12, PT_P2 = 49.333, 42.667, 29.333, 14.0, 10.667
# kit-exact special-slide geometry (shared/layouts.css)
COVER_HEADING     = (509.333, 504.0,   1104.0,   226.0)
SECTION_HEADING   = (372.0,   489.333, 1241.333, 196.0)
STATEMENT_HEADING = (153.333, 200.0,   1337.333, 402.0)   # anchor bottom (~y602)
FINAL_HEADING     = (525.333, 425.333, 1241.333, 113.333)
FINAL_CONTACTS    = (525.333, 581.333, 1241.333, 280.0)

# --- palette (tokens.css) ----------------------------------------------------
BLUE, BLUE600 = "3453AD", "1A316D"
GRAY900, GRAY200, GRAY75 = "2C3337", "D6D7D8", "F1F2F2"
WHITE, BLACK = "FFFFFF", "000000"

A = "http://schemas.openxmlformats.org/drawingml/2006/main"
P = "http://schemas.openxmlformats.org/presentationml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"


def px(v: float) -> int:
    return int(round(v * EMU_PER_PX))


def col_xs(n: int) -> list[float]:
    """Left edges of n columns on the content grid (Figma-exact, see COL_X)."""
    return COL_X[n]


# --- layout role table -------------------------------------------------------
# Each entry restyles one stock layout slot (index 0..10) into a DataArt layout.
# kind drives chrome: cover / section / statement / content / blank.
ROLES = [
    dict(slot=0,  name="DataArt — Cover / Title",      kind="cover",
         bg="backgrounds/bg-title-03.jpg", dark=True),
    dict(slot=2,  name="DataArt — Section divider",    kind="section",
         bg="backgrounds/bg-title-01.jpg", dark=True),
    dict(slot=5,  name="DataArt — Statement",          kind="statement",
         bg="backgrounds/bg-title-02.jpg", dark=True),
    dict(slot=1,  name="DataArt — Content 1 col",      kind="content", cols=1,
         bg="backgrounds/bg-content-01.jpg", dark=False),
    dict(slot=3,  name="DataArt — Content 2 col",      kind="content", cols=2,
         bg="backgrounds/bg-content-02.jpg", dark=False),
    dict(slot=7,  name="DataArt — Content 3 col",      kind="content", cols=3,
         bg="backgrounds/bg-content-03.jpg", dark=False),
    dict(slot=4,  name="DataArt — Content 4 col",      kind="content", cols=4,
         bg="backgrounds/bg-content-04.jpg", dark=False),
    dict(slot=8,  name="DataArt — Numbered cards",     kind="numbered", cols=3,
         bg="backgrounds/bg-content-05.jpg", dark=False),
    dict(slot=9,  name="DataArt — Table",              kind="content", cols=1,
         bg="backgrounds/bg-content-06.jpg", dark=False),
    dict(slot=10, name="DataArt — Final / Contacts",   kind="final",
         bg="backgrounds/bg-title-05.jpg", dark=True),
    dict(slot=6,  name="DataArt — Export Carrier (Blank)", kind="blank", dark=False),
]

# Extra layouts beyond the 11 stock slots — each is a NEW sldLayout part synthesised
# by cloning the pristine Blank (see clone_layout). Key kit content families.
NEW_ROLES = [
    dict(name="DataArt — Content text + media", kind="textmedia",
         bg="backgrounds/bg-content-07.jpg", dark=False),
    dict(name="DataArt — Comparison",           kind="comparison",
         bg="backgrounds/bg-content-08.jpg", dark=False),
    dict(name="DataArt — Timeline",             kind="timeline", cols=4,
         bg="backgrounds/bg-content-02.jpg", dark=False),
    dict(name="DataArt — Process",              kind="process",  cols=4,
         bg="backgrounds/bg-content-03.jpg", dark=False),
]
GRAY400 = "A1A4A6"


# --- low-level XML injection -------------------------------------------------
def _spTree(layout):
    return layout.shapes._spTree


def _ph_idx(sp) -> int | None:
    ph = sp.find(qn("p:nvSpPr") + "/" + qn("p:nvPr") + "/" + qn("p:ph"))
    if ph is None:
        return None
    return int(ph.get("idx", "0"))


def clear_content_phs(layout) -> None:
    """Remove title/content placeholders (idx 0-4); keep dt/ftr/sldNum (10/11/12)."""
    tree = _spTree(layout)
    for sp in list(tree.findall(qn("p:sp"))):
        idx = _ph_idx(sp)
        if idx is not None and idx in (0, 1, 2, 3, 4):
            tree.remove(sp)


def set_name(layout, name: str) -> None:
    layout._element.find(qn("p:cSld")).set("name", name)


_bg_cache: dict[str, Path] = {}
_bg_tmp: list = []


def _bg_1920(path: Path) -> Path:
    """Return a ≤1920px JPEG copy of a background (cached; identical bgs dedup via
    the same bytes). Kit source backgrounds ship at 2880px (1.5× the 1920 canvas)
    — pointless weight in every deck that embeds the branded master. Falls back to
    the original on any error / if already within cap."""
    key = str(path)
    if key in _bg_cache:
        return _bg_cache[key]
    try:
        import tempfile
        from PIL import Image
        im = Image.open(path)
        w, h = im.size
        if max(w, h) <= 1920:
            _bg_cache[key] = path
            return path
        if not _bg_tmp:
            _bg_tmp.append(tempfile.mkdtemp(prefix="bg1920-"))
        scale = 1920 / max(w, h)
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        out = Path(_bg_tmp[0]) / (path.stem + "-1920.jpg")
        im.convert("RGB").save(out, format="JPEG", quality=90, optimize=True)
        im.close()
        _bg_cache[key] = out
        return out
    except Exception as e:
        sys.stderr.write(f"build-master-template: bg downscale skipped {path.name}: {e}\n")
        _bg_cache[key] = path
        return path


def set_bg(layout, img_path: Path) -> None:
    img_path = _bg_1920(img_path)
    _img, rId = layout.part.get_or_add_image_part(str(img_path))
    bg = etree.fromstring(
        f'<p:bg xmlns:p="{P}" xmlns:a="{A}" xmlns:r="{R}">'
        f'<p:bgPr><a:blipFill><a:blip r:embed="{rId}"/>'
        f'<a:stretch><a:fillRect/></a:stretch></a:blipFill>'
        f'<a:effectLst/></p:bgPr></p:bg>'.encode()
    )
    cSld = layout._element.find(qn("p:cSld"))
    cSld.insert(0, bg)


_next_id = [900]


def _new_id() -> int:
    _next_id[0] += 1
    return _next_id[0]


def add_placeholder(layout, *, ph_type, idx, x, y, w, h,
                    size_pt=None, color=None, anchor="t", bold=False,
                    align="l") -> None:
    """Inject a placeholder at grid coords, OVERRIDING the inherited stock master
    style: left-aligned by default, NO bullet, explicit Arial + size + weight +
    colour. (Stock layouts inherit a centred title style and a bulleted, tiny
    body style — that is what made the kit slides look wrong.)"""
    type_attr = f' type="{ph_type}"' if ph_type else ""
    fill = f'<a:solidFill><a:srgbClr val="{color}"/></a:solidFill>' if color else ""
    sz = f' sz="{int(round(size_pt * 100))}"' if size_pt else ""
    b = ' b="1"' if bold else ' b="0"'
    # marL/indent 0 + buNone kills the inherited bullet & hanging indent.
    lst = (f'<a:lstStyle><a:lvl1pPr marL="0" indent="0" algn="{align}"><a:buNone/>'
           f'<a:defRPr{sz}{b}>{fill}<a:latin typeface="Arial"/></a:defRPr>'
           f'</a:lvl1pPr></a:lstStyle>')
    sp = etree.fromstring(
        f'<p:sp xmlns:p="{P}" xmlns:a="{A}">'
        f'<p:nvSpPr><p:cNvPr id="{_new_id()}" name="{ph_type or "body"}-{idx}"/>'
        f'<p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>'
        f'<p:nvPr><p:ph{type_attr} idx="{idx}"/></p:nvPr></p:nvSpPr>'
        f'<p:spPr><a:xfrm><a:off x="{px(x)}" y="{px(y)}"/>'
        f'<a:ext cx="{px(w)}" cy="{px(h)}"/></a:xfrm></p:spPr>'
        f'<p:txBody><a:bodyPr anchor="{anchor}"/>{lst}<a:p/></p:txBody></p:sp>'.encode()
    )
    _spTree(layout).append(sp)


# The official DataArt master is authored on a 2880×1620 canvas; this template
# is 1920×1080 — scale transplanted geometry by exactly 2/3.
MASTER_SCALE = 2 / 3


def normalize_master(prs, kit: Path) -> None:
    """Make the ROOT slide master the official DataArt master.

    Everything is transplanted verbatim from the official corporate template
    (DataArt_Company_Overview_Deck_Arial.pptx — vendored as
    <kit>/pptx/master-txstyles.xml):
      * txStyles — 44pt regular left title (no accent rule) + the 9-level body
        ramp (21 plain / 21 bullet / 24 plain / 18 bullet / 16 bullet /
        21 numbered / 18 plain / 16 bullet / 16 plain);
      * the three master placeholders (title / body / sldNum) INCLUDING their
        official sample text ("Sample Text"; "Master text", "Third level"…),
        with xfrm scaled ×2/3 to this canvas. The official master has no
        dt/ftr placeholders, so the stock ones are dropped.
    Fonts stay theme-inherited (+mj-lt/+mn-lt = Arial via apply_theme).
    Layouts override all of this per slide (see add_placeholder), so exported
    slides keep kit typography — this styles the master as PowerPoint shows it
    (View → Slide Master) and everything that falls back to master defaults."""
    asset = kit / "pptx" / "master-txstyles.xml"
    root = etree.fromstring(asset.read_bytes())
    vend_tx = root.find(qn("p:txStyles"))
    vend_sps = root.findall(qn("p:sp"))
    if vend_tx is None or len(vend_sps) != 3:
        raise RuntimeError(f"master-txstyles.xml must carry txStyles + 3 sp: {asset}")

    master = prs.slide_masters[0]
    sldMaster = master.shapes._spTree.getparent().getparent()

    # (1) txStyles — replace wholesale with the official block.
    tx = sldMaster.find(qn("p:txStyles"))
    sldMaster.replace(tx, copy.deepcopy(vend_tx))

    # (2) placeholders: drop ALL stock ones, then append the official three
    # (title, body, sldNum) verbatim — sample text and per-shape lstStyle
    # included — rescaled to this canvas and re-id'd for cNvPr uniqueness.
    tree = master.shapes._spTree
    for sp in list(tree.findall(qn("p:sp"))):
        if sp.find(qn("p:nvSpPr") + "/" + qn("p:nvPr") + "/" + qn("p:ph")) is not None:
            tree.remove(sp)
    for vend_sp in vend_sps:
        sp = copy.deepcopy(vend_sp)
        # scope to spPr/xfrm — a bare .//a:ext would also match extLst entries
        xfrm = sp.find(qn("p:spPr") + "/" + qn("a:xfrm"))
        off, ext = xfrm.find(qn("a:off")), xfrm.find(qn("a:ext"))
        for el, attrs in ((off, ("x", "y")), (ext, ("cx", "cy"))):
            for a in attrs:
                el.set(a, str(int(round(int(el.get(a)) * MASTER_SCALE))))
        sp.find(qn("p:nvSpPr") + "/" + qn("p:cNvPr")).set("id", str(_new_id()))
        tree.append(sp)


def add_number_box(layout, x, y, n: int, size=133.333, font_pt=32.0) -> None:
    """Static blue number box (kit numbered-card badge) with a white numeral."""
    sp = etree.fromstring(
        f'<p:sp xmlns:p="{P}" xmlns:a="{A}">'
        f'<p:nvSpPr><p:cNvPr id="{_new_id()}" name="Number {n}"/>'
        f'<p:cNvSpPr/><p:nvPr/></p:nvSpPr>'
        f'<p:spPr><a:xfrm><a:off x="{px(x)}" y="{px(y)}"/>'
        f'<a:ext cx="{px(size)}" cy="{px(size)}"/></a:xfrm>'
        f'<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>'
        f'<a:solidFill><a:srgbClr val="{BLUE}"/></a:solidFill>'
        f'<a:ln><a:noFill/></a:ln></p:spPr>'
        f'<p:txBody><a:bodyPr anchor="ctr"/>'
        f'<a:lstStyle><a:lvl1pPr algn="ctr"><a:buNone/>'
        f'<a:defRPr sz="{int(round(font_pt * 100))}" b="1"><a:solidFill><a:srgbClr val="{WHITE}"/></a:solidFill>'
        f'<a:latin typeface="Arial"/></a:defRPr></a:lvl1pPr></a:lstStyle>'
        f'<a:p><a:r><a:rPr lang="en-US"/><a:t>{n}</a:t></a:r></a:p></p:txBody></p:sp>'.encode()
    )
    _spTree(layout).append(sp)


def _shape(layout, name, prst, x, y, w, h, fill) -> None:
    """Inject a simple filled autoshape (prst geom) — decorative scaffolding."""
    sp = etree.fromstring(
        f'<p:sp xmlns:p="{P}" xmlns:a="{A}">'
        f'<p:nvSpPr><p:cNvPr id="{_new_id()}" name="{name}"/>'
        f'<p:cNvSpPr/><p:nvPr/></p:nvSpPr>'
        f'<p:spPr><a:xfrm><a:off x="{px(x)}" y="{px(y)}"/>'
        f'<a:ext cx="{px(w)}" cy="{px(h)}"/></a:xfrm>'
        f'<a:prstGeom prst="{prst}"><a:avLst/></a:prstGeom>'
        f'<a:solidFill><a:srgbClr val="{fill}"/></a:solidFill>'
        f'<a:ln><a:noFill/></a:ln></p:spPr>'
        f'<p:txBody><a:bodyPr/><a:lstStyle/><a:p/></p:txBody></p:sp>'.encode()
    )
    _spTree(layout).append(sp)


def clone_layout(prs, src_layout, new_name):
    """Synthesise a NEW slide-layout part by cloning a pristine layout element and
    wiring its OPC relationships (layout→master, master→layout, sldLayoutIdLst).
    Validated to open in PowerPoint without a repair prompt. Clone from a layout
    with NO image relationships (e.g. Blank) so the deepcopy carries no dangling
    r:embed — backgrounds/logos are added to the new part afterwards."""
    master = prs.slide_masters[0]
    mpart = master.part
    pkg = mpart.package
    nums = [int(m.group(1)) for p in pkg.iter_parts()
            if (m := re.search(r'/ppt/slideLayouts/slideLayout(\d+)\.xml$', str(p.partname)))]
    pn = PackURI(f"/ppt/slideLayouts/slideLayout{max(nums) + 1}.xml")
    new_el = copy.deepcopy(src_layout.part._element)
    new_part = SlideLayoutPart(pn, CT.PML_SLIDE_LAYOUT, pkg, new_el)
    new_part.relate_to(mpart, RT.SLIDE_MASTER)
    rId = mpart.relate_to(new_part, RT.SLIDE_LAYOUT)
    lst = mpart._element.find(qn("p:sldLayoutIdLst"))
    ids = [int(e.get("id")) for e in lst.findall(qn("p:sldLayoutId"))]
    e = lst.makeelement(qn("p:sldLayoutId"), {"id": str(max(ids) + 1)})
    e.set(qn("r:id"), rId)
    lst.append(e)
    new_el.find(qn("p:cSld")).set("name", new_name)
    return new_part.slide_layout


def add_accent(layout) -> None:
    x, y, w, h = ACCENT
    sp = etree.fromstring(
        f'<p:sp xmlns:p="{P}" xmlns:a="{A}">'
        f'<p:nvSpPr><p:cNvPr id="{_new_id()}" name="Accent rule"/>'
        f'<p:cNvSpPr/><p:nvPr/></p:nvSpPr>'
        f'<p:spPr><a:xfrm><a:off x="{px(x)}" y="{px(y)}"/>'
        f'<a:ext cx="{px(w)}" cy="{px(h)}"/></a:xfrm>'
        f'<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>'
        f'<a:solidFill><a:srgbClr val="{BLACK}"/></a:solidFill>'
        f'<a:ln><a:noFill/></a:ln></p:spPr>'
        f'<p:txBody><a:bodyPr/><a:lstStyle/><a:p/></p:txBody></p:sp>'.encode()
    )
    _spTree(layout).append(sp)


def add_logo(layout, png: Path, x, y, w, h) -> None:
    _img, rId = layout.part.get_or_add_image_part(str(png))
    pic = etree.fromstring(
        f'<p:pic xmlns:p="{P}" xmlns:a="{A}" xmlns:r="{R}">'
        f'<p:nvPicPr><p:cNvPr id="{_new_id()}" name="DataArt logo"/>'
        f'<p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>'
        f'<p:blipFill><a:blip r:embed="{rId}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>'
        f'<p:spPr><a:xfrm><a:off x="{px(x)}" y="{px(y)}"/>'
        f'<a:ext cx="{px(w)}" cy="{px(h)}"/></a:xfrm>'
        f'<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>'.encode()
    )
    _spTree(layout).append(pic)


def style_footer(layout, dark: bool) -> None:
    """Reposition dt/ftr/sldNum (idx 10/11/12) to the kit footer band + colour."""
    color = WHITE if dark else GRAY900
    slots = {
        11: (MARGIN_L, FOOTER_Y, 380.0, 24.0, "l"),    # ftr  → tagline (left)
        10: (568.0,    FOOTER_Y, 700.0, 24.0, "l"),    # dt   → section name
        12: (MARGIN_R - 200.0, FOOTER_Y, 200.0, 24.0, "r"),  # sldNum → page (right)
    }
    tree = _spTree(layout)
    for sp in tree.findall(qn("p:sp")):
        idx = _ph_idx(sp)
        if idx not in slots:
            continue
        x, y, w, h, align = slots[idx]
        spPr = sp.find(qn("p:spPr"))
        for old in spPr.findall(qn("a:xfrm")):
            spPr.remove(old)
        xfrm = etree.SubElement(spPr, qn("a:xfrm"))
        off = etree.SubElement(xfrm, qn("a:off")); off.set("x", str(px(x))); off.set("y", str(px(y)))
        ext = etree.SubElement(xfrm, qn("a:ext")); ext.set("cx", str(px(w))); ext.set("cy", str(px(h)))
        spPr.insert(0, xfrm)
        # default run colour + Arial + size 14px (7pt) + alignment
        txBody = sp.find(qn("p:txBody"))
        for old in txBody.findall(qn("a:lstStyle")):
            txBody.remove(old)
        lst = etree.fromstring(
            f'<a:lstStyle xmlns:a="{A}"><a:lvl1pPr algn="{align}">'
            f'<a:defRPr sz="800"><a:solidFill><a:srgbClr val="{color}"/></a:solidFill>'
            f'<a:latin typeface="Arial"/></a:defRPr></a:lvl1pPr></a:lstStyle>'.encode()
        )
        txBody.insert(1, lst)


# --- theme + guides (blob edits) --------------------------------------------
def _part(pkg, name: str):
    for p in pkg.iter_parts():
        if str(p.partname) == name:
            return p
    raise KeyError(name)


def apply_theme(prs) -> None:
    clr = (
        f'<a:clrScheme xmlns:a="{A}" name="DataArt">'
        f'<a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1>'
        f'<a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>'
        f'<a:dk2><a:srgbClr val="{GRAY900}"/></a:dk2>'
        f'<a:lt2><a:srgbClr val="{GRAY75}"/></a:lt2>'
        f'<a:accent1><a:srgbClr val="{BLUE}"/></a:accent1>'
        f'<a:accent2><a:srgbClr val="{BLUE600}"/></a:accent2>'
        f'<a:accent3><a:srgbClr val="707477"/></a:accent3>'
        f'<a:accent4><a:srgbClr val="A1A4A6"/></a:accent4>'
        f'<a:accent5><a:srgbClr val="B0C6FF"/></a:accent5>'
        f'<a:accent6><a:srgbClr val="284086"/></a:accent6>'
        f'<a:hlink><a:srgbClr val="{BLUE}"/></a:hlink>'
        f'<a:folHlink><a:srgbClr val="{BLUE600}"/></a:folHlink></a:clrScheme>'
    )
    theme = _part(prs.part.package, "/ppt/theme/theme1.xml")
    xml = theme._blob.decode("utf-8")
    xml = re.sub(r"<a:clrScheme.*?</a:clrScheme>", clr, xml, count=1, flags=re.S)
    xml = re.sub(r'(<a:majorFont><a:latin typeface=")[^"]*(")', r"\1Arial\2", xml)
    xml = re.sub(r'(<a:minorFont><a:latin typeface=")[^"]*(")', r"\1Arial\2", xml)
    theme._blob = xml.encode("utf-8")


def apply_guides(prs) -> None:
    # PowerPoint guide pos = 1/8 point from top-left = px × 4.
    def g(orient, p):
        o = f' orient="{orient}"' if orient else ""
        return f'<p:guide{o} pos="{int(round(p * 4))}"/>'
    horz = [HEAD_Y, CONTENT_TOP1, CONTENT_TOP2, CONTENT_TOP1 + CONTENT_H1, FOOTER_Y - 33.333]
    vert = [MARGIN_L, 568.0, 705.333, 981.333, 1257.333, 1394.667, MARGIN_R]
    guides = "".join(g("horz", p) for p in horz) + "".join(g("", p) for p in vert)
    vp = _part(prs.part.package, "/ppt/viewProps.xml")
    xml = vp._blob.decode("utf-8")
    if "<p:guideLst>" in xml:
        xml = re.sub(r"<p:guideLst>.*?</p:guideLst>",
                     f"<p:guideLst>{guides}</p:guideLst>", xml, count=1, flags=re.S)
    else:
        xml = xml.replace("</p:cSldViewPr>",
                          f"<p:guideLst>{guides}</p:guideLst></p:cSldViewPr>")
    vp._blob = xml.encode("utf-8")


# --- logo rasterisation (SVG → transparent PNG via playwright) --------------
def rasterize_logos(kit: Path, out_dir: Path) -> dict[str, Path]:
    """Render small colored + white DataArt logos to PNG. Returns {} on failure."""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        sys.stderr.write("build-master-template: playwright absent — logos skipped\n")
        return {}
    jobs = {
        "colored": kit / "assets/logo/dataart-logo-small.svg",
        # the LARGE white asset is the fully monochrome logo (the kit's own
        # dark covers use it); small-white keeps a coloured mark — wrong here.
        "white": kit / "assets/logo/dataart-logo-large-white.svg",
    }
    W, H = 888, 144  # 6× of 148×24 viewBox for crisp downscale
    result: dict[str, Path] = {}
    try:
        with sync_playwright() as pw:
            b = pw.chromium.launch()
            pg = b.new_page(viewport={"width": W, "height": H},
                            device_scale_factor=1.0)
            for key, svg in jobs.items():
                if not svg.exists():
                    continue
                data = svg.read_text(encoding="utf-8")
                pg.set_content(
                    f'<!doctype html><html><body style="margin:0;padding:0;'
                    f'background:transparent">'
                    f'<div style="width:{W}px;height:{H}px">{data}</div></body></html>'
                )
                pg.evaluate(
                    "([w,h])=>{const s=document.querySelector('svg');"
                    "if(s){s.setAttribute('width',w);s.setAttribute('height',h);}}",
                    [W, H],
                )
                png = out_dir / f"logo-{key}.png"
                pg.screenshot(path=str(png), omit_background=True,
                              clip={"x": 0, "y": 0, "width": W, "height": H})
                result[key] = png
            b.close()
    except Exception as e:  # pragma: no cover
        sys.stderr.write(f"build-master-template: logo raster failed ({e}) — skipped\n")
        return {}
    return result


# --- build -------------------------------------------------------------------
def build(kit: Path, output: Path) -> None:
    prs = Presentation()
    prs.slide_width, prs.slide_height = Emu(SLIDE_W_EMU), Emu(SLIDE_H_EMU)

    apply_theme(prs)
    apply_guides(prs)

    with tempfile.TemporaryDirectory() as td:
        logos = rasterize_logos(kit, Path(td))
        layouts = list(prs.slide_masters[0].slide_layouts)

        # 11 stock layouts (by slot) + cloned extras for the new kit families.
        pairs = [(layouts[r["slot"]], r) for r in ROLES]
        blank_src = layouts[6]  # pristine Blank — clone source (no image rels)
        for r in NEW_ROLES:
            pairs.append((clone_layout(prs, blank_src, r["name"]), r))

        for lay, role in pairs:
            set_name(lay, role["name"])
            kind, dark = role["kind"], role["dark"]

            if role.get("bg"):
                set_bg(lay, kit / "assets" / role["bg"])

            clear_content_phs(lay)
            style_footer(lay, dark)

            if kind == "blank":
                continue  # truly empty carrier for baked export slides

            txt = WHITE if dark else BLACK
            logo_key = "white" if dark else "colored"

            def put_logo(big=False):
                png = logos.get(logo_key)
                if png:
                    add_logo(lay, png, *(COVER_LOGO if big else LOGO))

            if kind == "cover":
                # kit .cover-heading: H0 98.667px regular, white, left, x=509
                add_placeholder(lay, ph_type="ctrTitle", idx=0,
                                x=COVER_HEADING[0], y=COVER_HEADING[1],
                                w=COVER_HEADING[2], h=COVER_HEADING[3],
                                size_pt=PT_H0, color=WHITE, anchor="t", align="l")
                add_placeholder(lay, ph_type="subTitle", idx=1,
                                x=COVER_HEADING[0], y=752, w=COVER_HEADING[2], h=96,
                                size_pt=PT_H12, color=WHITE, align="l")
                put_logo(big=True)
            elif kind == "section":
                # kit .divider-heading: H1 85.333px regular, white, left, x=372
                add_placeholder(lay, ph_type="title", idx=0,
                                x=SECTION_HEADING[0], y=SECTION_HEADING[1],
                                w=SECTION_HEADING[2], h=SECTION_HEADING[3],
                                size_pt=PT_H1, color=WHITE, anchor="t", align="l")
                put_logo()
            elif kind == "statement":
                # kit .statement-heading: H0 98.667px regular, white, left, bottom-anchored
                add_placeholder(lay, ph_type="title", idx=0,
                                x=STATEMENT_HEADING[0], y=STATEMENT_HEADING[1],
                                w=STATEMENT_HEADING[2], h=STATEMENT_HEADING[3],
                                size_pt=PT_H0, color=WHITE, anchor="b", align="l")
                put_logo()
            elif kind == "final":
                # kit .final-heading H1 + .final-contacts H12, white, left
                add_placeholder(lay, ph_type="title", idx=0,
                                x=FINAL_HEADING[0], y=FINAL_HEADING[1],
                                w=FINAL_HEADING[2], h=FINAL_HEADING[3],
                                size_pt=PT_H1, color=WHITE, anchor="t", align="l")
                add_placeholder(lay, ph_type="body", idx=1,
                                x=FINAL_CONTACTS[0], y=FINAL_CONTACTS[1],
                                w=FINAL_CONTACTS[2], h=FINAL_CONTACTS[3],
                                size_pt=PT_H12, color=WHITE, anchor="t", align="l")
                put_logo()
            else:
                # all remaining kinds open with the content heading + accent rule
                add_placeholder(lay, ph_type="title", idx=0,
                                x=HEAD_X, y=HEAD_Y, w=HEAD_W, h=HEAD_H1,
                                size_pt=PT_H3, color=BLACK, anchor="t", align="l")
                add_accent(lay)

                if kind in ("content", "numbered"):
                    n = role["cols"]
                    if kind == "numbered":
                        for i, x in enumerate(col_xs(n)):
                            add_number_box(lay, x, CONTENT_TOP1, i + 1, font_pt=29.333)  # 58.667px = kit .nc-number
                            add_placeholder(lay, ph_type="body", idx=i + 1,
                                            x=x, y=CONTENT_TOP1 + 160, w=COL_W[n],
                                            h=CONTENT_H1 - 160, size_pt=PT_P2, color=BLACK)
                    else:
                        for i, x in enumerate(col_xs(n)):
                            add_placeholder(lay, ph_type="body", idx=i + 1,
                                            x=x, y=CONTENT_TOP1, w=COL_W[n], h=CONTENT_H1,
                                            size_pt=PT_P2, color=BLACK)
                elif kind == "textmedia":
                    lx, rx = COL_X[2]
                    add_placeholder(lay, ph_type="body", idx=1, x=lx, y=CONTENT_TOP1,
                                    w=COL_W[2], h=CONTENT_H1, size_pt=PT_P2, color=BLACK)
                    add_placeholder(lay, ph_type="pic", idx=2, x=rx, y=CONTENT_TOP1,
                                    w=COL_W[2], h=CONTENT_H1)
                elif kind == "comparison":
                    for ci, x in enumerate(COL_X[2]):
                        add_placeholder(lay, ph_type="body", idx=1 + ci * 2, x=x, y=CONTENT_TOP1,
                                        w=COL_W[2], h=72, size_pt=18.667, color=BLUE,
                                        anchor="t", align="l")   # column head = kit .compare-head (37.333 blue regular)
                        add_placeholder(lay, ph_type="body", idx=2 + ci * 2, x=x, y=CONTENT_TOP1 + 88,
                                        w=COL_W[2], h=CONTENT_H1 - 88, size_pt=PT_P2, color=BLACK)
                    _shape(lay, "Divider", "rect", 959.333, CONTENT_TOP1, 2, CONTENT_H1, GRAY200)
                elif kind == "timeline":
                    rule_y = 470.0
                    _shape(lay, "Timeline rule", "rect", MARGIN_L, rule_y, CONTENT_W, 4, BLUE)
                    for i, x in enumerate(col_xs(4)):
                        cx = x + COL_W[4] / 2
                        _shape(lay, f"Dot {i+1}", "ellipse", cx - 14, rule_y - 12, 28, 28, BLUE)
                        add_placeholder(lay, ph_type="body", idx=i + 1, x=x, y=rule_y + 40,
                                        w=COL_W[4], h=240, size_pt=PT_P2, color=BLACK, align="l")
                elif kind == "process":
                    xs = col_xs(4)
                    for i, x in enumerate(xs):
                        add_number_box(lay, x, CONTENT_TOP1, i + 1, size=96, font_pt=20)  # 40px, on-ladder (H8)
                        add_placeholder(lay, ph_type="body", idx=i + 1, x=x, y=CONTENT_TOP1 + 120,
                                        w=COL_W[4], h=CONTENT_H1 - 120, size_pt=PT_P2, color=BLACK)
                        if i < len(xs) - 1:
                            ax = x + 96 + 12
                            aw = xs[i + 1] - ax - 12
                            if aw > 0:
                                _shape(lay, f"Arrow {i+1}", "rightArrow", ax,
                                       CONTENT_TOP1 + 28, aw, 40, GRAY400)
                put_logo()

    normalize_master(prs, kit)

    output.parent.mkdir(parents=True, exist_ok=True)
    prs.save(str(output))


def resolve_kit(arg: str | None, script_dir: Path) -> Path:
    if arg:
        p = Path(arg).resolve()
        if (p / "shared" / "tokens.css").is_file():
            return p
        sys.stderr.write(f"build-master-template: --kit {p} is not a kit\n")
        sys.exit(3)
    find = script_dir / "find-kit.sh"
    if find.is_file():
        try:
            out = subprocess.run(["bash", str(find)], capture_output=True,
                                 text=True, timeout=20)
            if out.returncode == 0 and out.stdout.strip():
                return Path(out.stdout.strip())
        except Exception:
            pass
    # fallback: walk up for kit-corporate/
    for parent in [script_dir, *script_dir.parents]:
        cand = parent / "kit-corporate"
        if (cand / "shared" / "tokens.css").is_file():
            return cand
    sys.stderr.write("build-master-template: could not resolve kit-corporate\n")
    sys.exit(3)


def main() -> int:
    ap = argparse.ArgumentParser(description="Build the DataArt Corporate PPTX template")
    ap.add_argument("--kit", default=None, help="path to kit-corporate (default: find-kit.sh)")
    ap.add_argument("--output", default=None, help="output .pptx (default: <kit>/pptx/dataart-corporate-template.pptx)")
    args = ap.parse_args()

    script_dir = Path(__file__).resolve().parent
    kit = resolve_kit(args.kit, script_dir)
    output = Path(args.output).resolve() if args.output else kit / "pptx" / "dataart-corporate-template.pptx"

    try:
        build(kit, output)
    except Exception as e:
        sys.stderr.write(f"build-master-template: build failed: {e}\n")
        return 5

    # smoke: re-parse + report layouts
    prs = Presentation(str(output))
    names = [l.name for l in prs.slide_masters[0].slide_layouts if "DataArt" in l.name]
    size_kb = output.stat().st_size // 1024
    sys.stdout.write(
        f"build-master-template: wrote {output} ({size_kb} KB)\n"
        f"  {len(names)} DataArt layouts: {', '.join(n.replace('DataArt — ','') for n in names)}\n"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
