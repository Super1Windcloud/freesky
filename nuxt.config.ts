export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:8888",
    },
  },

  devServer: {
    port: 3333,
  },
  modules: ["nuxtjs-naive-ui"],
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
});
