import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('pageerror', err => {
    errors.push(`Page Error: ${err.message}`);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });

  try {
    console.log("Navigating to Home...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    console.log("Testing Home -> Dashboard flow...");
    await page.waitForSelector('textarea');
    await page.type('textarea', 'A platform for AI tools');
    
    // Find the Generate button
    const buttons = await page.$$('button');
    let generateBtn = null;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Generate My RoadMap')) {
        generateBtn = btn;
        break;
      }
    }
    
    if (generateBtn) {
      await generateBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {});
      console.log("Navigated. Current URL:", page.url());
      await page.screenshot({ path: 'scratch/dashboard_test.png' });
    } else {
      console.log("Generate button not found on Home.");
    }

    console.log("Testing Analyzer -> Roadmap flow...");
    await page.goto('http://localhost:3000/analyzer', { waitUntil: 'networkidle0' });
    await page.waitForSelector('textarea');
    await page.type('textarea', 'A new solar powered backpack for hikers');
    
    const analyzeBtns = await page.$$('button');
    let analyzeBtn = null;
    for (const btn of analyzeBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Analyze Idea Domains')) {
        analyzeBtn = btn;
        break;
      }
    }
    
    if (analyzeBtn) {
      await analyzeBtn.click();
      await page.waitForFunction(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.some(b => b.textContent.includes('Generate Roadmap'));
      }, { timeout: 15000 }).catch(() => console.log("Timeout waiting for Generate Roadmap button"));
      
      const genRoadmapBtns = await page.$$('button');
      for (const btn of genRoadmapBtns) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text.includes('Generate Roadmap')) {
          await btn.click();
          break;
        }
      }
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {});
      console.log("Navigated. Current URL:", page.url());
      await page.screenshot({ path: 'scratch/roadmap_test.png' });
    }

    console.log("Testing VC Simulator flow...");
    await page.goto('http://localhost:3000/vc-simulator', { waitUntil: 'networkidle0' });
    await page.waitForSelector('input[type="text"]');
    await page.type('input[type="text"]', 'Hello VC');
    await page.keyboard.press('Enter');
    
    // Wait for a few seconds to let AI respond
    await new Promise(r => setTimeout(r, 5000));
    
    const evalBtns = await page.$$('button');
    for (const btn of evalBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Request Evaluation')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 5000));
    await page.screenshot({ path: 'scratch/vc_test.png' });
    console.log("VC test done.");

  } catch (err) {
    console.error("Test execution error:", err);
  } finally {
    console.log("Collected Errors:", errors.length ? errors : "None");
    await browser.close();
  }
})();
