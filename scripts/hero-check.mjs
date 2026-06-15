import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 17000)); // full preloader
await page.screenshot({ path: "scripts/fc-hero.png" });

// crop the silver button on first project too, forcing reveal visible
const pinTop = await page.evaluate(() => {
  const s = document.querySelector("#projects");
  return s.getBoundingClientRect().top + window.scrollY;
});
await page.evaluate((y) => window.scrollTo(0, y + 600), pinTop);
await new Promise((r) => setTimeout(r, 1600));
await page.evaluate(() => {
  document
    .querySelectorAll(".proj-copy")
    .forEach((el) => (el.style.opacity = "1"));
});
await new Promise((r) => setTimeout(r, 300));
const btn = await page.$(".btn-silver");
if (btn) await btn.screenshot({ path: "scripts/fc-button.png" });

await browser.close();
