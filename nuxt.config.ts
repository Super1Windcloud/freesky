export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.FED_API_BASE || "http://localhost:8888",
    },
  },

  devServer: {
    port: 3333,
  },

  ssr: true,
  modules: [
    "nuxtjs-naive-ui",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "nuxt-toast",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode"
  ],
  spaLoadingTemplate: false,
  app: {
    baseURL: "/",
    head: {
      title: "Free Sky",
      meta: [
        {
          charset: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/logo.jpg",
        },
      ],
    },
  },
  buildDir: "nuxt-build",
  imports: {
    autoImport: true,
  },
  i18n: {
    defaultLocale: "en",
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "zh", name: "Chinese", file: "zh.json" },
    ],
  },
  routeRules: {
    "/zh/searchResultView/**": { ssr: false },
    "/searchResultView/**": { ssr: false },
    "/zh/postDetailInfo/**": { ssr: false },
    "/postDetailInfo/**": { ssr: false },
    "zh/accountDetailInfo/**": { ssr: false },
    "/accountDetailInfo/**": { ssr: false },
    "/zh/topicDetailPage/**": { ssr: false },
    "/topicDetailPage/**": { ssr: false },
  },
  css: ["assets/css/main.css"],
  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode'
  }

});