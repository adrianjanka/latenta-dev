// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    directusUrl: process.env.DIRECTUS_URL,
    directusToken: process.env.DIRECTUS_TOKEN,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    public: {
      directusUrl: process.env.NUXT_PUBLIC_DIRECTUS_URL,
    },
  },
})
