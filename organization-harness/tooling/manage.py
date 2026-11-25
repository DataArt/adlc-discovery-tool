#!/usr/bin/env python3
"""Dependency-free scaffold tooling; not an official schema validator."""
import argparse
import json
import re
import shutil
import tomllib
import tempfile
from zoneinfo import ZoneInfo
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
MARKET = ROOT / '.agents/plugins/marketplace.json'
STANDARD = ROOT / 'shared/standards/operating-principles.md'

def read(path):
    return json.loads(path.read_text(encoding='utf-8'))

def skills():
    return sorted(ROOT.glob('plugins/*/skills/*/SKILL.md'))

def generated(plugin, dest):
    """Build the shared skill copies into dest without mutating source."""
    config = read(plugin/'build.config.json')
    for name in config['sharedSkills']:
        target = dest/name
        shutil.copytree(ROOT/'shared/skills'/name, target)
        refs = target/'references'
        refs.mkdir(exist_ok=True)
        shutil.copyfile(plugin/'build.config.json', refs/'plugin-config.json')
        shutil.copyfile(STANDARD, refs/'operating-principles.md')
        if name in ('agent-setup','onboarding'):
            (refs/'agents').mkdir()
            for path in sorted((plugin/'agents').glob('*.toml')):
                shutil.copyfile(path, refs/'agents'/path.name)
            for shared in config['sharedAgents']:
                path = ROOT/'shared/agents'/f'{shared}.toml'
                assert not (refs/'agents'/path.name).exists(), f'Duplicate agent {path.name}'
                shutil.copyfile(path, refs/'agents'/path.name)
        if name in ('job-setup','onboarding'):
            shutil.copytree(plugin/'jobs', refs/'jobs')
        if name == 'onboarding':
            procedures = refs/'procedures'
            procedures.mkdir()
            for shared in config['sharedSkills']:
                if shared != 'onboarding':
                    text = (ROOT/'shared/skills'/shared/'SKILL.md').read_text()
                    # Adapt links to the onboarding skill root; all resources are bundled.
                    shutil.copyfile(ROOT/'shared/skills'/shared/'SKILL.md', procedures/f'{shared}.md')
            shutil.copytree(ROOT/'shared/skills/connector-setup/references/connectors', refs/'connectors')
            # Procedure references resolve relative to the parent skill root, as instructed.

def files_under(path):
    return {p.relative_to(path).as_posix(): p.read_bytes() for p in path.rglob('*') if p.is_file()}

def sync():
    for plugin in sorted(ROOT.glob('plugins/*')):
        with tempfile.TemporaryDirectory() as tmp:
            dest = Path(tmp)
            generated(plugin, dest)
            for name in read(plugin/'build.config.json')['sharedSkills']:
                target = plugin/'skills'/name
                # These directories are explicitly reserved for generated files.
                if target.exists():
                    shutil.rmtree(target)
                shutil.copytree(dest/name,target)
    for skill in skills():
        target = skill.parent / 'references/operating-principles.md'
        target.parent.mkdir(exist_ok=True)
        shutil.copyfile(STANDARD, target)
    print(f'Synchronized {len(skills())} skills')

