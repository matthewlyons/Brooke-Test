const puppeteer = require('puppeteer');

let req_headers = {
  accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'en-US,en;q=0.8',
  'upgrade-insecure-requests': '1',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
};

async function scrapeZillow(url, autoScrollPage = false) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Getting URL');
      console.log(url);
      const browser = await puppeteer.launch();
      const [page] = await browser.pages();

      await page.setExtraHTTPHeaders(req_headers);

      await page.goto(url, { waitUntil: 'networkidle0' });

      if (autoScrollPage) {
        await autoScroll(page);
      }

      const data = await page.evaluate(
        () => document.querySelector('*').outerHTML
      );

      resolve(data);
      await browser.close();
    } catch (err) {
      reject(err);
    }
  });
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      try {
        var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  });
}

module.exports = { scrapeZillow };
