interface ImportMeta {
    env: ImportMetaEnv
}

interface ImportMetaEnv {
    readonly VITE_SERVER_URL: string
    readonly VITE_WEBSITE_URL: string
}
