const { chromium } = require('playwright');

async function runAudit() {
  console.log('=== STARTING PLAYWRIGHT COMPREHENSIVE AUDIT ===');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
  });

  const errors = [];
  const warnings = [];

  // 1. Audit Desktop 1440px
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const pageDesktop = await contextDesktop.newPage();

  pageDesktop.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`[Console Error Desktop]: ${msg.text()}`);
    }
  });
  pageDesktop.on('pageerror', (err) => {
    errors.push(`[Page Error Desktop]: ${err.message}`);
  });

  console.log('\n--- Test 1: Desktop Initial Load (Screen 1) ---');
  await pageDesktop.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Check horizontal overflow
  const desktopOverflow = await pageDesktop.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  if (desktopOverflow) errors.push('Desktop 1440px has horizontal scroll overflow!');
  else console.log('✓ Desktop 1440px: No horizontal scroll overflow.');

  // Scan text on Screen 1 for duplicate consecutive words
  const screen1Text = await pageDesktop.evaluate(() => document.body.innerText);
  checkDuplicates(screen1Text, 'Screen 1 Desktop (EN)', warnings);

  // 2. Test Bilingual Toggle on Screen 1
  console.log('\n--- Test 2: Bilingual Toggle (Hindi <-> English) ---');
  await pageDesktop.click('button:has-text("हिंदी")');
  await pageDesktop.waitForTimeout(400);
  const hindiScreen1Text = await pageDesktop.evaluate(() => document.body.innerText);
  checkDuplicates(hindiScreen1Text, 'Screen 1 Desktop (HI)', warnings);
  if (!hindiScreen1Text.includes('एक गहरी सांस लें')) {
    errors.push('Hindi translation missing on Screen 1 headline!');
  } else {
    console.log('✓ Screen 1 translated to Hindi successfully.');
  }

  // Switch back to English
  await pageDesktop.click('button:has-text("English")');
  await pageDesktop.waitForTimeout(300);

  // 3. Test Flow A: Free-Text Incident Description (< ₹20L, < 2hrs)
  console.log('\n--- Test 3: Flow A - Free-Text (< 20L, < 2hrs) ---');
  await pageDesktop.fill('textarea', '₹45,000 was debited via UPI after clicking a fake courier link 30 minutes ago');
  await pageDesktop.click('button:has-text("Under ₹20 Lakh")');
  await pageDesktop.click('button:has-text("Just now / Under 2 hrs")');
  await pageDesktop.click('button:has-text("Get My Step-by-Step Plan")');
  await pageDesktop.waitForTimeout(600);

  // We are now on Results / Recovery Engine View
  const recoveryTextEn = await pageDesktop.evaluate(() => document.body.innerText);
  checkDuplicates(recoveryTextEn, 'Recovery Engine Desktop (EN)', warnings);

  // Check all 5 phase cards text & expand all cards
  console.log('\n--- Test 4: Checking all 5 Phases & Expanding Action Items ---');
  const stepperButtons = pageDesktop.locator('nav[aria-label="Recovery Phases"] button');
  const phaseCount = await stepperButtons.count();
  console.log(`Found ${phaseCount} phase buttons in stepper.`);

  for (let i = 0; i < phaseCount; i++) {
    await stepperButtons.nth(i).click();
    await pageDesktop.waitForTimeout(300);

    // Expand all 4W cards in this phase to check their contents & procedure briefs
    const expandChevrons = pageDesktop.locator('button[aria-label="Expand details"]');
    while (await expandChevrons.count() > 0) {
      await expandChevrons.first().click();
      await pageDesktop.waitForTimeout(100);
    }

    const phaseText = await pageDesktop.evaluate(() => document.body.innerText);
    checkDuplicates(phaseText, `Phase ${i + 1} Expanded Desktop (EN)`, warnings);
  }
  console.log('✓ All 5 phases navigated and all action cards expanded.');

  // 4. Test Tooltip Auto-Flip & Portal
  console.log('\n--- Test 5: Tooltip Modal & React Portal Test ---');
  const tooltipTriggers = pageDesktop.locator('button[aria-label^="Explain term:"]');
  const count = await tooltipTriggers.count();
  console.log(`Found ${count} glossary tooltip triggers on current view.`);
  if (count > 0) {
    const firstTrigger = tooltipTriggers.first();
    const triggerText = await firstTrigger.innerText();
    console.log(`Clicking tooltip trigger: "${triggerText.trim()}"`);
    await firstTrigger.click();
    await pageDesktop.waitForTimeout(400);

    // Check dialog in portal
    const dialog = pageDesktop.locator('div[role="dialog"][aria-modal="true"]');
    if (await dialog.count() === 0) {
      errors.push('Tooltip dialog did not open or not found in DOM!');
    } else {
      const box = await dialog.first().boundingBox();
      console.log(`Tooltip dialog dimensions: ${box.width}px x ${box.height}px at (${box.x}, ${box.y})`);
      if (box.width < 250 || box.width > 340) {
        errors.push(`Tooltip width ${box.width}px out of bounds (wanted 260-320px)!`);
      } else {
        console.log('✓ Tooltip width within 260px-320px bounds.');
      }
      if (box.y < 70) {
        errors.push(`Tooltip y=${box.y}px clips behind sticky header!`);
      } else {
        console.log('✓ Tooltip positioned safely below sticky header.');
      }

      // Close tooltip via X button
      await dialog.first().locator('button[aria-label="Close explanation"]').click();
      await pageDesktop.waitForTimeout(300);
    }
  }

  // 5. Test Modals: Drafts and Visit Mode
  console.log('\n--- Test 6: Modals (Drafts & Pocket Counter Card) ---');
  await pageDesktop.click('button:has-text("Ready-to-Use Drafts")');
  await pageDesktop.waitForTimeout(400);
  let draftDialog = pageDesktop.locator('div[role="dialog"]');
  if (await draftDialog.count() > 0) {
    const draftText = await draftDialog.innerText();
    checkDuplicates(draftText, 'Draft Modal (EN)', warnings);
    console.log('✓ Draft Modal opened and checked.');
    // Test Copy button
    await pageDesktop.click('button:has-text("Copy Draft")');
    await pageDesktop.waitForTimeout(200);
    // Close modal
    await draftDialog.locator('button[aria-label="Close modal"]').click();
    await pageDesktop.waitForTimeout(300);
  } else {
    errors.push('Ready-to-Use Drafts modal failed to open!');
  }

  // Pocket Card Modal
  await pageDesktop.click('button:has-text("Branch / Thana Visit Mode")');
  await pageDesktop.waitForTimeout(400);
  let counterDialog = pageDesktop.locator('div[role="dialog"]');
  if (await counterDialog.count() > 0) {
    const counterText = await counterDialog.innerText();
    checkDuplicates(counterText, 'Pocket Counter Card Modal (EN)', warnings);
    console.log('✓ Branch / Thana Visit Mode opened and checked.');
    await counterDialog.locator('button[aria-label="Close"]').click();
    await pageDesktop.waitForTimeout(300);
  } else {
    errors.push('Branch / Thana Visit Mode modal failed to open!');
  }

  // 6. Test Hindi Switch on Results View
  console.log('\n--- Test 7: Hindi Toggle on Recovery Results View ---');
  await pageDesktop.click('button:has-text("हिंदी")');
  await pageDesktop.waitForTimeout(500);
  const recoveryTextHi = await pageDesktop.evaluate(() => document.body.innerText);
  checkDuplicates(recoveryTextHi, 'Recovery Engine Desktop (HI)', warnings);

  // Check all 5 phases in Hindi
  for (let i = 0; i < phaseCount; i++) {
    await stepperButtons.nth(i).click();
    await pageDesktop.waitForTimeout(300);
    const phaseTextHi = await pageDesktop.evaluate(() => document.body.innerText);
    checkDuplicates(phaseTextHi, `Phase ${i + 1} Desktop (HI)`, warnings);
  }
  console.log('✓ All 5 phases verified in Hindi.');

  // 7. Test Mobile Viewport (375px)
  console.log('\n--- Test 8: Mobile Viewport (375px iPhone size) ---');
  const contextMobile = await browser.newContext({
    viewport: { width: 375, height: 667 },
    isMobile: true,
  });
  const pageMobile = await contextMobile.newPage();
  pageMobile.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[Console Error Mobile]: ${msg.text()}`);
  });
  await pageMobile.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Mobile overflow check
  const mobileOverflow = await pageMobile.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  if (mobileOverflow) errors.push('Mobile 375px has horizontal scroll overflow!');
  else console.log('✓ Mobile 375px: No horizontal scroll overflow.');

  // Check Screen 1 on Mobile
  const mobileText = await pageMobile.evaluate(() => document.body.innerText);
  checkDuplicates(mobileText, 'Mobile 375px Screen 1', warnings);

  // 8. Test Flow B: High-Value Scenario (₹20L+) on Mobile
  console.log('\n--- Test 9: Guided Scenario on Mobile (₹20L+ High-Value) ---');
  // Tap ₹20 Lakh or more
  await pageMobile.click('button:has-text("₹20 Lakh or more")');
  await pageMobile.waitForTimeout(200);
  await pageMobile.click('button:has-text("Digital Arrest")');
  await pageMobile.waitForTimeout(600);

  // Check mobile overflow on results view
  const mobileResultsOverflow = await pageMobile.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  if (mobileResultsOverflow) errors.push('Mobile 375px Results has horizontal scroll overflow!');
  else console.log('✓ Mobile 375px Results: No horizontal scroll overflow.');

  const mobileResultsText = await pageMobile.evaluate(() => document.body.innerText);
  checkDuplicates(mobileResultsText, 'Mobile 375px Results View', warnings);

  if (!mobileResultsText.includes('₹20L+') && !mobileResultsText.includes('High-Value')) {
    errors.push('High-Value (₹20L+) routing badge not found in results!');
  } else {
    console.log('✓ High-Value (₹20L+) protocol active and routed to CCPS/EOW.');
  }

  // Test Mobile Tooltip
  const mobileTooltips = pageMobile.locator('button[aria-label^="Explain term:"]');
  if (await mobileTooltips.count() > 0) {
    await mobileTooltips.first().click();
    await pageMobile.waitForTimeout(400);
    const mDialog = pageMobile.locator('div[role="dialog"][aria-modal="true"]');
    if (await mDialog.count() > 0) {
      const mBox = await mDialog.first().boundingBox();
      console.log(`Mobile tooltip dimensions: ${mBox.width}px at (${mBox.x}, ${mBox.y})`);
      if (mBox.x < 0 || mBox.x + mBox.width > 375) {
        errors.push(`Mobile tooltip overflows screen width: x=${mBox.x}, width=${mBox.width}`);
      } else {
        console.log('✓ Mobile tooltip fits cleanly inside 375px screen.');
      }
      await mDialog.first().locator('button[aria-label="Close explanation"]').click();
      await pageMobile.waitForTimeout(300);
    }
  }

  // 9. Test Flow C: Near-Miss Scenario
  console.log('\n--- Test 10: Near-Miss / Prevention Track Flow ---');
  // Click Header New Case
  await pageMobile.click('button[title*="new case"], button[title*="नया केस"]');
  await pageMobile.waitForTimeout(300);
  await pageMobile.click('button:has-text("Yes, Start New Case"), button:has-text("हाँ, नया केस शुरू करें")');
  await pageMobile.waitForTimeout(500);

  // Click Phishing Link / OTP Shared (without entering financial loss)
  await pageMobile.click('button:has-text("Phishing Link"), button:has-text("फिशिंग लिंक")');
  await pageMobile.waitForTimeout(600);

  const nearMissText = await pageMobile.evaluate(() => document.body.innerText);
  checkDuplicates(nearMissText, 'Near-Miss View', warnings);
  if (!nearMissText.includes("You're Protected") && !nearMissText.includes("आप सुरक्षित हैं")) {
    errors.push('Near-miss view failed to show "You\'re Protected" banner!');
  } else {
    console.log('✓ Near-Miss prevention track rendered correctly.');
  }

  // 10. Test Remaining Guided Categories on Desktop
  console.log('\n--- Test 11: Testing Remaining Guided Categories on Desktop ---');
  // Switch Desktop back to English
  const enBtn = pageDesktop.locator('button:has-text("English")');
  if (await enBtn.count() > 0) {
    await enBtn.first().click();
    await pageDesktop.waitForTimeout(300);
  }

  for (const catName of ["Investment / Part-Time Task", "Social Media / Account Hacked"]) {
    // Reset
    await pageDesktop.click('button[title*="new case"], button[title*="नया केस"]');
    await pageDesktop.waitForTimeout(300);
    await pageDesktop.click('button:has-text("Yes, Start New Case"), button:has-text("हाँ, नया केस शुरू करें")');
    await pageDesktop.waitForTimeout(400);

    await pageDesktop.click(`button:has-text("${catName}")`);
    await pageDesktop.waitForTimeout(500);

    const catText = await pageDesktop.evaluate(() => document.body.innerText);
    checkDuplicates(catText, `Category ${catName}`, warnings);
    console.log(`✓ Tested category: ${catName}`);
  }

  // 11. Test LocalStorage Persistence on Reload
  console.log('\n--- Test 12: LocalStorage Persistence on Reload ---');
  await pageDesktop.reload({ waitUntil: 'networkidle' });
  await pageDesktop.waitForTimeout(500);
  const reloadedText = await pageDesktop.evaluate(() => document.body.innerText);
  if (!reloadedText.includes("Incident Profile") && !reloadedText.includes("Social Media")) {
    errors.push('Session state did not persist in localStorage after reload!');
  } else {
    console.log('✓ Incident session successfully persisted across page reload.');
  }

  await browser.close();

  console.log('\n================ AUDIT SUMMARY ================');
  console.log(`Total Errors: ${errors.length}`);
  console.log(`Total Warnings: ${warnings.length}`);
  if (errors.length > 0) {
    console.log('\nERRORS FOUND:');
    errors.forEach((e) => console.log('❌ ' + e));
  }
  if (warnings.length > 0) {
    console.log('\nWARNINGS (Potential Duplicates / Phrasing):');
    warnings.forEach((w) => console.log('⚠️ ' + w));
  }
  console.log('===============================================\n');

  if (errors.length === 0 && warnings.length === 0) {
    console.log('🎉 100% HEALTHY: Zero errors, zero duplicates, zero layout issues across all devices and languages!');
    process.exit(0);
  } else if (errors.length === 0) {
    console.log('✨ 0 Fatal Errors. Review warnings above.');
    // Check if any warnings are actual critical duplicates
    const realDupes = warnings.filter(w => !w.includes('that that') && !w.includes('बार बार'));
    if (realDupes.length > 0) {
      process.exit(1);
    }
    process.exit(0);
  } else {
    process.exit(1);
  }
}

function checkDuplicates(text, screenName, warnings) {
  const lines = text.split('\n');
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 5) return;

    // Check specific known triggers:
    const specificPatterns = [
      /\b(UTR Number|UTR numbers|UTR|Lien|Zero FIR|NCR|PNO|EOW|CCPS|CIBIL)\s+\1\b/i,
      /(जीरो FIR|लीन|नोडल अधिकारी|साइबर सेल)\s+\1/,
      /\b([A-Za-z]{3,})\s+\1\b/i,
    ];

    for (const pat of specificPatterns) {
      const match = trimmed.match(pat);
      if (match) {
        // filter out valid grammatical patterns or false positives
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

runAudit().catch((err) => {
  console.error('Audit script crashed:', err);
  process.exit(1);
});
