// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      script: [
        {
          innerHTML: `(function(){try{var t=localStorage.getItem('latenta-theme');if(t==='light')document.documentElement.classList.remove('dark');else document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}})()`,
          type: 'text/javascript',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
    directusUrl: process.env.DIRECTUS_URL,
    directusToken: process.env.DIRECTUS_TOKEN,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    public: {
      directusUrl: process.env.NUXT_PUBLIC_DIRECTUS_URL,
    },
  },
})
