/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_ADS_API_TOKEN: string
  readonly VITE_GOOGLE_ADS_DEVELOPER_TOKEN: string
  readonly VITE_GOOGLE_ADS_CLIENT_ID: string
  readonly VITE_GOOGLE_ADS_CLIENT_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
