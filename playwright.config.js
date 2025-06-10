import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
 testDir: './tests',
 fullyParallel: false, // Run tests sequentially for admin operations
 forbidOnly: !!process.env.CI,
 retries: process.env.CI ? 2 : 0,
 workers: 1, // Single worker to avoid conflicts
 reporter: [
  ['html'],
  ['json', { outputFile: 'test-results/results.json' }]
 ],
 use: {
  baseURL: process.env.PLAYWRIGHT_ADMIN_URL || 'http://localhost:4000',
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure'
 },

 projects: [
  {
   name: 'chromium',
   use: { ...devices['Desktop Chrome'] },
  },
  {
   name: 'firefox',
   use: { ...devices['Desktop Firefox'] },
  },
  {
   name: 'webkit',
   use: { ...devices['Desktop Safari'] },
  },
 ],

 webServer: {
  command: 'npm run dev',
  url: process.env.PLAYWRIGHT_ADMIN_URL || 'http://localhost:4000',
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000,
 },
});