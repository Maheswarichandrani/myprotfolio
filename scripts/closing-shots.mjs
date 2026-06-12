import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 11000)); // preloader

const settle = () => new Promise((r) => setTimeout(r, 1800));

// closing section centered
await page.evaluate(() => {
  const main = document.querySelector("main");
  window.scrollTo(0, main.offsetHeight - window.innerHeight);
});
await settle();
await page.screenshot({ path: "scripts/closing.png" });

// footer fully revealed
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await settle();
await page.screenshot({ path: "scripts/footer.png" });

await browser.close();
