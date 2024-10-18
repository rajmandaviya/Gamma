import { config } from "dotenv";
config();

export default defineNuxtConfig({
  modules: [
    "@nuxtjs/i18n",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@nuxtjs/color-mode",
    "nuxt-auth-utils",
  ],
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
    session: {
      maxAge: 60 * 60 * 24 * 7,
      cookie: {
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      },
    },
    apiToken: process.env.NUXT_API_TOKEN,
    public: {
      baseURL: process.env.NUXT_BASE_URL,
    },
    oauth: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
      facebook: {
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      },
    },
  },

  devtools: {
    enabled: false,
  },
});
