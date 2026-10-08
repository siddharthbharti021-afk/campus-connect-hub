const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Navigating to local dashboard http://localhost:3000/dashboard ...');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'domcontentloaded', timeout: 30000 });

    console.log('Waiting 5s for animations...');
    await new Promise(r => setTimeout(r, 5000));

    await page.screenshot({ path: 'scratch/local_dashboard_redesign.png', fullPage: true });
    console.log('Saved scratch/local_dashboard_redesign.png');

    await browser.close();
  } catch (err) {
    console.error('Error rendering dashboard:', err);
  }
})();
