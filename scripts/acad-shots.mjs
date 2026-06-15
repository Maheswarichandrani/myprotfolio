import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 17000));

const settle = () => new Promise((r) => setTimeout(r, 1800));
const top = await page.evaluate(() => {
  const s = document.querySelector("#academic");
  return s.getBoundingClientRect().top + window.scrollY;
});

await page.evaluate((y) => window.scrollTo(0, y + 200), top);
await settle();
await page.screenshot({ path: "scripts/acad-1.png" });

await page.evaluate((y) => window.scrollTo(0, y + window.innerHeight * 1.2), top);
await settle();
await page.screenshot({ path: "scripts/acad-2.png" });

await browser.close();
