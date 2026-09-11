import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests',
  use: {
    baseURL: 'http://localhost:5173',
  },
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    // Vite exposes VITE_ prefixed variables to the app as import.meta.env.
    // This one makes the factory return the mock adapter instead of the real ones.
    env: { VITE_WALLET_MOCK: 'true' },
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
})
