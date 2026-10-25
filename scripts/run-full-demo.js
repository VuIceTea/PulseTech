const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const email = process.env.PULSETECH_DEMO_EMAIL;
const password = process.env.PULSETECH_DEMO_PASSWORD;
const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!email || !password) {
  throw new Error('Set PULSETECH_DEMO_EMAIL and PULSETECH_DEMO_PASSWORD before running this script.');
}

const storefrontDir = path.join(__dirname, '..', 'docs', 'screenshots', 'demo');
const adminDir = path.join('D:\\admin', 'docs', 'screenshots', 'demo');
fs.mkdirSync(storefrontDir, { recursive: true });
fs.mkdirSync(adminDir, { recursive: true });

const wait = (ms = 1200) => new Promise((resolve) => setTimeout(resolve, ms));

async function visitAndCapture(page, url, file) {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await wait();
  await page.screenshot({ path: file, fullPage: false });
  console.log(`Captured ${path.basename(file)}`);
}

async function login(page, baseUrl) {
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle2', timeout: 30000 });
  const emailInput = await page.$('input[type="email"], input[type="text"]');
  const passwordInput = await page.$('input[type="password"]');
  if (!emailInput || !passwordInput) throw new Error(`Login form not found at ${baseUrl}`);
  await emailInput.type(email);
  await passwordInput.type(password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);
  await wait(1000);
  if (page.url().includes('/login')) throw new Error(`Login failed at ${baseUrl}`);
}

async function captureStorefront(page) {
  await login(page, 'http://localhost:3000');
  await page.evaluate(() => {
    localStorage.setItem('last_order_info', JSON.stringify({
      orderId: 'PT843205',
      customerName: 'Nguyen Phi Vu',
      totalPrice: 29031200,
      paymentMethod: 'Thanh toán thẻ quốc tế qua Stripe',
    }));
  });
  const routes = [
    ['http://localhost:3000/', '01-home-authenticated.png'],
    ['http://localhost:3000/products', '02-product-catalog.png'],
    ['http://localhost:3000/products/xiaomi-14-ultra?storage=512GB', '03-product-detail.png'],
    ['http://localhost:3000/wishlist', '04-wishlist.png'],
    ['http://localhost:3000/compare', '05-product-compare.png'],
    ['http://localhost:3000/cart?payment_success=true&orderId=PT843205', '06-payment-success.png'],
    ['http://localhost:3000/cart', '07-post-payment-cart.png'],
    ['http://localhost:3000/orders', '08-order-history.png'],
    ['http://localhost:3000/profile', '09-customer-profile.png'],
    ['http://localhost:3000/order-tracking', '10-order-tracking.png'],
    ['http://localhost:3000/warranty', '11-warranty-lookup.png'],
    ['http://localhost:3000/stores', '12-store-locator.png'],
    ['http://localhost:3000/trade-in', '13-trade-in.png'],
    ['http://localhost:3000/blog', '14-blog.png'],
    ['http://localhost:3000/policies', '15-policies.png'],
  ];
  for (const [url, name] of routes) {
    await visitAndCapture(page, url, path.join(storefrontDir, name));
  }
}

async function captureAdmin(page) {
  await login(page, 'http://localhost:5000');
  const routes = [
    ['http://localhost:5000/', '01-dashboard.png'],
    ['http://localhost:5000/products', '02-products.png'],
    ['http://localhost:5000/orders', '03-orders.png'],
    ['http://localhost:5000/customers', '04-customers.png'],
    ['http://localhost:5000/vouchers', '05-vouchers.png'],
    ['http://localhost:5000/warranties', '06-warranties.png'],
    ['http://localhost:5000/returns', '07-returns.png'],
    ['http://localhost:5000/flash-sales', '08-flash-sales.png'],
    ['http://localhost:5000/inventory-logs', '09-inventory-logs.png'],
  ];
  for (const [url, name] of routes) {
    await visitAndCapture(page, url, path.join(adminDir, name));
  }
  await page.goto('http://localhost:5000/orders', { waitUntil: 'networkidle2', timeout: 30000 });
  await wait();
  const opened = await page.evaluate(() => {
    const row = [...document.querySelectorAll('tr')].find((element) => element.textContent?.includes('PT843205'));
    const button = row ? [...row.querySelectorAll('button')].find((element) => element.textContent?.includes('Xem')) : null;
    button?.click();
    return Boolean(button);
  });
  if (opened) {
    await wait();
    await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        node.textContent = node.textContent
          ?.replace(/Email:\s*\S+@\S+/, 'Email: demo.customer@pulsetech.local')
          .replace(/Số điện thoại:\s*[\d\s]+/, 'Số điện thoại: 0900 000 000')
          .replace(/Địa chỉ:.*/, 'Địa chỉ: Địa chỉ khách hàng (đã ẩn)');
      }
    });
    await page.screenshot({ path: path.join(adminDir, '10-order-detail.png') });
  }
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    const target = process.env.PULSETECH_DEMO_TARGET || 'all';
    if (target !== 'admin') await captureStorefront(page);
    if (target !== 'storefront') await captureAdmin(page);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
