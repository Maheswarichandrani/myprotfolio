import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 11000));

const pinTop = await page.evaluate(() => {
  const s = document.querySelector("#projects");
  return s.getBoundingClientRect().top + window.scrollY;
});
await page.evaluate((y) => window.scrollTo(0, y + 700), pinTop);
await new Promise((r) => setTimeout(r, 1800));

const btn = await page.$(".btn-silver");
await btn.screenshot({ path: "scripts/btn.png" });

await browser.close();
