import { withMermaid } from 'vitepress-plugin-mermaid';
import { defineConfig } from 'vitepress';
import { scanSection } from './utils/sidebar';
// import { HLD_VERSION } from './utils/constants';

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
        {
          icon: {
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><image href="/artisyn-favicon.png" width="32" height="32"/></svg>',
          },
          link: 'https://transform.artisyn.dataart.com/catalog/frameworks#connect',
        },
      ],

      nav: [
        { text: 'Connect Framework', link: '/AI SDLC/Connect Framework/' },
        { text: 'Vision', link: '/AI SDLC/Vision/' },
        { text: 'Problem Space', link: '/AI SDLC/Problem Space/' },
        { text: 'Solution Space', link: '/AI SDLC/Solution Space/' },
        { text: 'Milestones', link: '/AI SDLC/Milestones/' },
        // { text: 'Project (HLD)', link: '/Target Architecture (HLD)/' },
        { text: 'Harness', link: '/Engineering Guide/' },
      ],

      sidebar: {
        '/AI SDLC/Connect Framework/': [
          { text: 'Connect Framework', items: scanSection('AI SDLC/Connect Framework') },
        ],
        '/AI SDLC/Problem Space/': [
          { text: 'Problem Space', items: scanSection('AI SDLC/Problem Space') },
        ],
        '/AI SDLC/Solution Space/': [
          { text: 'Solution Space', items: scanSection('AI SDLC/Solution Space') },
        ],
        '/AI SDLC/Milestones/': [{ text: 'Milestones', items: scanSection('AI SDLC/Milestones') }],
        '/AI SDLC/Vision/': [{ text: 'Vision', items: scanSection('AI SDLC/Vision') }],
        // '/Target Architecture (HLD)/': [
        //   { text: 'Project (HLD)', items: scanSection(`Target Architecture (HLD)/${HLD_VERSION}`) },
        // ],
        '/Engineering Guide/': [
          { text: 'Engineering Guide', items: scanSection('Engineering Guide') },
        ],
      },
    },
  })
);
