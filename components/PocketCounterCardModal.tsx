"use client";

import React, { useState } from "react";
import { Language } from "@/types/incident";
import { TriageResult } from "@/types/recovery";
import {
  X,
  Building2,
  ShieldAlert,
  Printer,
  CheckSquare,
  Square,
  Phone,
  ExternalLink,
  MessageSquare,
  FileCheck,
  Sparkles,
} from "lucide-react";

interface PocketCounterCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  triage: TriageResult;
}

export const PocketCounterCardModal: React.FC<PocketCounterCardModalProps> = ({
  isOpen,
  onClose,
  lang,
  triage,
}) => {
  const isEn = lang === "en";
  const [activeDesk, setActiveDesk] = useState<"bank" | "police">("bank");
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const toggleDoc = (index: number) => {
    setCheckedDocs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handlePrint = () => {
    window.print();
  };

  // 4-Item Document Checklist
  const documentChecklist = isEn
    ? [
        {
          title: "Original Government ID Proof",
          desc: "Aadhaar Card, PAN Card, or Voter ID (carry original + 1 self-attested photocopy).",
        },
        {
          title: "Bank Account Statement / Passbook",
          desc: "Recent statement clearly highlighting the disputed debit transactions and account balance.",
        },
        {
          title: "Transaction Receipt / Screenshot with UTR",
          desc: "Clear printout showing the 12-digit UTR number and beneficiary UPI ID / Account Number.",
        },
        {
          title: "2 Printed Copies of Written Complaint Letter",
          desc: "1 copy for the officer/branch to keep, and 1 receiving copy for you to get signed and stamped.",
        },
      ]
    : [
        {
          title: "मूल सरकारी पहचान पत्र (ID Proof)",
          desc: "आधार कार्ड, पैन कार्ड या वोटर आईडी (मूल प्रति + 1 स्व-सत्यापित फोटोकॉपी)।",
        },
        {
          title: "बैंक खाता स्टेटमेंट / पासबुक",
          desc: "हाल का स्टेटमेंट जिसमें अनधिकृत धोखाधड़ी वाले लेन-देन पर पेन से मार्क किया गया हो।",
        },
        {
          title: "UTR नंबर वाली लेनदेन रसीद / स्क्रीनशॉट",
          desc: "स्पष्ट प्रिंटआउट जिसमें 12 अंकों का UTR नंबर और धोखेबाज का UPI/खाता साफ दिखाई दे।",
        },
        {
          title: "लिखित शिकायत पत्र की 2 मुद्रित प्रतियां",
          desc: "1 प्रति अधिकारी/शाखा में जमा करने के लिए और 1 प्रति अपने पास मुहर व हस्ताक्षर लेने हेतु।",
        },
      ];

  // 3-Line Authoritative Counter Script
  const bankScript = isEn
    ? [
        {
          num: "1",
          label: "Cite Regulatory Compliance",
          text: '"I am formally reporting an unauthorized electronic cyber fraud debit within 3 days under RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18 for Zero Customer Liability."',
        },
        {
          num: "2",
          label: "Demand Inter-Bank Lien",
          text: '"Please immediately dispatch an urgent CFCFRMS inter-bank freeze alert to the recipient bank to mark a Lien (hold) on the beneficiary account."',
        },
        {
          num: "3",
          label: "Insist on Written Receiving",
          text: '"Please provide me with an official Bank Dispute / Token Number and stamp my duplicate copy as \'Received with Date & Seal\'."',
        },
      ]
    : [
        {
          num: "1",
          label: "RBI दिशानिर्देश का हवाला दें",
          text: '"मैं RBI सर्कुलर 2017-18 (शून्य ग्राहक देयता) के तहत 3 दिन के भीतर अनधिकृत साइबर धोखाधड़ी लेन-देन की यह औपचारिक लिखित सूचना दे रहा हूँ।"',
        },
        {
          num: "2",
          label: "धोखेबाज के खाते पर लीन की मांग",
          text: '"कृपया CFCFRMS नेटवर्क के माध्यम से लाभार्थी बैंक को तत्काल अलर्ट भेजकर उस खाते पर लीन (Lien/फ्रीज) दर्ज कराएं।"',
        },
        {
          num: "3",
          label: "मुहरयुक्त पावती पर्ची अवश्य लें",
          text: '"कृपया मुझे बैंक का कंप्लेंट टोकन नंबर दें और मेरे पत्र की दूसरी प्रति पर बैंक की मुहर व हस्ताक्षर सहित रिसीविंग दें।"',
        },
      ];

  const policeScript = isEn
    ? [
        {
          num: "1",
          label: "Present NCRP Acknowledgement",
          text: '"I am filing a formal cyber crime complaint with my 14-digit National Cyber Crime Portal (1930 / NCRP) acknowledgement slip."',
        },
        {
          num: "2",
          label: "Assert Zero FIR Jurisdiction",
          text: '"Under Ministry of Home Affairs guidelines, cyber crimes carry no territorial boundary. Please register this immediately as a Zero FIR / GD."',
        },
        {
          num: "3",
          label: "Request Statutory Freeze Notice",
          text: '"Please issue Section 102 CrPC / Section 106 BNSS notice to the recipient bank to freeze the stolen funds and provide my stamped FIR/NCR copy."',
        },
      ]
    : [
        {
          num: "1",
          label: "1930 पावती पर्ची प्रस्तुत करें",
          text: '"मैं अपने 14 अंकों के राष्ट्रीय साइबर अपराध पोर्टल (NCRP/1930) पावती नंबर के साथ यह औपचारिक प्राथमिकी दर्ज कराने आया हूँ।"',
        },
        {
          num: "2",
          label: "जीरो FIR का वैधानिक अधिकार",
          text: '"गृह मंत्रालय के आदेशानुसार साइबर अपराध में क्षेत्राधिकार का बंधन नहीं है। अतः कृपया इसे तुरंत जीरो FIR या GD में दर्ज करें।"',
        },
        {
          num: "3",
          label: "बैंक को लीन नोटिस व पावती प्रति",
          text: '"कृपया धारा 102 CrPC / 106 BNSS के तहत संबंधित बैंकों को खाता फ्रीज करने का नोटिस भेजें और मुझे मुहरयुक्त प्रमाणित प्रति दें।"',
        },
      ];

  const activeScript = activeDesk === "bank" ? bankScript : policeScript;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl max-h-[92dvh] bg-white rounded-2xl shadow-2xl border border-calm-border flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 print:max-h-none print:shadow-none print:border-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="counter-card-title"
      >
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-calm-border bg-teal-900 text-white flex items-center justify-between gap-3 print:bg-white print:text-black print:border-b-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-800 text-teal-200 print:hidden">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-800 text-[10px] font-bold uppercase tracking-wider text-teal-200 mb-0.5 print:hidden">
                <Sparkles className="h-3 w-3" />
                <span>{isEn ? "Offline Counter Reference" : "ऑफ़लाइन काउंटर कार्ड"}</span>
              </div>
              <h2
                id="counter-card-title"
                className="text-base sm:text-lg font-bold text-white print:text-black"
              >
                {isEn
                  ? "Bank & Police Thana Visit Mode"
                  : "बैंक शाखा व पुलिस थाना विज़िट मोड"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors print:hidden"
            >
              <Printer className="h-4 w-4" />
              <span>{isEn ? "Print Card" : "प्रिंट लें"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-teal-200 hover:text-white hover:bg-teal-800 min-h-[44px] min-w-[44px] flex items-center justify-center print:hidden"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Counter Destination Toggle Tabs */}
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-2 print:hidden">
          <div className="inline-flex rounded-xl bg-slate-200/80 p-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveDesk("bank")}
              className={`flex-1 sm:flex-initial min-h-[40px] px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeDesk === "bank"
                  ? "bg-white text-teal-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="h-4 w-4 text-teal-700" />
              <span>{isEn ? "At Bank Branch Counter" : "बैंक शाखा काउंटर पर"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDesk("police")}
              className={`flex-1 sm:flex-initial min-h-[40px] px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeDesk === "police"
                  ? "bg-white text-teal-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldAlert className="h-4 w-4 text-teal-700" />
              <span>{isEn ? "At Police Station / Cyber Cell" : "पुलिस थाना / साइबर सेल में"}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Pocket Card Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs sm:text-sm">
          {/* Section 1: 4-Item Document Checklist */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                  1
                </span>
                <span>{isEn ? "What to Carry (4-Item Checklist)" : "साथ क्या ले जाएं (4 जरूरी दस्तावेज)"}</span>
              </h3>
              <span className="text-[11px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 print:hidden">
                {Object.values(checkedDocs).filter(Boolean).length}/4 {isEn ? "Ready" : "तैयार"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documentChecklist.map((item, idx) => {
                const isChecked = !!checkedDocs[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleDoc(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                      isChecked
                        ? "bg-teal-50/70 border-teal-300 text-teal-950"
                        : "bg-white border-calm-border hover:border-slate-300"
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-teal-700 shrink-0 print:hidden"
                      aria-label={isChecked ? "Uncheck" : "Check"}
                    >
                      {isChecked ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight mb-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Exact 3-Line Counter Script (High Contrast Cue Cards) */}
          <div>
            <div className="mb-3">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                  2
                </span>
                <span>
                  {activeDesk === "bank"
                    ? isEn ? "Exact Words to Say to the Bank Manager:" : "शाखा प्रबंधक से कहने के लिए सटीक 3 वाक्य:"
                    : isEn ? "Exact Words to Say to the Duty Officer:" : "थाना ड्यूटी अधिकारी से कहने के लिए सटीक 3 वाक्य:"}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isEn
                  ? "Speak calmly and assertively. Read these exact sentences from your phone if needed."
                  : "शांत और स्पष्ट आवाज में बात करें। आवश्यकता होने पर सीधे फोन से पढ़कर कहें।"}
              </p>
            </div>

            <div className="space-y-3">
              {activeScript.map((cue, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-900 text-white p-4 border border-slate-800 shadow-md print:bg-white print:text-black print:border-black print:border"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-slate-950 text-[10px] font-extrabold">
                      {cue.num}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 print:text-slate-600">
                      {cue.label}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed font-sans select-all text-slate-100 print:text-black">
                    {cue.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Essential Quick Reference Numbers & Authority Rules */}
          <div className="rounded-xl bg-slate-100 p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                {isEn ? "Emergency Escalation Reference:" : "आपातकालीन संदर्भ:"}
              </span>
              <div className="flex items-center gap-3 text-slate-800 font-bold">
                <span>📞 National Helpline: 1930</span>
                <span>🌐 cybercrime.gov.in</span>
              </div>
            </div>

            <div className="text-[11px] text-teal-900 bg-white border border-teal-200 px-3 py-1.5 rounded-lg">
              <strong>{isEn ? "Legal Safeguard:" : "विधिक सुरक्षा:"}</strong>{" "}
              {activeDesk === "bank"
                ? isEn
                  ? "Zero Liability under RBI Circular DBR.No.Leg.BC.78/2017-18"
                  : "RBI सर्कुलर 2017-18 के तहत 3 दिन में शून्य ग्राहक देयता"
                : isEn
                  ? "Zero FIR mandatory under Section 154 CrPC / MHA Guidelines"
                  : "गृह मंत्रालय के अनुसार जीरो FIR अनिवार्य है"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
