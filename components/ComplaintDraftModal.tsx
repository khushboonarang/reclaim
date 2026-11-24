"use client";

import React, { useState, useMemo } from "react";
import { IncidentData, Language } from "@/types/incident";
import { TriageResult } from "@/types/recovery";
import {
  DraftFieldValues,
  getDefaultDraftFields,
  generateBankDisputeEmail,
  generatePoliceComplaintLetter,
} from "@/lib/draftTemplates";
import {
  X,
  Copy,
  Check,
  Download,
  Printer,
  Building,
  ShieldAlert,
  Edit2,
  FileText,
  Sparkles,
} from "lucide-react";

interface ComplaintDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: IncidentData;
  triage: TriageResult;
  lang: Language;
  initialTab?: "bank" | "police";
}

export const ComplaintDraftModal: React.FC<ComplaintDraftModalProps> = ({
  isOpen,
  onClose,
  incident,
  triage,
  lang,
  initialTab = "bank",
}) => {
  const isEn = lang === "en";
  const [activeTab, setActiveTab] = useState<"bank" | "police">(initialTab);
  const [copied, setCopied] = useState(false);
  const [showFieldEditor, setShowFieldEditor] = useState(false);

  // Initialize editable fields
  const [fields, setFields] = useState<DraftFieldValues>(() =>
    getDefaultDraftFields(incident, triage)
  );

  // Generate drafts reactively
  const bankDraft = useMemo(
    () => generateBankDisputeEmail(incident, triage, fields, lang),
    [incident, triage, fields, lang]
  );

  const policeDraft = useMemo(
    () => generatePoliceComplaintLetter(incident, triage, fields, lang),
    [incident, triage, fields, lang]
  );

  const currentDraft = activeTab === "bank" ? bankDraft : policeDraft;

  if (!isOpen) return null;

  // Handle Copy
  const handleCopy = async () => {
    const fullText = `SUBJECT: ${currentDraft.subject}\n\n${currentDraft.body}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn("Copy failed", e);
    }
  };

  // Handle Download as .txt
  const handleDownload = () => {
    const fullText = `SUBJECT: ${currentDraft.subject}\n\n${currentDraft.body}`;
    const filename =
      activeTab === "bank"
        ? `Reclaim_Bank_Dispute_Letter_${Date.now()}.txt`
        : `Reclaim_Police_Cyber_Complaint_${Date.now()}.txt`;

    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle Print
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${currentDraft.subject}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; }
            h2 { font-size: 16px; border-bottom: 2px solid #0f766e; padding-bottom: 8px; color: #0f766e; }
            pre { font-family: inherit; white-space: pre-wrap; font-size: 14px; }
          </style>
        </head>
        <body>
          <h2>SUBJECT: ${currentDraft.subject}</h2>
          <pre>${currentDraft.body}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl max-h-[92dvh] bg-white rounded-2xl shadow-2xl border border-calm-border flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="draft-modal-title"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-calm-border bg-calm-bg/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="draft-modal-title"
                className="text-base sm:text-lg font-bold text-calm-heading"
              >
                {isEn ? "Ready-to-Use Complaint Drafts" : "तैयार शिकायत प्रारूप"}
              </h2>
              <p className="text-xs text-calm-muted">
                {isEn
                  ? "Pre-filled with your incident details • Edit fields or copy instantly"
                  : "आपकी घटना के अनुसार स्वतः तैयार • तुरंत कॉपी करें या प्रिंट लें"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher & Editor Toggle */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-white">
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("bank")}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "bank"
                  ? "bg-white text-teal-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building className="h-3.5 w-3.5" />
              <span>{isEn ? "Bank Dispute & Lien Email" : "बैंक विवाद व लीन ईमेल"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("police")}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "police"
                  ? "bg-white text-teal-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>{isEn ? "Police / Cyber Cell Complaint" : "पुलिस / साइबर सेल प्रार्थना पत्र"}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowFieldEditor(!showFieldEditor)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>
              {showFieldEditor
                ? isEn ? "Hide Field Editor" : "एडिटर छुपाएं"
                : isEn ? "Fill / Edit Details" : "विवरण भरें / बदलें"}
            </span>
          </button>
        </div>

        {/* Inline Field Editor Accordion */}
        {showFieldEditor && (
          <div className="px-5 py-3.5 bg-teal-50/40 border-b border-teal-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs animate-in fade-in duration-150">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {isEn ? "Your Full Name:" : "आपका पूरा नाम:"}
              </label>
              <input
                type="text"
                value={fields.victimName}
                onChange={(e) => setFields({ ...fields, victimName: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {isEn ? "Amount Debited (₹):" : "धोखाधड़ी राशि (₹):"}
              </label>
              <input
                type="text"
                value={fields.disputedAmount}
                onChange={(e) => setFields({ ...fields, disputedAmount: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {isEn ? "12-Digit UTR Number:" : "12 अंकों का UTR नंबर:"}
              </label>
              <input
                type="text"
                value={fields.utrNumber}
                onChange={(e) => setFields({ ...fields, utrNumber: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {isEn ? "Bank Account Number:" : "बैंक खाता संख्या:"}
              </label>
              <input
                type="text"
                value={fields.accountNumber}
                onChange={(e) => setFields({ ...fields, accountNumber: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {isEn ? "Recipient UPI / Account:" : "धोखेबाज का UPI / खाता:"}
              </label>
              <input
                type="text"
                value={fields.beneficiaryDetails}
                onChange={(e) => setFields({ ...fields, beneficiaryDetails: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {isEn ? "14-digit NCRP (1930) ID:" : "NCRP (1930) पावती संख्या:"}
              </label>
              <input
                type="text"
                value={fields.ncrpNumber}
                onChange={(e) => setFields({ ...fields, ncrpNumber: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Modal Scrollable Body: Subject + Preview */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40 text-xs sm:text-sm font-sans">
          {/* Subject Line */}
          <div className="bg-white rounded-xl p-3.5 border border-calm-border shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block mb-1">
              {isEn ? "Subject Line:" : "विषय पंक्ति:"}
            </span>
            <p className="font-semibold text-slate-900 select-all">
              {currentDraft.subject}
            </p>
          </div>

          {/* Letter Body */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-calm-border shadow-xs">
            <pre className="font-sans whitespace-pre-wrap text-slate-800 leading-relaxed select-all">
              {currentDraft.body}
            </pre>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-5 py-3.5 border-t border-calm-border bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span>
              {isEn
                ? "Formatted to statutory RBI & IT Act standards"
                : "RBI एवं IT एक्ट के कानूनी मानकों के अनुसार तैयार"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>{isEn ? "Print" : "प्रिंट"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>{isEn ? "Download .txt" : "डाउनलोड (.txt)"}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className={`min-h-[44px] px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                copied
                  ? "bg-teal-700 text-white"
                  : "bg-teal-800 hover:bg-teal-900 text-white"
              }`}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? (isEn ? "Copied to Clipboard!" : "कॉपी हो गया!") : (isEn ? "Copy Draft" : "ड्राफ्ट कॉपी करें")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
