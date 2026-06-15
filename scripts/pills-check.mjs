import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 11000));

const report = await page.evaluate(() => {
  const slides = [...document.querySelectorAll(".proj-slide")];
  return slides.map((s) => {
    const pills = [...s.querySelectorAll("span.rounded-full")].filter(
      (el) => el.querySelector("svg") || /[A-Za-z]/.test(el.textContent)
    );
    return [...s.querySelectorAll("span")]
      .filter((el) => el.className.includes("rounded-full") && el.querySelector("svg"))
      .map((el) => ({
        label: el.textContent.trim(),
        hasIcon: !!el.querySelector("svg"),
        iconBox: (() => {
          const svg = el.querySelector("svg");
          const r = svg.getBoundingClientRect();
          return { w: Math.round(r.width), h: Math.round(r.height) };
        })(),
      }));
  });
});

console.log(JSON.stringify(report, null, 2));
await browser.close();
