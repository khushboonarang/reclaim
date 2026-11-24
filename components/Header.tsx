"use client";

import React, { useState } from "react";
import { Language } from "@/types/incident";
import { translations } from "@/lib/translations";
import { ShieldCheck, Lock, RotateCcw, AlertTriangle } from "lucide-react";

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  hasActiveIncident?: boolean;
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  hasActiveIncident = false,
  onReset,
}) => {
  const t = translations[lang];
  const isEn = lang === "en";
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleConfirmReset = () => {
    setShowConfirmReset(false);
    if (onReset) onReset();
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-calm-border/80 bg-calm-bg/90 backdrop-blur-md transition-colors duration-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Brand identity */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700 ring-1 ring-teal-600/20 shadow-xs">
              <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-calm-heading font-sans">
                  {t.brand.name}
                </span>
                <span className="hidden items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-800 border border-teal-200/60 sm:inline-flex">
                  <Lock className="h-3 w-3 text-teal-700" />
                  {t.brand.privacyBadge}
                </span>
              </div>
              <p className="text-xs font-normal text-calm-muted leading-tight">
                {t.brand.tagline}
              </p>
            </div>
          </div>

          {/* Action Controls: Reset Button + Language Toggle Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Start New Case / Reset Button (Shown when incident exists) */}
            {hasActiveIncident && (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors min-h-[38px]"
                title={isEn ? "Start a new case / reset state" : "नया केस शुरू करें / रीसेट"}
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                <span className="hidden sm:inline">
                  {isEn ? "New Case" : "नया केस"}
                </span>
              </button>
            )}

            {/* Bilingual Toggle Pill (English | हिंदी) */}
            <div
              className="inline-flex h-11 items-center rounded-full bg-slate-100 p-1 border border-calm-border shadow-xs"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                onClick={() => onLanguageChange("en")}
                className={`min-h-[36px] min-w-[65px] sm:min-w-[70px] px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/40 select-none ${
                  lang === "en"
                    ? "bg-white text-slate-900 shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                aria-pressed={lang === "en"}
              >
                English
              </button>

              <button
                type="button"
                onClick={() => onLanguageChange("hi")}
                className={`min-h-[36px] min-w-[65px] sm:min-w-[70px] px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/40 select-none font-sans ${
                  lang === "hi"
                    ? "bg-white text-teal-800 shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                aria-pressed={lang === "hi"}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Reassuring Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-calm-border p-6 text-left space-y-4"
            role="alertdialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-calm-heading">
                {isEn ? "Start a New Case?" : "क्या आप नया केस शुरू करना चाहते हैं?"}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isEn
                ? "This will clear your current local session so you can test another scenario or start fresh. Your previous inputs will be removed from this browser."
                : "यह आपके वर्तमान सत्र को साफ कर देगा ताकि आप कोई अन्य परिदृश्य टेस्ट कर सकें या शुरुआत से नया विवरण दर्ज कर सकें।"}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
              >
                {isEn ? "Cancel & Keep Case" : "रद्द करें"}
              </button>

              <button
                type="button"
                onClick={handleConfirmReset}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                {isEn ? "Yes, Start New Case" : "हाँ, नया केस शुरू करें"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
