import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 11000));

// hero with scroll cue
await page.screenshot({ path: "scripts/fc-hero.png" });

// projects — force any reveal-hidden copy visible, then shoot the button
const pinTop = await page.evaluate(() => {
  const s = document.querySelector("#projects");
  return s.getBoundingClientRect().top + window.scrollY;
});
await page.evaluate((y) => window.scrollTo(0, y + 600), pinTop);
await new Promise((r) => setTimeout(r, 1600));
await page.evaluate(() => {
  document
    .querySelectorAll(".proj-copy, .proj-img, .proj-title")
    .forEach((el) => (el.style.opacity = "1"));
});
await new Promise((r) => setTimeout(r, 300));
const btn = await page.$(".btn-silver");
if (btn) await btn.screenshot({ path: "scripts/fc-button.png" });

// footer desktop
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await new Promise((r) => setTimeout(r, 1600));
await page.screenshot({ path: "scripts/fc-footer.png" });

await browser.close();
