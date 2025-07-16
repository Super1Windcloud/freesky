import path from 'path'

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.FED_API_BASE || "http://localhost:8888",
    },
  },
  vite: {
    server: {
      watch: {
        ignored: ['**/dist/**'], 
      }
    }
  }
  ,
  devServer: {
    port: 3333,
    host: '0.0.0.0',
  },

  ssr: true,
  modules: [
    "nuxtjs-naive-ui",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "nuxt-toast",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
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
    "zh/personalProfilePage/**": { ssr: false },
    "/personalProfilePage/**": { ssr: false },
    "/zh/topicDetailPage/**": { ssr: false },
    "/topicDetailPage/**": { ssr: false },
    "/zh/account/**": { ssr: false },
    "/account/**": { ssr: false },
    "/zh/topic/**": { ssr: false },
    "/topic/**": { ssr: false },
    "/zh/posts/**": { ssr: false },
    "/posts/**": { ssr: false }, 
    "/settings/**": { ssr: false }, 
    "/zh/settings/**": { ssr: false }, 
  },
  css: ["assets/css/main.css"],
  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },
  colorMode: {
    preference: "system", // default value of $colorMode.preference
    fallback: "light", // fallback value if not system preference found
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "",
    storage: "localStorage", // or 'sessionStorage' or 'cookie'
    storageKey: "nuxt-color-mode",
  },
  nitro: {
    output: {
      publicDir: path.join(__dirname, 'dist')
    }
  },

});
