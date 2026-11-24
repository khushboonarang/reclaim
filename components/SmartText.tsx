"use client";

import React from "react";
import { Language } from "@/types/incident";
import { JargonTermKey } from "@/types/recovery";
import { JargonTooltip } from "./JargonTooltip";

interface SmartTextProps {
  text: string;
  lang: Language;
}

// Ordered from most specific / longest to shortest
const termConfigs: Array<{ key: JargonTermKey; regex: RegExp }> = [
  { key: "principal_nodal_officer", regex: /\b(?:Principal Nodal Officer|PNO|प्रधान नोडल अधिकारी)\b/i },
  { key: "nodal_officer", regex: /\b(?:Nodal Officer|नोडल अधिकारी)\b/i },
  { key: "zero_fir_ncr", regex: /\b(?:Zero FIR|NCR|जीरो FIR)\b/i },
  { key: "utr_number", regex: /\b(?:UTR Number|UTR numbers|UTR नंबर|UTR|यूटीआर)\b/i },
  { key: "lien_hold", regex: /\b(?:Lien hold|Lien|लीन)\b/i },
  { key: "chargeback", regex: /\b(?:Chargeback|चार्ज-बैक|चार्जबैक)\b/i },
  { key: "eow_ccps", regex: /\b(?:Economic Offences Wing|साइबर क्राइम पुलिस स्टेशन|आर्थिक अपराध शाखा|EOW|CCPS)\b/i },
  { key: "cibil_freeze", regex: /\b(?:CIBIL Freeze|CIBIL|क्रेडिट रिपोर्ट|सिबिल)\b/i },
];

export const SmartText: React.FC<SmartTextProps> = ({ text, lang }) => {
  if (!text) return null;

  // 1. Globally deduplicate consecutive duplicate words/phrases in the raw text
  let cleaned = text
    // Deduplicate single duplicate words (e.g. "Lien Lien" -> "Lien", "NCR NCR" -> "NCR")
    .replace(/\b([A-Za-z\u0900-\u097F]+)\s+\1\b/gi, "$1")
    // Deduplicate multi-word terms (e.g. "Zero FIR Zero FIR" -> "Zero FIR", "जीरो FIR जीरो FIR" -> "जीरो FIR")
    .replace(/(Zero FIR)\s+\1/gi, "$1")
    .replace(/(जीरो FIR)\s+\1/gi, "$1");

  // 2. Build non-capturing regex using single outer capture group
  // CRITICAL: inner groups MUST be non-capturing (?:...) so split() does not create duplicate entries!
  const combinedRegex = new RegExp(
    `(${termConfigs.map((tc) => tc.regex.source).join("|")})`,
    "gi"
  );

  const rawParts = cleaned.split(combinedRegex);

  // 3. Process tokens and prevent adjacent duplicate term components
  const elements: React.ReactNode[] = [];
  let lastTermKey: string | null = null;
  let lastTermText: string | null = null;

  for (let i = 0; i < rawParts.length; i++) {
    const part = rawParts[i];
    if (!part) continue;

    const matched = termConfigs.find((tc) => tc.regex.test(part));

    if (matched) {
      // If the exact same term was just rendered immediately before, skip to deduplicate
      if (
        lastTermKey === matched.key &&
        lastTermText?.toLowerCase() === part.toLowerCase()
      ) {
        continue;
      }

      lastTermKey = matched.key;
      lastTermText = part;

      elements.push(
        <JargonTooltip
          key={`term-${i}-${part}`}
          termKey={matched.key}
          lang={lang}
          displayText={part}
        />
      );
    } else {
      // Non-term text resets term history unless it's just punctuation/spaces
      if (part.trim().length > 1) {
        lastTermKey = null;
        lastTermText = null;
      }
      elements.push(<span key={`text-${i}`}>{part}</span>);
    }
  }

  return <>{elements}</>;
};
