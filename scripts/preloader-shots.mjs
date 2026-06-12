import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

await new Promise((r) => setTimeout(r, 2500));
await page.screenshot({ path: "scripts/pl-counting.png" });
await new Promise((r) => setTimeout(r, 2600));
await page.screenshot({ path: "scripts/pl-sweep.png" });
await new Promise((r) => setTimeout(r, 1400));
await page.screenshot({ path: "scripts/pl-name.png" });

await browser.close();
