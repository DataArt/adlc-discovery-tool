/* slide-checks.js — SINGLE SOURCE OF TRUTH for per-slide checks.
 * Injected by verify-slide.sh (Claude Preview path) AND verify-deck-headless.py
 * (Playwright batch path). Defines window.__runSlideChecks(slideFile) → report.
 * Do NOT duplicate this logic elsewhere. */
window.__runSlideChecks = function (slideFile) {
  const SLIDE_FILE = slideFile || document.title || 'slide';
  const TOL = 1; // pixel tolerance, accounts for sub-pixel rounding
  const within = (a, b) => Math.abs(a - b) <= TOL;
  const rectOf = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x),
      y: Math.round(r.y),
      width: Math.round(r.width),
      height: Math.round(r.height),
      right: Math.round(r.right),
      bottom: Math.round(r.bottom),
    };
  };
  const check = (name, expected, actual, predicate) => ({
    name,
    expected,
    actual,
    passed: predicate(expected, actual),
  });

  const slide = rectOf('.slide');
  const logoBare = rectOf('.logo');
  const sectionHeader = rectOf('.zone-heading') || rectOf('.slide-heading');
  const pageNumber = rectOf('.page-number');

  const rectChecks = [];

  // Part 28 — CSS-loaded gate. Detects the «agent linked only tokens.css
  // and skipped layouts.css/components.css» class of bugs (Onepark deck
  // regression). When kit stylesheets are missing, `.slide` falls back
  // to default `display: block` with no fixed width/height — page
  // collapses to default block flow and stretches several thousand
  // pixels tall. Catch this BEFORE other rect checks (which would all
  // fail noisily as a side-effect).
  const slideEl = document.querySelector('.slide');
  const layerEl = document.querySelector('.layer');
  const cssLoaded = (() => {
    if (!slideEl) return { passed: false, reason: 'no .slide element' };
    const cs = getComputedStyle(slideEl);
    if (cs.position !== 'absolute') {
      return {
        passed: false,
        reason: `.slide has position: ${cs.position} (expected absolute — tokens.css not loaded)`,
      };
    }
    if (parseInt(cs.width) < 1920) {
      return {
        passed: false,
        reason: `.slide width ${cs.width} (expected ≥ 1920 — layouts.css not applying)`,
      };
    }
    if (layerEl) {
      const csLayer = getComputedStyle(layerEl);
      if (csLayer.position !== 'absolute') {
        return {
          passed: false,
          reason: `.layer has position: ${csLayer.position} (expected absolute — layouts.css not loaded)`,
        };
      }
    }
    // Also confirm at least 2 stylesheets reachable (tokens + layouts at minimum).
    const linkedSheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const sharedSheets = linkedSheets.filter((l) =>
      /\/shared\/(tokens|layouts|components)\.css/.test(l.href || '')
    );
    if (sharedSheets.length < 3) {
      return {
        passed: false,
        reason: `only ${sharedSheets.length} kit shared stylesheets linked (expected 3: tokens.css + layouts.css + components.css)`,
        linked: linkedSheets.map((l) => l.getAttribute('href')),
      };
    }
    return { passed: true };
  })();
  rectChecks.push({
    name: 'css-loaded',
    expected:
      '.slide position: absolute, width ≥ 1920, .layer position: absolute, all 3 kit shared stylesheets linked',
    actual: cssLoaded.passed ? 'ok' : cssLoaded.reason,
    passed: cssLoaded.passed,
    ...(cssLoaded.linked ? { linked_stylesheets: cssLoaded.linked } : {}),
  });

  rectChecks.push(
    check(
      'slide-canvas',
      { x: 0, y: 0, width: 1920, height: 1080 },
      slide,
      (e, a) =>
        a &&
        within(a.x, e.x) &&
        within(a.y, e.y) &&
        within(a.width, e.width) &&
        within(a.height, e.height)
    )
  );

  // Corporate kit logo = `.logo` (small DataArt mark) top-right at (1544,139) 223×36
  // (bumped ~+13% per new Figma; right edge still ≤ 1766.667).
  if (logoBare) {
    rectChecks.push(
      check(
        'logo',
        { x: 1544, y: 139, width: 223, height: 36 },
        logoBare,
        (e, a) =>
          a &&
          within(a.x, e.x) &&
          within(a.y, e.y) &&
          within(a.width, e.width) &&
          within(a.height, e.height)
      )
    );
    rectChecks.push(
      check('logo-right-edge', { rightLeq: 1920 }, logoBare, (e, a) => a && a.right <= e.rightLeq)
    );
  } else {
    rectChecks.push({
      name: 'logo',
      expected: '.logo present',
      actual: null,
      passed: true,
      skipped: 'no .logo (e.g. some cover / use-as-is slides use a large/white logo)',
    });
  }

  if (sectionHeader) {
    // Corporate kit heading zone: `.zone-heading` / `.slide-heading` at (153, 115).
    rectChecks.push(
      check(
        'heading-zone',
        { x: 153, y: 115 },
        sectionHeader,
        (e, a) => a && within(a.x, e.x) && within(a.y, e.y)
      )
    );
  } else {
    rectChecks.push({
      name: 'heading-zone',
      expected: '.zone-heading / .slide-heading at (153,115)',
      actual: null,
      passed: true,
      skipped: 'no heading zone (cover / statement / pipeline-white slide)',
    });
  }

  rectChecks.push(
    check(
      'page-number-y',
      { yApprox: 985 },
      pageNumber,
      (e, a) => a && Math.abs(a.y - e.yApprox) <= 4
    )
  );

  // Asset 404s — any <img> whose naturalWidth is 0 after load.
  const imageErrors = Array.from(document.images)
    .filter((img) => img.complete && img.naturalWidth === 0)
    .map((img) => img.getAttribute('src'));
  rectChecks.push({
    name: 'images-resolved',
    expected: 'all <img> naturalWidth > 0',
    actual: imageErrors.length === 0 ? 'ok' : imageErrors,
    passed: imageErrors.length === 0,
  });

  // Vertical overflow — content must fit inside the 1080 px canvas.
  // Forces native scale=1 so getBoundingClientRect returns canvas coords.
  // Tolerates 4 px of sub-pixel slack.
  // NB: `slide` (above) is a rect from rectOf(); we need the ELEMENT here.
  const slideNode = document.querySelector('.slide');
  const _prevScale = slideNode ? slideNode.style.getPropertyValue('--slide-scale') : '';
  if (slideNode) slideNode.style.setProperty('--slide-scale', '1');
  const visibleNodes = slideNode
    ? Array.from(slideNode.querySelectorAll('*')).filter((el) => {
        const cs = getComputedStyle(el);
        return (
          cs.display !== 'none' &&
          cs.visibility !== 'hidden' &&
          parseFloat(cs.opacity || '1') > 0 &&
          el.getBoundingClientRect().height > 0
        );
      })
    : [];
  const slideTop = slideNode ? slideNode.getBoundingClientRect().top : 0;
  const maxBottomLocal = visibleNodes.length
    ? Math.max(...visibleNodes.map((el) => el.getBoundingClientRect().bottom - slideTop))
    : 0;
  if (slideNode) {
    if (_prevScale) slideNode.style.setProperty('--slide-scale', _prevScale);
    else slideNode.style.removeProperty('--slide-scale');
  }
  const CANVAS_H = 1080;
  const OVERFLOW_TOLERANCE = 4;
  const overflowPx = Math.max(0, Math.round(maxBottomLocal - CANVAS_H));
  rectChecks.push({
    name: 'vertical-overflow',
    expected: `max content bottom ≤ ${CANVAS_H}px (tolerance ${OVERFLOW_TOLERANCE}px)`,
    actual: `max bottom ${Math.round(maxBottomLocal)}px (overflow ${overflowPx}px)`,
    passed: overflowPx <= OVERFLOW_TOLERANCE,
  });

  // Part 29 — Eyebrow legacy Mode A misuse gate.
  // Forked slides often carry `.col-accent` + `.col-num` with TEXT content
  // (not single digit) — the legacy `top:19px` line then lands midline of
  // the eyebrow text → strikethrough effect. Part 22 §0.13 requires
  // `.col-eyebrow` inline pattern for text eyebrows.
  const eyebrowMisuse = [];
  document.querySelectorAll('.col-accent').forEach((accent) => {
    const col = accent.closest('.col');
    if (!col) return;
    const colNum = col.querySelector('.col-num');
    if (!colNum) return;
    const text = (colNum.textContent || '').trim();
    // Single digit (1, 01, 2, etc.) is OK — Mode A canonical use.
    if (/^\d{1,2}$/.test(text)) return;
    // Anything else = text eyebrow misused with Mode A.
    eyebrowMisuse.push(text.slice(0, 40));
  });
  rectChecks.push({
    name: 'eyebrow-legacy-mode-a-misuse',
    expected: '.col-accent paired with .col-num containing single digit only (Part 22 §0.13)',
    actual:
      eyebrowMisuse.length === 0
        ? 'ok'
        : `text eyebrows under .col-accent (would strikethrough): ${JSON.stringify(eyebrowMisuse)}`,
    passed: eyebrowMisuse.length === 0,
  });

  // Part 29 — Service-light top-half overflow gate.
  // If the slide uses bg-light-top + bg-dark-bot split, top-half text
  // MUST fit in the light region (top:348 → bg-dark-bot boundary at 840).
  // Overflow bleeds into dark area + overlaps bot-text at top:947.
  const hasLightTop = !!document.querySelector('.bg-light-top');
  const hasDarkBot = !!document.querySelector('.bg-dark-bot');
  if (hasLightTop && hasDarkBot) {
    const slideEl = document.querySelector('.slide');
    const topTexts = document.querySelectorAll('.layer-top-text, .top-headline, .top-body');
    let topBottomMax = 0;
    if (slideEl && topTexts.length) {
      // Force scale=1 for canvas coords.
      const prev = slideEl.style.getPropertyValue('--slide-scale');
      slideEl.style.setProperty('--slide-scale', '1');
      const slideTop = slideEl.getBoundingClientRect().top;
      topTexts.forEach((el) => {
        const r = el.getBoundingClientRect();
        const bottomCanvas = r.bottom - slideTop;
        if (bottomCanvas > topBottomMax) topBottomMax = bottomCanvas;
      });
      if (prev) slideEl.style.setProperty('--slide-scale', prev);
      else slideEl.style.removeProperty('--slide-scale');
    }
    const DARK_BG_TOP = 840;
    const SLOP = 11;
    const overflow = Math.max(0, Math.round(topBottomMax - DARK_BG_TOP));
    rectChecks.push({
      name: 'service-light-top-overflow',
      expected: `top-half text bottom ≤ ${DARK_BG_TOP}px (light/dark boundary)`,
      actual: `top-text max bottom ${Math.round(topBottomMax)}px (overflow ${overflow}px)`,
      passed: overflow <= SLOP,
    });
  }

  // ============================================================
  // Composition contrast gates (Part 33) — see verification.md § 6.
  // Catches text-over-image, card-pair-contrast, and title-rhythm
  // failures the kit's utilities are designed to prevent.
  // ============================================================
  const compositionContrast = [];

  function relLuminance(cssColor) {
    if (!cssColor) return null;
    const m = cssColor.match(/rgba?\((-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)/);
    if (!m) return null;
    const norm = (v) => {
      const n = parseFloat(v) / 255;
      return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * norm(m[1]) + 0.7152 * norm(m[2]) + 0.0722 * norm(m[3]);
  }
  function rectsIntersect(a, b) {
    return !(b.right < a.left || b.left > a.right || b.bottom < a.top || b.top > a.bottom);
  }

  // § 6.7 — Kit stylesheet source check (Part 40, hard gate).
  // The rect-check `css-loaded` at the top of this file confirms 3
  // kit shared stylesheets are linked. This gate goes further: it
  // rejects any slide that ALSO carries:
  //   - External CDN links (cdnjs, jsdelivr, unpkg, tailwindcss CDN)
  //   - Inline <style> blocks > 200 chars (heuristic: agent rolled
  //     its own CSS instead of using kit/shared/components.css)
  //   - <link> to non-kit local stylesheets (anything starting with
  //     `../` but not pointing at /kit-corporate/shared/)
  //
  // Three checks, each independently blocking. The kit is the ONLY
  // source of visual components; substituted stylesheets are not
  // a DataArt deck.
  {
    const allLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const externalCDN = allLinks.filter((l) => {
      const href = l.getAttribute('href') || '';
      return /^https?:\/\/(cdn|cdnjs|jsdelivr|unpkg|tailwindcss)/i.test(href);
    });
    const nonKitLocal = allLinks.filter((l) => {
      const href = l.getAttribute('href') || '';
      return (
        (href.startsWith('../') || href.startsWith('./')) &&
        !href.includes('/kit-corporate/shared/')
      );
    });
    const inlineStyleBlocks = Array.from(document.querySelectorAll('style')).filter(
      (s) => (s.textContent || '').length > 200
    );

    if (externalCDN.length > 0) {
      compositionContrast.push({
        name: 'kit_substitution_external_cdn',
        expected: 'no external CDN stylesheets (kit is the only source)',
        actual: externalCDN.map((l) => l.getAttribute('href')).join(', '),
        passed: false,
      });
    }
    if (nonKitLocal.length > 0) {
      compositionContrast.push({
        name: 'kit_substitution_non_kit_local',
        expected: 'no local stylesheets outside kit/shared/',
        actual: nonKitLocal.map((l) => l.getAttribute('href')).join(', '),
        passed: false,
      });
    }
    if (inlineStyleBlocks.length > 0) {
      compositionContrast.push({
        name: 'kit_substitution_inline_styles',
        expected: 'no <style> blocks > 200 chars (use kit components.css)',
        actual: inlineStyleBlocks.length + ' inline <style> block(s) > 200 chars',
        passed: false,
      });
    }
  }

  // § 6.1 — Text-over-image gate.
  const imgs = Array.from(document.querySelectorAll('.slide img')).filter((el) => {
    const cs = window.getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden';
  });
  const textElems = Array.from(
    document.querySelectorAll('.slide p, .slide h1, .slide h2, .slide h3, .slide li, .slide span')
  ).filter((el) => {
    const cs = window.getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    if (parseFloat(cs.opacity || '1') < 0.05) return false;
    return (el.innerText || '').trim().length > 0;
  });
  for (const img of imgs) {
    const imgRect = img.getBoundingClientRect();
    if (imgRect.width < 50 || imgRect.height < 50) continue;
    const overlaps = textElems.filter((t) => rectsIntersect(imgRect, t.getBoundingClientRect()));
    if (overlaps.length === 0) continue;
    const wrapper = img.closest('.image-overlay');
    if (!wrapper) {
      compositionContrast.push({
        name: 'text_over_image_missing_scrim',
        expected: '<img> with overlay text must be inside .image-overlay',
        actual: 'no .image-overlay wrapper; ' + overlaps.length + ' text element(s) overlap',
        passed: false,
      });
      continue;
    }
    const scrimDirMatch = /(^|\s)(scrim-bottom|scrim-top|scrim-left|scrim-radial)(\s|$)/.test(
      wrapper.className
    );
    if (!scrimDirMatch) {
      compositionContrast.push({
        name: 'text_over_image_scrim_direction_missing',
        expected: '.image-overlay must carry one of scrim-bottom|top|left|radial',
        actual: '.image-overlay className: ' + wrapper.className,
        passed: false,
      });
    }
  }

  // § 6.2 — Card-pair contrast gate.
  const cards = document.querySelectorAll('.slide .card.is-light, .slide .card.is-dark');
  for (const card of cards) {
    const isLight = card.classList.contains('is-light');
    const parentLayer = card.parentElement && card.parentElement.closest('.layer');
    if (!parentLayer) continue;
    const fillingMedia = parentLayer.querySelector(':scope > img, :scope > svg');
    if (fillingMedia) {
      const mediaRect = fillingMedia.getBoundingClientRect();
      const parentRect = parentLayer.getBoundingClientRect();
      if (
        mediaRect.width >= parentRect.width * 0.8 &&
        mediaRect.height >= parentRect.height * 0.8
      ) {
        continue;
      }
    }
    const parentBg = window.getComputedStyle(parentLayer).backgroundColor;
    const lum = relLuminance(parentBg);
    if (lum === null) continue;
    const cardClassName = isLight ? '.card.is-light' : '.card.is-dark';
    const expected = isLight
      ? 'parent luminance < 0.5 (dark/colored)'
      : 'parent luminance > 0.5 (light)';
    const violated = (isLight && lum > 0.5) || (!isLight && lum < 0.5);
    if (violated) {
      compositionContrast.push({
        name: 'card_pair_contrast_violated',
        expected: cardClassName + ' requires ' + expected,
        actual: 'parent layer luminance ' + lum.toFixed(2),
        passed: false,
      });
    }
  }

  // § 6.3 — Title rhythm gate.
  const titles = document.querySelectorAll('.slide .txt-h1, .slide .txt-h2, .slide .txt-hero');
  for (const t of titles) {
    const next = t.nextElementSibling;
    if (!next) continue;
    if (!next.matches('.txt-body, .txt-body-lg')) continue;
    if (!t.closest('.title-stack')) {
      compositionContrast.push({
        name: 'title_rhythm_missing_stack',
        expected: '.txt-h1/h2/hero + .txt-body sibling pair must be inside .title-stack',
        actual:
          t.className + ' title sibling-followed by ' + next.className + ' without .title-stack',
        passed: false,
      });
    }
  }

  // § 6.6 — Nowrap-overflow gate (Part 39).
  // Walks every visible text element, checks if computed style has
  // `white-space: nowrap`, and if so verifies its rendered width
  // doesn't exceed its containing flex / grid slot. Catches the
  // class of bug where a long label in a kit nowrap-slot
  // (.bullet-row p, .col-num, .stat-row, .section-header,
  // .tagline-footer) overflows into the neighbouring cell.
  // Also catches the «text wraps but still cramped» case: nowrap
  // removed (Part 39 fix on .bullet-row p) but if the text is still
  // too long to fit comfortably, scrollWidth > clientWidth indicates
  // visible overflow in the rendered layout.
  const allTextElems = document.querySelectorAll(
    '.slide p, .slide h1, .slide h2, .slide h3, .slide h4, ' +
      '.slide h5, .slide h6, .slide span, .slide li'
  );
  for (const el of allTextElems) {
    const cs = window.getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (parseFloat(cs.opacity || '1') < 0.05) continue;
    const text = (el.innerText || '').trim();
    if (!text) continue;
    // Two overflow signals:
    //   (1) white-space: nowrap AND text wider than parent's available width
    //   (2) any text whose scrollWidth > clientWidth + 2px (visual overflow)
    const hasNowrap = (cs.whiteSpace || '').includes('nowrap');
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    let overflowed = false;
    let slotWidth = null;
    let textWidth = null;
    if (el.scrollWidth > el.clientWidth + 2) {
      overflowed = true;
      slotWidth = el.clientWidth;
      textWidth = el.scrollWidth;
    } else if (hasNowrap) {
      // Compare against parent's content width — nowrap text might
      // visually stay within its rect (because the rect grew with
      // it), but the parent flex/grid container will hit overflow.
      const parent = el.parentElement;
      if (parent) {
        const parentCs = window.getComputedStyle(parent);
        const parentPadL = parseFloat(parentCs.paddingLeft) || 0;
        const parentPadR = parseFloat(parentCs.paddingRight) || 0;
        const parentRect = parent.getBoundingClientRect();
        const parentContentWidth = parentRect.width - parentPadL - parentPadR;
        if (rect.width > parentContentWidth + 2) {
          overflowed = true;
          slotWidth = parentContentWidth;
          textWidth = rect.width;
        }
      }
    }
    if (overflowed) {
      const textPreview = text.length > 40 ? text.slice(0, 40) + '…' : text;
      compositionContrast.push({
        name: 'nowrap_overflow',
        expected: 'text width ≤ slot content width (or text wraps cleanly inside slot)',
        actual:
          'text "' +
          textPreview +
          '" ' +
          textWidth.toFixed(0) +
          'px in ' +
          slotWidth.toFixed(0) +
          'px slot (' +
          el.tagName +
          (el.className ? '.' + el.className.split(' ')[0] : '') +
          ')',
        passed: false,
      });
    }
  }

  // § 6.5 — Bullet-grid in narrow column gate (Part 38).
  // When a .disc-list (with or without .has-icons) sits inside a
  // narrow column (≤ 500px content width) AND lays out 2+ items per
  // row (siblings sharing the same y), flag as violating § 0.18.
  // PowerPoint Arial drift can push wrapped text into the neighbouring
  // column; vertical stacking eliminates that risk.
  const bulletLists = document.querySelectorAll('.slide ul.disc-list');
  for (const ul of bulletLists) {
    const items = [...ul.children].filter((c) => c.tagName === 'LI');
    if (items.length < 2) continue;
    // Detect 2+ items per row by y-coordinate clustering.
    const tolerance = 10;
    let sameRow = false;
    for (let i = 0; i < items.length && !sameRow; i++) {
      for (let j = i + 1; j < items.length && !sameRow; j++) {
        const ya = items[i].getBoundingClientRect().y;
        const yb = items[j].getBoundingClientRect().y;
        if (Math.abs(ya - yb) < tolerance) sameRow = true;
      }
    }
    if (!sameRow) continue; // already vertical stack — passes.
    // Find the column-level parent: nearest ancestor with explicit
    // width or class hinting a column container.
    let parent = ul.parentElement;
    let parentWidth = null;
    while (parent && parent !== document.body) {
      const r = parent.getBoundingClientRect();
      if (r.width > 0 && r.width < 1920) {
        // Treat first sized ancestor as the column.
        parentWidth = r.width;
        break;
      }
      parent = parent.parentElement;
    }
    if (parentWidth === null || parentWidth > 667) continue;
    compositionContrast.push({
      name: 'bullet_grid_in_narrow_column',
      expected: 'bullet-list in column ≤667px must stack vertically (1 per row)',
      actual:
        'parent column ' +
        parentWidth.toFixed(0) +
        'px contains ' +
        items.length +
        ' bullets in multi-col layout',
      passed: false,
    });
  }

  // § 6.4 — Bottom-edge padding gate (Part 34).
  // No content element's bottom edge may sit closer than 80px to
  // canvas bottom. Excludes the canonical footer chrome on the y=739
  // baseline (.footer-tagline / .footer-section / .page-number) and
  // .side-bar (full-height decoration) — those are kit chrome, not
  // content, and legitimately sit ~76px from the 1080 bottom.
  const slideElem = document.querySelector('.slide');
  if (slideElem) {
    const slideRect = slideElem.getBoundingClientRect();
    const canvasBottom = slideRect.bottom;
    const FLOOR_PX = 107;
    // `.bg` is the full-bleed background layer (fills the whole 1080 canvas →
    // bottom gap 0 by design); it is decoration, not content.
    const CHROME = ['page-number', 'footer-tagline', 'footer-section', 'side-bar', 'bg'];
    const contentElems = document.querySelectorAll(
      '.slide .layer:not(.page-number):not(.footer-tagline):not(.footer-section):not(.side-bar):not(.bg), ' +
        '.slide img, .slide .card, .slide .title-stack'
    );
    for (const el of contentElems) {
      // Guard against nested chrome cases the :not() selector missed.
      if (el.classList && CHROME.some((c) => el.classList.contains(c))) continue;
      const r = el.getBoundingClientRect();
      // Skip elements that have zero size or sit entirely above the
      // canvas — they're not content occupying bottom-half real estate.
      if (r.width === 0 || r.height === 0) continue;
      if (r.bottom < slideRect.top) continue;
      const gap = canvasBottom - r.bottom;
      if (gap < FLOOR_PX && gap >= 0) {
        compositionContrast.push({
          name: 'bottom_padding_violated',
          expected: 'content bottom edge ≥ 107px from canvas bottom',
          actual: 'gap ' + gap.toFixed(0) + 'px (element: ' + (el.className || el.tagName) + ')',
          passed: false,
        });
        // One violation per slide is enough — don't spam the report
        // with cascade-failures when a parent and child both overshoot.
        break;
      }
    }
  }

  // § 6.12 — Safe-zone + logo-overlap gate (Part 58, BLOCKING).
  // Catches (a) text crossing the kit's L/R safe margins (153.333 / 1766.667)
  // and (b) text colliding with the top-right .logo (a long heading running
  // under the logo — the heading zone is 1613.333px wide and ends at 1766.667,
  // but the logo sits at x=1569, so an over-long heading overlaps it).
  // Uses Range line-boxes (tight to the glyphs) NOT the element rect, so a
  // full-width block container never false-fires — only rendered text counts.
  {
    const SAFE_L = 153.333,
      SAFE_R = 1920 - 153.333,
      EDGE_TOL = 2;
    const sEl = document.querySelector('.slide');
    if (sEl) {
      const prev = sEl.style.getPropertyValue('--slide-scale');
      sEl.style.setProperty('--slide-scale', '1');
      const sR = sEl.getBoundingClientRect();
      const sx = sR.left,
        sy = sR.top;
      const logoEl = document.querySelector('.logo');
      let logoBox = null;
      if (logoEl) {
        const r = logoEl.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          logoBox = {
            left: r.left - sx,
            right: r.right - sx,
            top: r.top - sy,
            bottom: r.bottom - sy,
          };
        }
      }
      const lineBoxes = (el) => {
        try {
          const rng = document.createRange();
          rng.selectNodeContents(el);
          return [...rng.getClientRects()].filter((r) => r.width > 1 && r.height > 1);
        } catch (e) {
          return [];
        }
      };
      const textEls = document.querySelectorAll(
        '.slide p, .slide h1, .slide h2, .slide h3, .slide h4, .slide h5, .slide h6, .slide li'
      );
      let outside = null,
        overlap = null;
      for (const el of textEls) {
        const cs = window.getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        if (parseFloat(cs.opacity || '1') < 0.05) continue;
        // Footer chrome sits exactly on the margins by design — exempt it.
        if (
          el.closest(
            '.page-number, .footer-tagline, .footer-section, .footer--website, .cover-web, .cover2-web'
          )
        )
          continue;
        if (el.closest('.logo')) continue; // the logo's own alt/text, if any
        if (!(el.innerText || '').trim()) continue;
        for (const r of lineBoxes(el)) {
          const left = r.left - sx,
            right = r.right - sx,
            top = r.top - sy,
            bottom = r.bottom - sy;
          if (!outside && (left < SAFE_L - EDGE_TOL || right > SAFE_R + EDGE_TOL)) {
            outside = {
              t: (el.innerText || '').trim().slice(0, 40),
              l: Math.round(left),
              r: Math.round(right),
            };
          }
          if (
            !overlap &&
            logoBox &&
            !(
              right < logoBox.left ||
              left > logoBox.right ||
              bottom < logoBox.top ||
              top > logoBox.bottom
            )
          ) {
            overlap = { t: (el.innerText || '').trim().slice(0, 40) };
          }
        }
        if (outside && overlap) break;
      }
      if (prev) sEl.style.setProperty('--slide-scale', prev);
      else sEl.style.removeProperty('--slide-scale');

      if (outside)
        compositionContrast.push({
          name: 'text_outside_safe_zone',
          expected: `text within L/R safe margins [${SAFE_L}, ${SAFE_R.toFixed(3)}]px`,
          actual: `"${outside.t}" spans x ${outside.l}..${outside.r}px`,
          passed: false,
        });
      if (overlap)
        compositionContrast.push({
          name: 'text_overlaps_logo',
          expected: 'no text intersects the top-right .logo (shorten the heading)',
          actual: `"${overlap.t}" runs under/into the logo`,
          passed: false,
        });
    }
  }

  // § 6.13 — Stacked text overlap gate (Part 58, BLOCKING).
  // Catches a text block whose rendered text drops onto another text block — the
  // "description runs under the next row / line" bug (e.g. a 2-line description
  // overlapping a "The difference …" row). Compares tight Range line-boxes of
  // LEAF text elements (a <p>/<h*>/<li> with no nested block child) — NOT
  // containers, whose union-box would span a whole cards zone and false-fire.
  // Two leaves that intersect by > 4px in BOTH axes and are not nested = overlap.
  {
    const sEl = document.querySelector('.slide');
    if (sEl) {
      const prev = sEl.style.getPropertyValue('--slide-scale');
      sEl.style.setProperty('--slide-scale', '1');
      const OV = 4;
      const BLOCK = 'P,H1,H2,H3,H4,H5,H6,LI';
      const isLeaf = (el) => ![...el.children].some((c) => BLOCK.includes(c.tagName));
      const tightBox = (el) => {
        try {
          const rng = document.createRange();
          rng.selectNodeContents(el);
          const rs = [...rng.getClientRects()].filter((r) => r.width > 1 && r.height > 1);
          if (!rs.length) return null;
          return {
            left: Math.min(...rs.map((r) => r.left)),
            right: Math.max(...rs.map((r) => r.right)),
            top: Math.min(...rs.map((r) => r.top)),
            bottom: Math.max(...rs.map((r) => r.bottom)),
          };
        } catch (e) {
          return null;
        }
      };
      const items = [...sEl.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li')]
        .filter((el) => {
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden') return false;
          if (parseFloat(cs.opacity || '1') < 0.05) return false;
          if (el.closest('.page-number, .footer-tagline, .footer-section')) return false;
          return isLeaf(el) && (el.innerText || '').trim().length > 0;
        })
        .map((el) => ({ el, box: tightBox(el) }))
        .filter((o) => o.box);
      let clash = null;
      for (let i = 0; i < items.length && !clash; i++) {
        for (let j = i + 1; j < items.length && !clash; j++) {
          const A = items[i],
            B = items[j];
          if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
          const a = A.box,
            b = B.box;
          const xOv = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const yOv = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (xOv > OV && yOv > OV) {
            clash = {
              a: (A.el.innerText || '').trim().slice(0, 28),
              b: (B.el.innerText || '').trim().slice(0, 28),
              x: Math.round(xOv),
              y: Math.round(yOv),
            };
          }
        }
      }
      if (prev) sEl.style.setProperty('--slide-scale', prev);
      else sEl.style.removeProperty('--slide-scale');
      if (clash)
        compositionContrast.push({
          name: 'stacked_text_overlap',
          expected: 'no two text layers overlap (shorten copy or move the lower element down)',
          actual: `"${clash.a}" overlaps "${clash.b}" by ${clash.x}×${clash.y}px`,
          passed: false,
        });
    }
  }

  // § 6.9 — Em-dash gate (BLOCKING). The em dash "—" (U+2014) is banned in
  // deck copy: it reads as an AI writing tic and is visually heavy on slides.
  // Rephrase with a colon, comma, parentheses, or two sentences. (Regular
  // hyphens "-" in compound words like "end-to-end" / "CI/CD" are fine.)
  {
    const emDashEls = [];
    const txtNodes = document.querySelectorAll(
      '.slide p, .slide h1, .slide h2, .slide h3, .slide h4, .slide h5, ' +
        '.slide h6, .slide span, .slide li, .slide div'
    );
    const seen = new Set();
    for (const el of txtNodes) {
      // own text only (avoid counting an ancestor's text repeatedly)
      const own = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.nodeValue)
        .join('');
      if (own.indexOf('—') !== -1) {
        const snip = own.trim().slice(0, 40);
        if (!seen.has(snip)) {
          seen.add(snip);
          emDashEls.push(snip);
        }
      }
    }
    if (emDashEls.length > 0) {
      compositionContrast.push({
        name: 'em_dash_banned',
        expected:
          'no em dash "—" (U+2014) in slide copy — rephrase with a colon / comma / parentheses',
        actual:
          emDashEls.length +
          ' text(s) contain an em dash: ' +
          JSON.stringify(emDashEls.slice(0, 5)),
        passed: false,
      });
    }
  }

  // § 6.9b — DataArt global-presence map must not appear on a client slide.
  // The map (assets/graphics/fastfacts-map.png) depicts DataArt's own footprint
  // and belongs ONLY to asis-fastfacts. A common failure is forking the Fast
  // Facts layout for a client "X today" overview and dragging the map along
  // (it means nothing to the client). Any slide whose file is NOT the
  // asis-fastfacts template but that references fastfacts-map → fail; use a
  // client-relevant visual or a labelled placeholder (e.g. content-stats-map).
  if (!/asis-fastfacts/i.test(SLIDE_FILE)) {
    const mapImg = document.querySelector('.slide img[src*="fastfacts-map"]');
    if (mapImg) {
      compositionContrast.push({
        name: 'dataart_map_reused',
        expected:
          'DataArt global-presence map (fastfacts-map.png) only on asis-fastfacts — ' +
          'use a client-relevant visual or a placeholder on other slides',
        actual:
          'this non-fastfacts slide loads the DataArt map: ' + (mapImg.getAttribute('src') || ''),
        passed: false,
      });
    }
  }

  // § 6.8 — Column-gutter cramp check (INFORMATIONAL — never fails the slide).
  // Two adjacent columns / captions that sit < 20px apart (or overlap) read as
  // "touching" even though each stays inside the 1920 canvas — the class of
  // bug where hand-built multi-column text crowds the gutter or a divider cuts
  // through copy. The standard kit gutter is 42.667px, so a 27px floor never
  // false-fires on a correct layout. Emitted as a warning the agent should eye
  // in the Step 9 screenshot review; it does NOT set passed=false.
  const crampWarnings = [];
  const rowContainers = document.querySelectorAll(
    '.slide .cols, .slide .compare, .slide .pipeline, .slide .steps, .slide .split'
  );
  const checkRow = (els) => {
    const boxes = [...els]
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter((b) => b.r.width > 0 && b.r.height > 0)
      .sort((a, b) => a.r.left - b.r.left);
    for (let i = 1; i < boxes.length; i++) {
      const gap = boxes[i].r.left - boxes[i - 1].r.right;
      if (gap < 27) {
        const cls = (boxes[i].el.className || boxes[i].el.tagName).toString().split(' ')[0];
        crampWarnings.push({
          name: 'column_gutter_cramped',
          detail:
            'adjacent columns ' +
            gap.toFixed(0) +
            'px apart (< 27px; .' +
            cls +
            ') — shorten copy or widen layout; eyeball the screenshot',
        });
      }
    }
  };
  for (const c of rowContainers) {
    checkRow(
      [...c.children].filter(
        (ch) => !/\bpipe-arrow\b|\bstep-arrow\b|\bcol-divider\b/.test(ch.className || '')
      )
    );
  }
  // Card-row icon alignment (INFORMATIONAL). In a row of cards (a `.cols` /
  // `.box-grid` of ≥2 siblings) the per-card icon should sit at the SAME top
  // across cards. A spread > 32px means the icon "floats" to a different height
  // per card — usually `justify-content: space-between` or a centred middle
  // block, or unequal title line-counts without a reserved title height
  // (kit-map § 7 "Card vertical rhythm"). A correctly top-anchored row is 0px
  // spread, so a low (21px) floor warns on any real float without false-firing
  // on a clean layout. Warn so the agent eyeballs/fixes it.
  for (const c of document.querySelectorAll('.slide .cols, .slide .box-grid')) {
    const cards = [...c.children].filter((ch) => {
      const r = ch.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    if (cards.length < 2) continue;
    const tops = [];
    for (const card of cards) {
      const icon = card.querySelector('img, svg, .ib-icon, .nc-icon, .media-frame');
      if (icon) {
        const r = icon.getBoundingClientRect();
        if (r.height > 0) tops.push(Math.round(r.top));
      }
    }
    if (tops.length >= 2) {
      const spread = Math.max(...tops) - Math.min(...tops);
      if (spread > 21) {
        crampWarnings.push({
          name: 'card_icons_misaligned',
          detail:
            'card-row icons span ' +
            spread +
            'px vertically (> 21px) — they ' +
            'float to different heights. Top-anchor the cards + reserve the ' +
            'title height (kit-map § 7 "Card vertical rhythm"); avoid ' +
            'justify-content:space-between.',
        });
      }
    }
  }
  // Same-row absolute text layers (e.g. the two-column summary captions).
  const textLayers = [...document.querySelectorAll('.slide > .layer')].filter(
    (el) => el.tagName === 'P' && (el.innerText || '').trim()
  );
  const byTop = {};
  for (const el of textLayers) {
    const t = Math.round(el.getBoundingClientRect().top / 8) * 8;
    (byTop[t] = byTop[t] || []).push(el);
  }
  for (const t in byTop) if (byTop[t].length > 1) checkRow(byTop[t]);

  // Console — best-effort. If a sink was pre-installed, read it; else
  // mark as not-instrumented (the agent can still observe live console
  // output through preview_console_logs).
  const sink = window.__deckConsoleSink;
  const consoleErrors = sink ? sink.errors.slice() : [];
  const consoleWarnings = sink ? sink.warnings.slice() : [];
  const consoleCapture = sink ? 'instrumented' : 'not-instrumented';

  const allPassed =
    rectChecks.every((c) => c.passed) &&
    compositionContrast.every((c) => c.passed) &&
    consoleErrors.length === 0;

  return {
    slide_file: SLIDE_FILE,
    viewport: { w: window.innerWidth, h: window.innerHeight },
    rect_checks: rectChecks,
    composition_contrast: compositionContrast,
    image_errors: imageErrors,
    console_errors: consoleErrors,
    console_warnings: consoleWarnings,
    console_capture: consoleCapture,
    cramp_warnings: crampWarnings, // informational only (does not affect passed)
    passed: allPassed,
  };
};
