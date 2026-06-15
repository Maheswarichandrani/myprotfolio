import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 11000)); // preloader

// find the scroll position where #projects pin starts
const pinTop = await page.evaluate(() => {
  const s = document.querySelector("#projects");
  return s.getBoundingClientRect().top + window.scrollY;
});

// land just inside the section so first-slide reveal (start: top 55%) fires,
// then grab frames across the 1.2s morph
await page.evaluate((y) => window.scrollTo(0, y - window.innerHeight * 0.5), pinTop);
await new Promise((r) => setTimeout(r, 250));
await page.screenshot({ path: "scripts/pr-rounded.png" });
await new Promise((r) => setTimeout(r, 550));
await page.screenshot({ path: "scripts/pr-mid.png" });
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: "scripts/pr-settled.png" });

await browser.close();
