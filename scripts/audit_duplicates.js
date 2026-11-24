const fs = require('fs');
const path = require('path');

const termConfigs = [
  { key: 'principal_nodal_officer', regex: /\b(?:Principal Nodal Officer|PNO|प्रधान नोडल अधिकारी)\b/i },
  { key: 'nodal_officer', regex: /\b(?:Nodal Officer|नोडल अधिकारी)\b/i },
  { key: 'zero_fir_ncr', regex: /\b(?:Zero FIR|NCR|जीरो FIR)\b/i },
  { key: 'utr_number', regex: /\b(?:UTR Number|UTR numbers|UTR नंबर|UTR|यूटीआर)\b/i },
  { key: 'lien_hold', regex: /\b(?:Lien hold|Lien|लीन)\b/i },
  { key: 'chargeback', regex: /\b(?:Chargeback|चार्ज-बैक|चार्जबैक)\b/i },
  { key: 'eow_ccps', regex: /\b(?:Economic Offences Wing|साइबर क्राइम पुलिस स्टेशन|आर्थिक अपराध शाखा|EOW|CCPS)\b/i },
  { key: 'cibil_freeze', regex: /\b(?:CIBIL Freeze|CIBIL|क्रेडिट रिपोर्ट|सिबिल)\b/i },
];

const combinedRegex = new RegExp(
  '(' + termConfigs.map((tc) => tc.regex.source).join('|') + ')',
  'gi'
);

function simulate(text) {
  let cleaned = text
    .replace(/\b([A-Za-z\u0900-\u097F]+)\s+\1\b/gi, '$1')
    .replace(/(Zero FIR)\s+\1/gi, '$1')
    .replace(/(जीरो FIR)\s+\1/gi, '$1');

  const rawParts = cleaned.split(combinedRegex);
  const elements = [];
  let lastTermKey = null;
  let lastTermText = null;

  for (let i = 0; i < rawParts.length; i++) {
    const part = rawParts[i];
    if (!part) continue;

    const matched = termConfigs.find((tc) => tc.regex.test(part));

    if (matched) {
      if (
        lastTermKey === matched.key &&
        lastTermText && lastTermText.toLowerCase() === part.toLowerCase()
      ) {
        continue;
      }
      lastTermKey = matched.key;
      lastTermText = part;
      elements.push('[TERM:' + part + ']');
    } else {
      if (part.trim().length > 1) {
        lastTermKey = null;
        lastTermText = null;
      }
      elements.push(part);
    }
  }

  return elements.join('');
}

// Audit files
const filesToAudit = [
  'lib/recoveryEngine.ts',
  'lib/draftTemplates.ts',
  'lib/translations.ts',
  'lib/jargonDictionary.ts',
  'components/FourWCard.tsx',
  'components/DualPathOnboarding.tsx',
  'components/CapturedStateVerification.tsx',
  'components/RecoveryEngineView.tsx',
  'components/PocketCounterCardModal.tsx',
  'components/ComplaintDraftModal.tsx',
];

filesToAudit.forEach((rel) => {
  if (!fs.existsSync(rel)) return;
  const content = fs.readFileSync(rel, 'utf8');
  // Match single or double quoted strings or template strings
  const stringRegex = /(["'`])((?:(?!\1|\\).|\\.)*)\1/g;
  let m;
  while ((m = stringRegex.exec(content)) !== null) {
    const raw = m[2];
    if (raw.length < 5 || raw.includes('className') || raw.includes('http') || raw.includes('const ') || raw.includes('import ')) continue;
    const rendered = simulate(raw);
    
    // Check for any duplicate term adjacent to term or word
    // e.g. [TERM:UTR Number] UTR Number or [TERM:Lien] Lien or [TERM:Zero FIR] [TERM:Zero FIR]
    const dupTerm = rendered.match(/\[TERM:([^\]]+)\]\s*(?:\[TERM:\1\]|\1)\b/i);
    if (dupTerm) {
      console.log('ISSUE in ' + rel + ':');
      console.log('  Original:', raw);
      console.log('  Rendered:', rendered);
    }

    // Also check for raw duplicate words in the string itself
    const rawDup = raw.match(/\b([A-Za-z\u0900-\u097F]{3,})\s+\1\b/i);
    if (rawDup && !raw.includes('flex flex') && !raw.includes('border border')) {
      console.log('RAW DUPLICATE in ' + rel + ': [' + rawDup[0] + '] in: ' + raw);
    }
  }
});
console.log('Audit complete.');
