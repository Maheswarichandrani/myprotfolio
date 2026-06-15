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

// crop to the first slide's tech pill cluster
const box = await page.evaluate(() => {
  const pills = [...document.querySelectorAll(".proj-slide")][0].querySelectorAll(
    ".proj-copy"
  );
  // the pills row is the one containing rounded-full spans with icons
  let target = null;
  pills.forEach((el) => {
    if (el.querySelector("svg")) target = el;
  });
  const r = (target ?? pills[0]).getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
});

await page.screenshot({
  path: "scripts/pills.png",
  clip: { x: box.x - 8, y: box.y - 8, width: box.width + 16, height: box.height + 16 },
});

await browser.close();
