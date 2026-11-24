"use client";

import React, { useState } from "react";
import { IncidentData, Language } from "@/types/incident";
import { translations } from "@/lib/translations";
import { RecoveryEngineView } from "./RecoveryEngineView";
import {
  CheckCircle2,
  Clock,
  IndianRupee,
  FileText,
  RotateCcw,
  Edit3,
  HardDrive,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
} from "lucide-react";

interface CapturedStateVerificationProps {
  lang: Language;
  incident: IncidentData;
  onEdit: () => void;
  onReset: () => void;
}

export const CapturedStateVerification: React.FC<CapturedStateVerificationProps> = ({
  lang,
  incident,
  onEdit,
  onReset,
}) => {
  const t = translations[lang];
  const [showJsonRaw, setShowJsonRaw] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Format captured timestamp
  const formattedTime = new Date(incident.capturedAt).toLocaleString(
    lang === "hi" ? "hi-IN" : "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );

  // Get readable amount label
  const amountLabel = incident.amountBracket
    ? t.amountOptions[incident.amountBracket]
    : t.verification.notSpecified;

  // Get readable time label
  const timeLabel = incident.timeElapsed
    ? t.timeOptions[incident.timeElapsed]
    : t.verification.notSpecified;

  // Category title if guided
  const categoryTitle = incident.selectedCategory
    ? t.path2.scenarios[incident.selectedCategory]?.title || incident.selectedCategory
    : t.verification.notSpecified;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
      {/* Top Header & Incident Summary Bar */}
      <section className="bg-white rounded-2xl shadow-card border border-calm-border/80 overflow-hidden">
        {/* Clickable Header bar to toggle summary details */}
        <div
          onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
          className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 border-b border-calm-border cursor-pointer select-none hover:bg-slate-100/70 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600/10 text-teal-700">
              <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-calm-heading flex items-center gap-2">
                <span>{lang === "en" ? "Incident Profile" : "दर्ज घटना का विवरण"}</span>
                <span className="text-xs font-normal text-slate-500">
                  ({categoryTitle})
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors"
            >
              <Edit3 className="h-3 w-3" />
              <span>{t.verification.btnEdit}</span>
            </button>

            <span className="p-1 text-slate-400">
              {isSummaryExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </span>
          </div>
        </div>

        {/* Collapsible Incident Profile details */}
        {isSummaryExpanded && (
          <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm animate-in fade-in duration-150">
            {/* Intake Path & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-calm-bg/80 border border-calm-border/60 p-3">
                <span className="text-[10px] font-semibold text-calm-muted uppercase tracking-wider block mb-0.5">
                  {t.verification.labelPathType}
                </span>
                <span className="font-bold text-calm-heading">
                  {incident.pathType === "free_text"
                    ? t.verification.pathFreeText
                    : t.verification.pathGuided}
                </span>
              </div>

              <div className="rounded-xl bg-calm-bg/80 border border-calm-border/60 p-3">
                <span className="text-[10px] font-semibold text-calm-muted uppercase tracking-wider block mb-0.5">
                  {t.verification.labelCategory}
                </span>
                <span className="font-bold text-calm-heading">
                  {categoryTitle}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl bg-calm-bg/80 border border-calm-border/60 p-3.5">
              <span className="text-[10px] font-semibold text-calm-muted uppercase tracking-wider flex items-center gap-1 mb-1">
                <FileText className="h-3 w-3 text-teal-600" />
                {t.verification.labelIncidentDetails}
              </span>
              <p className="text-slate-800 font-medium whitespace-pre-wrap leading-relaxed">
                {incident.incidentText}
              </p>
            </div>

            {/* Amount & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-calm-bg/80 border border-calm-border/60 p-3 flex items-center gap-2.5">
                <IndianRupee className="h-4 w-4 text-teal-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-semibold text-calm-muted uppercase tracking-wider block">
                    {t.verification.labelAmountBracket}
                  </span>
                  <span className="font-bold text-calm-heading">
                    {amountLabel}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-calm-bg/80 border border-calm-border/60 p-3 flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-sky-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-semibold text-calm-muted uppercase tracking-wider block">
                    {t.verification.labelTimeElapsed}
                  </span>
                  <span className="font-bold text-calm-heading">
                    {timeLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy Confirmation */}
            <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>{t.verification.labelCapturedAt}: {formattedTime}</span>
              </div>
              <div className="flex items-center gap-1 text-teal-800 font-medium">
                <HardDrive className="h-3 w-3 text-teal-600" />
                <span>{t.verification.deviceStorageValue}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* MODULE 2 RECOVERY ENGINE (Replaces temporary placeholder) */}
      <RecoveryEngineView incident={incident} lang={lang} />

      {/* Action Footer: Reset / Start Over */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 p-2 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
          <span>{t.verification.btnReset}</span>
        </button>

        {/* Developer Raw State Inspection Toggle */}
        <button
          type="button"
          onClick={() => setShowJsonRaw(!showJsonRaw)}
          className="text-xs text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 transition-colors"
        >
          <span>{showJsonRaw ? "Hide Raw State" : "Inspect Raw LocalStorage JSON"}</span>
          {showJsonRaw ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
      </div>

      {showJsonRaw && (
        <div className="mt-2 text-left bg-slate-900 rounded-xl p-4 text-teal-300 font-mono text-xs overflow-x-auto shadow-inner">
          <pre>{JSON.stringify(incident, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
