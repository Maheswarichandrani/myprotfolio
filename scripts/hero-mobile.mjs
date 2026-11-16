import puppeteer from "puppeteer-core";

// usage: node scripts/hero-mobile.mjs <prefix>
const prefix = process.argv[2] || "hm";
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const sizes = [
  { name: "390", width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  { name: "360", width: 360, height: 640, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  { name: "1280", width: 1280, height: 800, deviceScaleFactor: 1 },
];
for (const s of sizes) {
  const page = await browser.newPage();
  await page.setViewport(s);
  // skip preloader so we look at the hero only
  await page.evaluateOnNewDocument(() => localStorage.setItem("portfolio:preloaded", "1"));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 120000 });
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: `scripts/${prefix}-${s.name}-early.png` });
  await new Promise((r) => setTimeout(r, 5000));
  await page.screenshot({ path: `scripts/${prefix}-${s.name}.png` });
  const o = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: innerWidth }));
  console.log(s.name, JSON.stringify(o));
  await page.close();
}
await browser.close();
