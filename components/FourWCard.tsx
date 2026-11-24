"use client";

import React, { useState } from "react";
import { FourWActionItem } from "@/types/recovery";
import { Language } from "@/types/incident";
import { SmartText } from "./SmartText";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  HelpCircle,
  ExternalLink,
  Phone,
  FileText,
  AlertCircle,
  Layers,
  Sparkles,
} from "lucide-react";

interface FourWCardProps {
  item: FourWActionItem;
  lang: Language;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
}

export const FourWCard: React.FC<FourWCardProps> = ({
  item,
  lang,
  isCompleted,
  onToggleComplete,
}) => {
  const isEn = lang === "en";
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"how" | "brief">("how");

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 shadow-soft overflow-hidden ${
        isCompleted
          ? "bg-slate-50/80 border-teal-200/90 opacity-90"
          : "bg-white border-calm-border hover:border-teal-300"
      }`}
    >
      {/* Header bar: Checkbox + Title + Timeframe + Collapse toggle */}
      <div
        className="p-4 sm:p-5 flex items-start gap-3.5 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Interactive Checkbox (min 44px tap target) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(item.id);
          }}
          aria-checked={isCompleted}
          role="checkbox"
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
          className={`flex h-8 w-8 min-h-[32px] min-w-[32px] sm:h-9 sm:w-9 sm:min-h-[36px] sm:min-w-[36px] items-center justify-center rounded-xl border transition-all shrink-0 mt-0.5 focus:outline-none focus:ring-3 focus:ring-teal-500/30 ${
            isCompleted
              ? "bg-teal-600 border-teal-600 text-white shadow-xs"
              : "bg-white border-slate-300 text-transparent hover:border-teal-500"
          }`}
        >
          <Check className={`h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5] ${isCompleted ? "opacity-100" : "opacity-0"}`} />
        </button>

        {/* Title and summary */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3
              className={`text-sm sm:text-base font-bold leading-snug transition-colors ${
                isCompleted
                  ? "line-through text-slate-500"
                  : "text-calm-heading hover:text-teal-900"
              }`}
            >
              <SmartText text={item.title} lang={lang} />
            </h3>
          </div>

          {/* Quick Scannable Timeframe & Authority */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
              <Clock className="h-3 w-3" />
              <span>{item.when}</span>
            </span>
            <span className="truncate max-w-[220px] sm:max-w-none text-slate-600 font-medium">
              📍 {item.where}
            </span>
          </div>
        </div>

        {/* Expand / Collapse Button (Touch target min 44px) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="p-2 -mr-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center min-h-[44px] min-w-[44px]"
          aria-label={isExpanded ? "Collapse details" : "Expand details"}
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-teal-700" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Structured 4W Breakdown (Scannable & Collapsible) */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 space-y-4 text-xs sm:text-sm animate-in fade-in duration-150">
          {/* 1. WHAT */}
          <div className="rounded-xl bg-white border border-calm-border/80 p-3.5 shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-teal-800 uppercase tracking-wider text-[11px] mb-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-100 text-teal-900 text-[9px] font-extrabold">
                W1
              </span>
              <span>{isEn ? "WHAT — Exact Action" : "क्या — सटीक कार्रवाई"}</span>
            </div>
            <p className="text-calm-heading font-medium leading-relaxed">
              <SmartText text={item.what} lang={lang} />
            </p>
          </div>

          {/* 2. WHEN & 4. WHERE (Side-by-side or stacked on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* WHEN */}
            <div className="rounded-xl bg-white border border-calm-border/80 p-3.5 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-teal-800 uppercase tracking-wider text-[11px] mb-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-100 text-teal-900 text-[9px] font-extrabold">
                  W2
                </span>
                <span>{isEn ? "WHEN — Timeframe" : "कब — समय सीमा"}</span>
              </div>
              <p className="text-slate-700 font-medium">
                {item.when}
              </p>
            </div>

            {/* WHERE */}
            <div className="rounded-xl bg-white border border-calm-border/80 p-3.5 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-teal-800 uppercase tracking-wider text-[11px] mb-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-100 text-teal-900 text-[9px] font-extrabold">
                  W3
                </span>
                <span>{isEn ? "WHERE — Exact Authority Desk" : "कहाँ — संपर्क पोर्टल या डेस्क"}</span>
              </div>
              <p className="text-slate-700 font-medium mb-1.5">
                <SmartText text={item.where} lang={lang} />
              </p>
              {/* Quick Action Links if available */}
              <div className="flex flex-wrap gap-2 pt-1">
                {item.whereContact && (
                  <a
                    href={`tel:${item.whereContact}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 font-bold text-xs border border-teal-200 hover:bg-teal-100"
                  >
                    <Phone className="h-3 w-3" />
                    <span>{isEn ? "Call" : "कॉल"} {item.whereContact}</span>
                  </a>
                )}
                {item.whereUrl && (
                  <a
                    href={item.whereUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 font-semibold text-xs border border-sky-200 hover:bg-sky-100"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>{isEn ? "Open Official Portal" : "आधिकारिक पोर्टल खोलें"}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 3. HOW + PROCEDURE BRIEF (Tabbed/Structured) */}
          <div className="rounded-xl bg-white border border-calm-border/80 p-3.5 sm:p-4 shadow-xs">
            {/* Sub-header tab toggle */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <div className="flex items-center gap-1.5 font-bold text-teal-800 uppercase tracking-wider text-[11px]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-100 text-teal-900 text-[9px] font-extrabold">
                  W4
                </span>
                <span>{isEn ? "HOW — Instructions & Brief" : "कैसे — निर्देश व संक्षिप्त विवरण"}</span>
              </div>

              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("how")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    activeTab === "how"
                      ? "bg-white text-teal-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isEn ? "Step-by-Step" : "कदम-दर-कदम"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("brief")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    activeTab === "brief"
                      ? "bg-white text-teal-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isEn ? "Procedure Brief" : "प्रक्रिया विवरण"}
                </button>
              </div>
            </div>

            {/* Content: Step-by-Step */}
            {activeTab === "how" ? (
              <ol className="space-y-2 list-decimal list-inside text-slate-700 leading-relaxed font-normal">
                {item.howSteps.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    <span className="font-normal text-calm-heading">
                      <SmartText text={step} lang={lang} />
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              /* Content: Procedure Brief */
              <div className="space-y-3 pt-1 text-xs">
                {/* What to say/write */}
                <div className="rounded-lg bg-teal-50/70 p-3 border border-teal-100">
                  <div className="font-bold text-teal-950 flex items-center gap-1 mb-1">
                    <FileText className="h-3.5 w-3.5 text-teal-700" />
                    <span>{isEn ? "What to Say / Write (Verbatim template):" : "क्या कहें / क्या लिखें (तैयार प्रारूप):"}</span>
                  </div>
                  <p className="text-teal-900 italic font-sans leading-relaxed select-all">
                    "{item.procedureBrief.whatToSayOrWrite}"
                  </p>
                </div>

                {/* Documents needed */}
                <div>
                  <span className="font-bold text-slate-800 block mb-1">
                    📋 {isEn ? "Documents / Proof Needed:" : "आवश्यक दस्तावेज / साक्ष्य:"}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.procedureBrief.documentsNeeded.map((doc, i) => (
                      <span
                        key={i}
                        className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                      >
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* What happens next */}
                <div className="flex items-start gap-1.5 text-slate-600">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 font-semibold">
                      {isEn ? "What happens next: " : "आगे क्या होगा: "}
                    </strong>
                    <span>
                      <SmartText text={item.procedureBrief.whatHappensNext} lang={lang} />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
