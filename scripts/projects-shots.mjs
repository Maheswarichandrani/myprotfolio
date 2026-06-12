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

// pin start = top of the pinned gallery (ScrollTrigger pin-spacer wraps it)
const pinTop = await page.evaluate(() => {
  const section = document.querySelector("#projects");
  const intro = section.querySelector("div"); // intro block height
  return section.offsetTop + intro.offsetHeight;
});

await page.evaluate((y) => window.scrollTo(0, y + 10), pinTop);
await settle();
await page.screenshot({ path: "scripts/proj-1.png" });

await page.evaluate((y) => window.scrollTo(0, y + window.innerWidth * 1.2), pinTop);
await settle();
await page.screenshot({ path: "scripts/proj-2.png" });

await page.evaluate((y) => window.scrollTo(0, y + window.innerWidth * 2.4), pinTop);
await settle();
await page.screenshot({ path: "scripts/proj-3.png" });

await browser.close();
