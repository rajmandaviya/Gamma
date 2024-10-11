import { config } from "dotenv";
config();
export default defineNuxtConfig({
  modules: ["@nuxtjs/i18n", "@nuxt/ui", "@pinia/nuxt", "@nuxtjs/color-mode"],
  colorMode: {
    preference: "system", // default value of $colorMode.preference
    fallback: "", // fallback value if not system preference found
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "-mode",
    storage: "localStorage", // or 'sessionStorage' or 'cookie'
    storageKey: "nuxt-color-mode",
  },

  i18n: {
    locales: ["ro", "ru"],
    defaultLocale: "ro",
    vueI18n: "./i18n.config.ts",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    customRoutes: "config",
  },

  compatibilityDate: "2024-10-03",

  runtimeConfig: {
    apiToken: process.env.NUXT_API_TOKEN,
    public: {
      baseURL: process.env.NUXT_BASE_URL,
    },
  },

  devtools: {
    enabled: false,
  },
});
