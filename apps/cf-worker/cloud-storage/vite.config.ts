import fs from 'fs'
import path from 'path'
import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const isProduction = process.env.NODE_ENV === 'production'
let configPath = isProduction ? './wrangler.prod.jsonc' : undefined
if (configPath && !fs.existsSync(path.resolve(__dirname, configPath))) {
  configPath = undefined
}
if (configPath) {
  console.log(`Using Cloudflare configuration from ${configPath}`)
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    cloudflare({
      configPath,
    }) as any,
  ],
})
