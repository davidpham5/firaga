import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import node from '@astrojs/node'

export default defineConfig({
  // SSR — required for dynamic publication pages, dashboard, and PDS endpoints
  output: 'server',

  adapter: node({ mode: 'standalone' }),

  integrations: [
    react(), // React islands for interactive components (editor, charts, forms)
  ],

  // The Payload backend
  vite: {
    define: {
      'import.meta.env.PAYLOAD_URL': JSON.stringify(
        process.env.PAYLOAD_URL ?? 'http://localhost:3001'
      ),
    },
  },
})
