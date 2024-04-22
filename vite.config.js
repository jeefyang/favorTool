import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import manifest from './manifest.config'
import { crx } from "@crxjs/vite-plugin"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest })
  ],
  server: {
    strictPort: true,
    port: 5173,
    hmr: {
      clientPort: 5173
    }
  }
})
