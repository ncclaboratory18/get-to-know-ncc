import { defineConfig } from "@playwright/test";
const braveExecutable = process.env.BRAVE_EXECUTABLE;
export default defineConfig({
  testDir: "./tests-browser",
  timeout: 60000,
  fullyParallel: false,
  use: {
    baseURL: "http://127.0.0.1:5173",
    channel: braveExecutable ? undefined : "msedge",
    launchOptions: braveExecutable
      ? { executablePath: braveExecutable }
      : undefined,
    headless: true,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    { name: "desktop", use: { viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    command: "npm run dev -- --port 5173",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: true,
  },
});