def validate():
    entries = read(MARKET)['plugins']
    names = set()
    for entry in entries:
        name = entry['name']
        assert name not in names, f'Duplicate plugin: {name}'
        names.add(name)
        assert entry['policy']['authentication'] in ('ON_INSTALL', 'ON_USE')
        assert entry['policy']['installation'] in ('AVAILABLE','INSTALLED_BY_DEFAULT','NOT_AVAILABLE')
        assert entry['source']['source'] == 'local'
        assert entry['source']['path'] == f'./plugins/{name}'
        plugin = ROOT / 'plugins' / name
        manifest = read(plugin / 'plugin.json')
        assert manifest['name'] == name
        assert manifest['$schema'] == 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json'
        assert re.fullmatch(r'\d+\.\d+\.\d+', manifest['version'])
        assert manifest['description']
        assert list(plugin.glob('skills/*/SKILL.md')), f'No skills in {name}'
        assert manifest['extensions']['com.openai']['onboardingSkill'] == './skills/onboarding/SKILL.md'
        config = read(plugin/'build.config.json')
        assert set(config['connectors']['required']).isdisjoint(config['connectors']['optional'])
        for connector in config['connectors']['required']+config['connectors']['optional']:
            assert (ROOT/'shared/skills/connector-setup/references/connectors'/f'{connector}.md').is_file()
        with tempfile.TemporaryDirectory() as tmp:
            dest = Path(tmp)
            generated(plugin,dest)
            for shared in config['sharedSkills']:
                assert files_under(dest/shared) == files_under(plugin/'skills'/shared), f'Stale generated skill: {name}/{shared}; run sync'
        for role in (plugin/'skills/agent-setup/references/agents').glob('*.toml'):
            agent = tomllib.loads(role.read_text())
            assert agent['name'] == role.stem and agent['description'] and agent['developer_instructions']
            assert not {'sandbox_mode','mcp_servers','approval_policy'}.intersection(agent), role
        for job in (plugin/'jobs').glob('*.json'):
            spec = read(job)
            assert spec['id'] == job.stem and spec['skill'] in config['workflows']
            assert (plugin/'skills'/spec['skill']/'SKILL.md').is_file()
            assert spec['trigger']['type']=='schedule' and spec['trigger']['rrule'].startswith('FREQ=')
            ZoneInfo(spec['trigger']['timezone'])
            assert spec['execution']['permissions']=='read-only'
            assert set(spec['dependencies']['connectors']) == set(config['workflows'][spec['skill']]['liveConnectors'])
            assert spec['prompt'] and spec['context']['required']

    assert names == {p.parent.name for p in ROOT.glob('plugins/*/plugin.json')}
    for skill in skills():
        name = skill.parent.name
        plugin = skill.parents[2].name
        content = skill.read_text(encoding='utf-8')
        front = content.split('---', 2)
        assert len(front) == 3 and not front[0].strip(), skill
        assert f'\nname: {name}\n' in front[1], skill
        assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',name) and len(name) <= 64
        assert '\ndescription: ' in front[1], skill
        assert (skill.parent/'references/operating-principles.md').read_bytes() == STANDARD.read_bytes(), f'Stale standards: {skill}'
        assert read(ROOT/'evals'/plugin/f'{name}.json')['skill'] == name
        for link in re.findall(r'\]\((references/[^)]+)\)', content):
            assert (skill.parent/link).is_file(), f'Missing reference: {link}'
    print(f'Validated {len(names)} plugins and {len(skills())} skills (structural checks only)')

def package():
    validate()
    dist = ROOT/'dist'
    dist.mkdir(exist_ok=True)
    for file in sorted(ROOT.glob('plugins/*/plugin.json')):
        manifest = read(file)
        dest = dist/f"{manifest['name']}-{manifest['version']}.zip"
        with ZipFile(dest,'w',ZIP_DEFLATED) as archive:
            for path in sorted(file.parent.rglob('*')):
                if path.is_file() and not any(p in {'.DS_Store','__pycache__','.env','inputs','outputs','customer-context','.local'} or p.startswith('.env.') for p in path.relative_to(file.parent).parts):
                    archive.write(path,path.relative_to(file.parent))
        print(dest.relative_to(ROOT))

def remote(url, ref):
    validate()
    data = read(MARKET)
    for entry in data['plugins']:
        entry['source'] = {'source':'git-subdir','url':url,'path':entry['source']['path'],'ref':ref}
    dest = ROOT/'dist/marketplace.remote.json'
    dest.parent.mkdir(exist_ok=True)
    dest.write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
    print(dest.relative_to(ROOT))

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest='action',required=True)
    for action in ('sync','validate','package'):
        sub.add_parser(action)
    r = sub.add_parser('remote-marketplace')
    r.add_argument('--url',required=True)
    r.add_argument('--ref',required=True)
    args = parser.parse_args()
    if args.action == 'remote-marketplace':
        remote(args.url,args.ref)
    else:
        globals()[args.action]()
