import { withMermaid } from 'vitepress-plugin-mermaid';
import { defineConfig } from 'vitepress';
import { scanSection } from './utils/sidebar';
import { HLD_VERSION } from './utils/constants';

export default withMermaid(
  defineConfig({
    title: '[[CLIENT_NAME]] ADLC Discovery',
    description:
      'AI-First SDLC Discovery — evidence-led, from diagnosed problem to proven solution. [[CLIENT_NAME]] × DataArt.',
    head: [['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }]],

    srcDir: '../../docs',
    srcExclude: ['Stories/**'],

    themeConfig: {
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
        { text: 'Process', link: '/AI SDLC/01 Process/' },
        { text: 'Vision', link: '/AI SDLC/02 Vision/' },
        { text: 'Problem', link: '/AI SDLC/03 Problem Space/' },
        { text: 'Goals', link: '/AI SDLC/04 Goals/' },
        { text: 'Solution', link: '/AI SDLC/05 Solution Space/' },
        { text: 'Roadmap', link: '/AI SDLC/06 Roadmap/' },
      ],

      sidebar: {
        '/AI SDLC/01 Process/': [{ text: 'Process', items: scanSection('AI SDLC/01 Process') }],
        '/The Story/': [{ text: 'The Story', items: scanSection('The Story') }],
        '/AI SDLC/03 Problem Space/': scanSection('AI SDLC/03 Problem Space'),
        '/AI SDLC/04 Goals/': [{ text: 'Goals', items: scanSection('AI SDLC/04 Goals') }],
        '/AI SDLC/05 Solution Space/': [
          { text: 'Solution Space', items: scanSection('AI SDLC/05 Solution Space') },
        ],
        '/AI SDLC/06 Roadmap/': [{ text: 'Roadmap', items: scanSection('AI SDLC/06 Roadmap') }],
        '/AI SDLC/02 Vision/': scanSection('AI SDLC/02 Vision'),
        '/Target Architecture (HLD)/': scanSection(`Target Architecture (HLD)/${HLD_VERSION}`),
        '/System Architecture (LLD)/': scanSection('System Architecture (LLD)'),
        '/Engineering Guide/': scanSection('Engineering Guide'),
      },
    },
  })
);
