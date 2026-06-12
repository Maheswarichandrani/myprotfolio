import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--window-size=1440,900"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

// let the preloader finish
await new Promise((r) => setTimeout(r, 9000));

const probe = async () =>
  page.evaluate(() => {
    const sticky = document.querySelector("#about > div");
    const section = document.querySelector("#about");
    const r = sticky.getBoundingClientRect();
    return {
      scrollY: window.scrollY,
      stickyTop: Math.round(r.top),
      sectionTop: Math.round(section.getBoundingClientRect().top),
      position: getComputedStyle(sticky).position,
      ancestorsWithOverflow: (() => {
        const out = [];
        let el = sticky.parentElement;
        while (el) {
          const cs = getComputedStyle(el);
          if (cs.overflow !== "visible" || cs.overflowX !== "visible" || cs.overflowY !== "visible")
            out.push(`${el.tagName}.${el.className?.toString().slice(0, 40)} -> ${cs.overflowX}/${cs.overflowY}`);
          el = el.parentElement;
        }
        return out;
      })(),
    };
  });

// scroll into the middle of the about section and probe twice
await page.evaluate(() => {
  const about = document.querySelector("#about");
  window.scrollTo(0, about.offsetTop + window.innerHeight * 1.5);
});
await new Promise((r) => setTimeout(r, 1500));
console.log("probe1:", JSON.stringify(await probe(), null, 2));

await page.evaluate(() => window.scrollBy(0, 400));
await new Promise((r) => setTimeout(r, 1500));
console.log("probe2:", JSON.stringify(await probe(), null, 2));

await page.screenshot({ path: "scripts/sticky-mid.png" });
await browser.close();
