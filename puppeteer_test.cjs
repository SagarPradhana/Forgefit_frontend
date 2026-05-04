const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const requests = [];
  page.on('request', request => {
    if(request.url().includes('api') || request.url().includes('localhost')) {
      requests.push(request.url());
    }
  });
  
  console.log('Navigating to login...');
  await page.goto('http://localhost:5174/signin', {waitUntil: 'networkidle0'});
  
  console.log('Logging in...');
  // The input type might not be exactly "text" or "password", let's use the input index or exact selector
  // Since we don't know the exact selector, we can look at SignInPage.tsx
  // But wait, it's easier to just type into the first and second inputs.
  const inputs = await page.$$('input');
  await inputs[0].type('AD000001');
  await inputs[1].type('Admin@123');
  
  await Promise.all([
    page.waitForNavigation({waitUntil: 'networkidle0'}),
    page.click('button[type="submit"]')
  ]);
  
  console.log('After login requests:');
  console.log(requests.filter(r => r.includes('/api/')));
  requests.length = 0; // clear
  
  console.log('Navigating to users page...');
  await page.goto('http://localhost:5174/admin/users', {waitUntil: 'networkidle0'});
  console.log('After navigating to users requests:');
  console.log(requests.filter(r => r.includes('/api/')));
  
  await browser.close();
})();
