import { withMermaid } from 'vitepress-plugin-mermaid';
import { defineConfig } from 'vitepress';
import type { DefaultTheme, MarkdownRenderer } from 'vitepress';
import container from 'markdown-it-container';
import { scanSection, collectIndexedDirs } from './utils/sidebar';
import { HLD_VERSION } from './utils/constants';

// A custom container is the sanctioned way to get a styled wrapper div without raw
// HTML passthrough — see "Custom Containers" in the VitePress markdown guide. The
// colored callout boxes in gate/workshop notes map onto VitePress's built-in
// `::: info` / `::: tip` / `::: warning` containers instead (same blue/green/amber).
function registerContainers(md: MarkdownRenderer) {
  md.use(container, 'screenshot', {
    render: (tokens: { nesting: number }[], idx: number) =>
      tokens[idx].nesting === 1 ? '<div class="screenshot">\n' : '</div>\n',
  });

  md.use(container, 'figure-720', {
    render: (tokens: { nesting: number }[], idx: number) =>
      tokens[idx].nesting === 1 ? '<div class="figure-720">\n' : '</div>\n',
  });
}

const themeConfig: DefaultTheme.Config & { indexedDirs: string[] } = {
  search: {
    provider: 'local',
  },

  socialLinks: [
    {
      icon: 'github',
      link: `https://github.com/${process.env.VITE_GITHUB_ORG}/${process.env.VITE_GITHUB_REPO}`,
    },
    { icon: 'linkedin', link: 'https://www.linkedin.com/company/dataart/posts/?feedView=all' },
    {
      icon: {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><image href="/da-favicon.png" width="32" height="32"/></svg>',
      },
      link: 'https://www.dataart.com/artisyn',
    },
  ],

  nav: [
    {
      text: 'Engagement',
      link: '/AI SDLC/01 Engagement/',
      activeMatch: '^/AI SDLC/01 Engagement/',
    },
    { text: 'Capture', link: '/AI SDLC/02 Capture/', activeMatch: '^/AI SDLC/02 Capture/' },
    {
      text: 'Problem',
      link: '/AI SDLC/03 Problem Space/',
      activeMatch: '^/AI SDLC/03 Problem Space/',
    },
    { text: 'Goals', link: '/AI SDLC/04 Goals/', activeMatch: '^/AI SDLC/04 Goals/' },
    {
      text: 'Solution',
      link: '/AI SDLC/05 Solution Space/',
      activeMatch: '^/AI SDLC/05 Solution Space/',
    },
    { text: 'Roadmap', link: '/AI SDLC/06 Roadmap/', activeMatch: '^/AI SDLC/06 Roadmap/' },
    { text: '🚧', link: '/Stories/', activeMatch: '^/Stories/(?!archive/)' },
    { text: '🗄️', link: '/Stories/archive/', activeMatch: '^/Stories/archive/' },
    { text: '🎬', link: '/Demo/', activeMatch: '^/Demo/' },
  ],

  sidebar: {
    '/AI SDLC/01 Engagement/': scanSection('AI SDLC/01 Engagement'),
    '/The Story/': [{ text: 'The Story', items: scanSection('The Story') }],
    '/AI SDLC/03 Problem Space/': scanSection('AI SDLC/03 Problem Space'),
    '/AI SDLC/04 Goals/': [{ text: 'Goals', items: scanSection('AI SDLC/04 Goals') }],
    '/AI SDLC/05 Solution Space/': scanSection('AI SDLC/05 Solution Space'),
    '/AI SDLC/06 Roadmap/': [{ text: 'Roadmap', items: scanSection('AI SDLC/06 Roadmap') }],
    '/AI SDLC/02 Capture/': scanSection('AI SDLC/02 Capture'),
    '/Target Architecture (HLD)/': scanSection(`Target Architecture (HLD)/${HLD_VERSION}`),
    '/System Architecture (LLD)/': scanSection('System Architecture (LLD)'),
    '/Engineering Guide/': scanSection('Engineering Guide'),
    '/Stories/': [{ text: 'WIP', items: scanSection('Stories', { exclude: ['archive'] }) }],
    '/Stories/archive/': [{ text: 'Archive', items: scanSection('Stories/archive') }],
    '/Demo/': scanSection('Demo'),
  },

  indexedDirs: collectIndexedDirs(),
};

export default withMermaid(
  defineConfig({
    title: '[[CLIENT_NAME]] ADLC Discovery',
    description:
      'AI-First SDLC Discovery — evidence-led, from diagnosed problem to proven solution. [[CLIENT_NAME]] × DataArt.',
    head: [
      ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
      // Applies the persisted sidebar/aside collapse state before hydration
      // (same pattern VitePress itself uses for dark mode) so returning
      // visitors don't see the panel flash open then collapse on load.
      [
        'script',
        { id: 'check-sidebar-collapse' },
        `(()=>{try{const d=document.documentElement;
          if(localStorage.getItem('vp-sidebar-collapsed')==='true')d.classList.add('sidebar-collapsed');
          if(localStorage.getItem('vp-aside-collapsed')==='true')d.classList.add('aside-collapsed');
        }catch(e){}})();`,
      ],
    ],

    srcDir: '../../docs',

    // Raw HTML in markdown source is disabled — any <script>/<iframe>/event-handler
    // attribute pasted into docs/ (e.g. from a workshop transcript) renders as inert
    // text instead of executing in readers' browsers. Styled wrapper divs that used
    // to rely on raw HTML passthrough now go through the custom containers above.
    markdown: {
      html: false,
      config: registerContainers,
    },

    themeConfig,
    vite: {
      optimizeDeps: {
        include: ['mermaid', 'fastdom', 'fastdom/extensions/fastdom-promised.js'],
      },
    },
  })
);
