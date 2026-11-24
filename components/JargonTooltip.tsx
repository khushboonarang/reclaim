"use client";

import React, { useState, useRef, useEffect } from "react";
import { JargonTermKey } from "@/types/recovery";
import { Language } from "@/types/incident";
import { jargonDictionary } from "@/lib/jargonDictionary";
import { HelpCircle, X, MapPin, Lightbulb } from "lucide-react";

interface JargonTooltipProps {
  termKey: JargonTermKey;
  lang: Language;
  displayText?: string;
}

export const JargonTooltip: React.FC<JargonTooltipProps> = ({
  termKey,
  lang,
  displayText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const info = jargonDictionary[lang][termKey];

  // Close when tapping outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  if (!info) {
    return <span>{displayText}</span>;
  }

  const label = displayText || info.term;

  return (
    <span ref={containerRef} className="relative inline-block">
      {/* Interactive Trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
        aria-label={`Explain term: ${info.term}`}
        className="inline-flex items-center gap-1 font-semibold text-teal-800 underline decoration-teal-400 decoration-dotted underline-offset-4 hover:text-teal-900 hover:decoration-teal-600 transition-colors cursor-pointer select-none py-0.5"
      >
        <span>{label}</span>
        <HelpCircle className="h-3.5 w-3.5 text-teal-600 shrink-0 opacity-80 hover:opacity-100" />
      </button>

      {/* Popover / Sheet */}
      {isOpen && (
        <>
          {/* Mobile backdrop for easy dismissal */}
          <div
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            className="fixed bottom-4 left-4 right-4 z-50 sm:absolute sm:bottom-full sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:mb-2 w-auto sm:w-84 max-w-sm rounded-2xl bg-white p-4 text-left shadow-2xl border border-teal-200/90 ring-1 ring-slate-900/5 animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                  i
                </span>
                <h4 className="text-xs font-bold text-calm-heading leading-tight">
                  {info.term}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close explanation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Line 1: Plain-Language Everyday Meaning */}
            <div className="flex items-start gap-2 mb-2.5">
              <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {info.meaning}
              </p>
            </div>

            {/* Line 2: Where to find it / What happens next */}
            <div className="flex items-start gap-2 rounded-xl bg-teal-50/70 p-2.5 border border-teal-100 text-[11px] text-teal-900 leading-relaxed">
              <MapPin className="h-3.5 w-3.5 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-teal-950 mb-0.5">
                  {lang === "en" ? "Where to find / What next:" : "कहाँ मिलेगा / आगे क्या होगा:"}
                </strong>
                <span>{info.whereToFind}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </span>
  );
};
