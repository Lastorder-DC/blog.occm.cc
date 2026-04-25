const BLOG = {
  title: '자커마스 블로그',
  author: '유메카',
  email: 'yumeka@occm.cc',
  link: 'https://blog.occm.cc',
  description: '자커마스에 대해 다루는 블로그입니다.',
  lang: 'ko-KR',
  timezone: 'Asia/Seoul',
  appearance: 'dark',
  font: 'sans-serif',
  lightBackground: '#ffffff',
  darkBackground: '#18181B',
  path: '',
  since: 2021,
  postsPerPage: 5,
  sortByDate: true,
  showAbout: true,
  showArchive: true,
  autoCollapsedNavBar: false,
  ogImageGenerateURL: 'https://occm-og.vercel.app',
  socialLink: 'https://occm.cc/@yumeka',
  seo: {
    keywords: ['자커마스', '마스토돈', 'OCCM'],
    googleSiteVerification: ''
  },
  notionPageId: process.env.NOTION_PAGE_ID,
  notionAccessToken: process.env.NOTION_ACCESS_TOKEN,
  analytics: {
    provider: '', // Currently we support Google Analytics and Ackee, please fill with 'ga' or 'ackee', leave it empty to disable it.
    ackeeConfig: {
      tracker: '', // e.g 'https://ackee.craigary.net/tracker.js'
      dataAckeeServer: '', // e.g https://ackee.craigary.net , don't end with a slash
      domainId: '' // e.g '0e2257a8-54d4-4847-91a1-0311ea48cc7b'
    },
    gaConfig: {
      measurementId: '' // e.g: G-XXXXXXXXXX
    }
  },
  comment: {
    provider: 'cusdis',
    gitalkConfig: {
      repo: '',
      owner: '',
      admin: [],
      clientID: '',
      clientSecret: '',
      distractionFreeMode: false
    },
    utterancesConfig: {
      repo: 'Lastorder-DC/blog.occm.cc'
    },
    cusdisConfig: {
      appId: 'c8e56656-7e65-4bdf-a3f6-6efb89dc288b',
      host: 'https://cusdis.com',
      scriptSrc: 'https://cusdis.com/js/cusdis.es.js'
    }
  },
  isProd: true
}
// export default BLOG
module.exports = BLOG
