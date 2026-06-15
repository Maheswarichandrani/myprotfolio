import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 17000));

const style = await page.evaluate(() => {
  const b = document.querySelector(".btn-silver");
  const cs = getComputedStyle(b);
  return {
    color: cs.color,
    fontWeight: cs.fontWeight,
    backgroundImage: cs.backgroundImage.slice(0, 80),
    backgroundSize: cs.backgroundSize,
    animationName: cs.animationName,
    animationDuration: cs.animationDuration,
    text: b.textContent.trim(),
  };
});
console.log(JSON.stringify(style, null, 2));
await browser.close();
