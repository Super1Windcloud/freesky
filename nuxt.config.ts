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
  modules: ["nuxtjs-naive-ui", "@nuxtjs/i18n", "@pinia/nuxt", "nuxt-toast"],
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
  router: {
    middleware: ["locale"],
  },
});
