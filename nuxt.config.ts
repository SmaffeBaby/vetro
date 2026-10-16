import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-15',
  srcDir: 'app/',
  serverDir: 'server/',
  components: [
    { path: '~/components/Home' },
    { path: '~/components', ignore: ['Home/**'] }
  ],
  devtools: { enabled: false },
  app: { head: { title: 'Vetro', htmlAttrs: { lang: 'ru' } } },
  css: ['~/assets/css/main.css'],
  modules: ['./modules/breakpoints', '@nuxt/ui', 'nuxt-security', '@nuxt/content', '@pinia/nuxt', '@nuxtjs/i18n'],
  experimental: { appManifest: false },
  ui: { fonts: false, colorMode: false },
  icon: { serverBundle: { collections: ['lucide'] } },
  routeRules: {
    '/admin': { ssr: false },
    '/admin/**': { ssr: false },
    // Public assets must not spend the page/API request budget.
    '/_nuxt/**': { security: { rateLimiter: false } },
    '/images/**': { security: { rateLimiter: false } },
    '/fonts/**': { security: { rateLimiter: false } },
    '/supabase/storage/v1/object/public/**': { security: { rateLimiter: false } },
    '/api/**': { security: { rateLimiter: { tokensPerInterval: 120, interval: 300000 } } },
    '/supabase/auth/v1/**': { security: { rateLimiter: { tokensPerInterval: 120, interval: 300000 } } }
  },
  runtimeConfig: {
    supabaseUrl: 'http://localhost:8002',
    supabaseServiceRoleKey: '',
    public: { supabaseUrl: '/supabase', supabaseAnonKey: '' }
  },
  security: {
    headers: {
      contentSecurityPolicy: { 'upgrade-insecure-requests': false, 'frame-src': ["'self'", 'https://yandex.ru'] },
      permissionsPolicy: { fullscreen: ['self', 'https://yandex.ru'] },
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
