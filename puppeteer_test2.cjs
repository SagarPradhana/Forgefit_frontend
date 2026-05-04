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
  
  await page.goto('http://localhost:5174/signin', {waitUntil: 'networkidle0'});
  
  const inputs = await page.$$('input');
  await inputs[0].type('AD000001');
  await inputs[1].type('Admin@123');
  
  await Promise.all([
    page.waitForNavigation({waitUntil: 'networkidle0'}),
    page.click('button[type="submit"]')
  ]);
  
  // Wait for all dashboard requests to finish
  await new Promise(r => setTimeout(r, 4000));
  
  requests.length = 0; // clear
  
  console.log('Clicking on Users link...');
  // Find the NavLink that goes to /admin/users
  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    const userLink = links.find(l => l.getAttribute('href') === '/admin/users');
    if (userLink) userLink.click();
  });
  
  // Wait a bit for network requests
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('First visit requests:');
  console.log(requests.filter(r => r.includes('/api/')));
  requests.length = 0; // clear
  
  console.log('Clicking on Dashboard link...');
  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    const link = links.find(l => l.getAttribute('href') === '/admin/dashboard');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  
  requests.length = 0; // clear
  
  console.log('Clicking on Users link AGAIN...');
  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    const userLink = links.find(l => l.getAttribute('href') === '/admin/users');
    if (userLink) userLink.click();
  });
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('Second visit requests:');
  console.log(requests.filter(r => r.includes('/api/')));
  
  await browser.close();
})();
