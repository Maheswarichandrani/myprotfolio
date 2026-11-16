import puppeteer from "puppeteer-core";
// usage: node scripts/mobile-tour.mjs <outDir> <prefix> [path] [width]
const [out, prefix = "m", path = "/", width = "390"] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
const w = Number(width);
await page.setViewport({ width: w, height: 844, isMobile: w < 1024, hasTouch: w < 1024, deviceScaleFactor: 1 });
await page.evaluateOnNewDocument(() => localStorage.setItem("portfolio:preloaded", "1"));
page.on("pageerror", (e) => console.log("PAGEERR", e.message));
await page.goto("http://localhost:3000" + path, { waitUntil: "load", timeout: 120000 });
await new Promise((r) => setTimeout(r, 6000));
const H = await page.evaluate(() => document.documentElement.scrollHeight);
const sw = await page.evaluate(() => document.documentElement.scrollWidth);
console.log("height", H, "scrollWidth", sw);
let i = 0;
for (let y = 0; y < H; y += 700) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await new Promise((r) => setTimeout(r, 1300));
  await page.screenshot({ path: `${out}/${prefix}-${String(i++).padStart(2, "0")}.png` });
  if (i > 60) break;
}
await browser.close();
