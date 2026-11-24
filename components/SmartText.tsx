"use client";

import React from "react";
import { Language } from "@/types/incident";
import { JargonTermKey } from "@/types/recovery";
import { JargonTooltip } from "./JargonTooltip";

interface SmartTextProps {
  text: string;
  lang: Language;
}

// Term patterns mapped to keys
const termPatterns: Array<{ key: JargonTermKey; pattern: RegExp }> = [
  { key: "principal_nodal_officer", pattern: /\b(Principal Nodal Officer|PNO|प्रधान नोडल अधिकारी)\b/i },
  { key: "nodal_officer", pattern: /\b(Nodal Officer|नोडल अधिकारी)\b/i },
  { key: "utr_number", pattern: /\b(UTR Number|UTR numbers|UTR|यूटीआर|UTR नंबर)\b/i },
  { key: "lien_hold", pattern: /\b(Lien|Lien hold|लीन)\b/i },
  { key: "chargeback", pattern: /\b(Chargeback|चार्ज-बैक|चार्जबैक)\b/i },
  { key: "zero_fir_ncr", pattern: /\b(Zero FIR|NCR|जीरो FIR)\b/i },
  { key: "eow_ccps", pattern: /\b(EOW|CCPS|Economic Offences Wing|आर्थिक अपराध शाखा|साइबर क्राइम पुलिस स्टेशन)\b/i },
  { key: "cibil_freeze", pattern: /\b(CIBIL|CIBIL Freeze|क्रेडिट रिपोर्ट|सिबिल)\b/i },
];

export const SmartText: React.FC<SmartTextProps> = ({ text, lang }) => {
  if (!text) return null;

  // Build a unified regex
  const combinedRegex = new RegExp(
    `(${termPatterns.map((tp) => tp.pattern.source).join("|")})`,
    "gi"
  );

  const parts = text.split(combinedRegex);

  return (
    <span>
      {parts.map((part, index) => {
        if (!part) return null;

        // Check which term matched
        for (const item of termPatterns) {
          if (item.pattern.test(part)) {
            return (
              <JargonTooltip
                key={index}
                termKey={item.key}
                lang={lang}
                displayText={part}
              />
            );
          }
        }

        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};
