import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 11000));

const settle = () => new Promise((r) => setTimeout(r, 1600));
const shot = async (name) => page.screenshot({ path: `scripts/m-${name}.png` });

// horizontal overflow check
const overflow = await page.evaluate(() => ({
  doc: document.documentElement.scrollWidth,
  win: window.innerWidth,
}));
console.log("h-overflow:", JSON.stringify(overflow));

await shot("hero");

// about mid
await page.evaluate(() => {
  const s = document.querySelector("#about");
  window.scrollTo(0, s.offsetTop + window.innerHeight * 1.5);
});
await settle();
await shot("about");

// projects slide 1 + 2
const pinTop = await page.evaluate(() => {
  const s = document.querySelector("#projects");
  return s.offsetTop + s.querySelector("div").offsetHeight;
});
await page.evaluate((y) => window.scrollTo(0, y + 10), pinTop);
await settle();
await shot("proj1");
await page.evaluate((y) => window.scrollTo(0, y + 500), pinTop);
await settle();
await shot("proj2");

// closing + footer
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await settle();
await shot("footer");

await browser.close();
