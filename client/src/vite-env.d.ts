/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_GOOGLE_SCRIPT_URL: string
    readonly VITE_ANALYTICS_ENDPOINT: string
    readonly VITE_ANALYTICS_WEBSITE_ID: string
    readonly VITE_RECAPTCHA_SITE_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
