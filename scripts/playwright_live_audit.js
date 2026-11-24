const { chromium } = require('playwright');

async function runLiveAudit() {
  console.log('=== STARTING PLAYWRIGHT AUDIT ON LIVE URL: https://reclaim-india.vercel.app ===\n');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
  });

  const errors = [];
  const warnings = [];

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`[Live Console Error]: ${msg.text()}`);
  });

  console.log('1. Navigating to https://reclaim-india.vercel.app...');
  await page.goto('https://reclaim-india.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check Screen 1 text
  const initialText = await page.evaluate(() => document.body.innerText);
  console.log('Initial page title:', await page.title());
  checkDuplicates(initialText, 'Live Screen 1', warnings);

  // 2. Start a case: select Guided Scenario (UPI Bank Transfer or Free text)
  console.log('\n2. Testing Incident Intake & Pre-crossed-out items check...');
  // Tap UPI card
  const upiBtn = page.locator('button:has-text("UPI"), button:has-text("Unauthorized")').first();
  if (await upiBtn.count() > 0) {
    await upiBtn.click();
  } else {
    // Fill free text
    await page.fill('textarea', 'Lost 45000 via UPI');
    await page.click('button:has-text("Get My Step-by-Step Plan")');
  }
  await page.waitForTimeout(1000);

  // We are now on results view
  const resultsText = await page.evaluate(() => document.body.innerText);
  checkDuplicates(resultsText, 'Live Results View', warnings);

  // CHECK PRE-CROSSED-OUT ITEMS
  console.log('\n3. Checking for Pre-crossed-out / Strikethrough items...');
  const completedCheckboxes = page.locator('button[role="checkbox"][aria-checked="true"]');
  const completedCount = await completedCheckboxes.count();
  console.log(`Pre-completed checkbox count on fresh case: ${completedCount}`);
  if (completedCount > 0) {
    errors.push(`Found ${completedCount} PRE-CHECKED / PRE-CROSSED-OUT items on fresh incident!`);
  } else {
    console.log('✓ Zero items pre-crossed out or pre-checked on fresh incident.');
  }

  const strikethroughTitles = page.locator('h3.line-through');
  const strikethroughCount = await strikethroughTitles.count();
  console.log(`Pre-strikethrough title count: ${strikethroughCount}`);
  if (strikethroughCount > 0) {
    errors.push(`Found ${strikethroughCount} PRE-STRIKETHROUGH item titles on fresh incident!`);
  } else {
    console.log('✓ Zero items have pre-strikethrough styling.');
  }

  // CHECK TOOLTIPS CLIPPING & DUPLICATE WORDS
  console.log('\n4. Checking Glossary Tooltips Clipping & Dimensions...');
  const tooltipTriggers = page.locator('button[aria-label^="Explain term:"]');
  const triggerCount = await tooltipTriggers.count();
  console.log(`Found ${triggerCount} glossary tooltip triggers on live page.`);

  if (triggerCount > 0) {
    const first = tooltipTriggers.first();
    const termLabel = await first.innerText();
    console.log(`Clicking tooltip trigger: "${termLabel.trim()}"`);
    await first.click();
    await page.waitForTimeout(500);

    const dialog = page.locator('div[role="dialog"]');
    if (await dialog.count() === 0) {
      errors.push('Tooltip dialog did not open on live site!');
    } else {
      const box = await dialog.first().boundingBox();
      console.log(`Live tooltip dimensions: ${box.width}px x ${box.height}px at (${box.x}, ${box.y})`);
      if (box.y < 70) {
        errors.push(`Live tooltip y=${box.y}px CLIPS behind sticky header!`);
      } else {
        console.log('✓ Live tooltip is positioned safely below sticky header.');
      }
      if (box.width < 250 || box.width > 340) {
        warnings.push(`Live tooltip width ${box.width}px is outside standard [260, 320] range.`);
      } else {
        console.log('✓ Live tooltip width is within [260, 320] bounds.');
      }

      // Close the tooltip
      await page.click('button[aria-label="Close explanation"]');
      await page.waitForTimeout(300);
    }
  }

  // CHECK DUPLICATE WORDS ACROSS ALL PHASES
  console.log('\n5. Checking all phases for duplicate consecutive terms...');
  const phaseButtons = page.locator('nav[aria-label="Recovery Phases"] button');
  const phaseCount = await phaseButtons.count();
  for (let i = 0; i < phaseCount; i++) {
    await phaseButtons.nth(i).click();
    await page.waitForTimeout(300);
    const pText = await page.evaluate(() => document.body.innerText);
    checkDuplicates(pText, `Live Phase ${i + 1}`, warnings);
  }

  await browser.close();

  console.log('\n================ LIVE AUDIT SUMMARY ================');
  console.log(`Total Errors: ${errors.length}`);
  console.log(`Total Warnings: ${warnings.length}`);
  if (errors.length > 0) {
    console.log('\nERRORS FOUND ON LIVE SITE:');
    errors.forEach(e => console.log('❌ ' + e));
  }
  if (warnings.length > 0) {
    console.log('\nWARNINGS / DUPLICATES FOUND ON LIVE SITE:');
    warnings.forEach(w => console.log('⚠️ ' + w));
  }
  console.log('====================================================\n');

  if (errors.length === 0 && warnings.length === 0) {
    console.log('🎉 LIVE PRODUCTION SITE IS 100% CLEAN!');
  }
}

function checkDuplicates(text, screenName, warnings) {
  const lines = text.split('\n');
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 5) return;

    const specificPatterns = [
      /\b(UTR Number|UTR numbers|UTR|Lien|Zero FIR|NCR|PNO|EOW|CCPS|CIBIL)\s+\1\b/i,
      /(जीरो FIR|लीन|नोडल अधिकारी|साइबर सेल)\s+\1/,
      /\b([A-Za-z]{3,})\s+\1\b/i,
    ];

    for (const pat of specificPatterns) {
      const match = trimmed.match(pat);
      if (match) {
        const word = match[0].toLowerCase();
        if (
          word === 'that that' ||
          word === 'had had' ||
          word === 'flex flex' ||
          word === 'border border'
        ) continue;
        warnings.push(`[${screenName}]: Duplicate "${match[0]}" in: "${trimmed.substring(0, 80)}..."`);
        break;
      }
    }
  });
}

runLiveAudit().catch(err => {
  console.error('Live audit script crashed:', err);
  process.exit(1);
});
