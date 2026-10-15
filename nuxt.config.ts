import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-15',
  srcDir: 'app/',
  serverDir: 'server/',
  devtools: { enabled: false },
  app: { head: { title: 'Vetro', htmlAttrs: { lang: 'ru' } } },
  css: ['~/assets/css/main.css'],
  modules: ['nuxt-security', '@nuxt/content', '@pinia/nuxt', '@nuxtjs/i18n'],
  experimental: { appManifest: false },
  runtimeConfig: {
    supabaseUrl: 'http://localhost:8002',
    supabaseServiceRoleKey: '',
    public: { supabaseUrl: '/supabase', supabaseAnonKey: '' }
  },
  security: {
    headers: {
      contentSecurityPolicy: { 'upgrade-insecure-requests': false },
      strictTransportSecurity: false,
      crossOriginOpenerPolicy: false,
      originAgentCluster: false
    },
    rateLimiter: { tokensPerInterval: 120, interval: 300000, driver: { name: 'lruCache' } }
  },
  content: { experimental: { sqliteConnector: 'native' } },
  vite: { plugins: [tailwindcss()] },
  i18n: {
    defaultLocale: 'ru', detectBrowserLanguage: false, strategy: 'no_prefix',
    locales: [{ code: 'ru', name: 'RU', language: 'ru-RU' }, { code: 'en', name: 'EN', language: 'en-US' }],
    vueI18n: './i18n.config.ts'
  }
})
