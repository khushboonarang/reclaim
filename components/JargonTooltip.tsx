"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
    placement: "top" | "bottom";
  }>({
    top: 0,
    left: 0,
    width: 290,
    placement: "bottom",
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const info = jargonDictionary[lang]?.[termKey];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate coordinates with auto-flip when near top of viewport
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();

    // Readable width within [260px, 320px]
    const popoverWidth = Math.min(
      320,
      Math.max(260, window.innerWidth - 32)
    );
    const estimatedHeight = 180;
    const stickyHeaderBuffer = 75; // Account for sticky header height

    // Check available space above the trigger relative to top of viewport
    const spaceAbove = rect.top - stickyHeaderBuffer;

    // If space above is less than estimated popover height, FLIP BELOW trigger
    const placement: "top" | "bottom" =
      spaceAbove < estimatedHeight ? "bottom" : "top";

    let top: number;
    if (placement === "top") {
      top = window.scrollY + rect.top - estimatedHeight - 8;
    } else {
      // Flips below trigger so it never clips under sticky header
      top = window.scrollY + rect.bottom + 8;
    }

    // Horizontally center with screen edge clamping
    const triggerCenter = rect.left + rect.width / 2;
    const left = Math.max(
      16,
      Math.min(
        window.innerWidth - popoverWidth - 16,
        triggerCenter - popoverWidth / 2
      )
    );

    setPosition({ top, left, width: popoverWidth, placement });
  }, []);

  // Reposition on scroll or resize while open
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, updatePosition]);

  if (!info) {
    return <span>{displayText}</span>;
  }

  const label = displayText || info.term;

  return (
    <>
      {/* Interactive Trigger Button */}
      <button
        type="button"
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          if (!isOpen) {
            updatePosition();
            setIsOpen(true);
          } else {
            setIsOpen(false);
          }
        }}
        aria-expanded={isOpen}
        aria-label={`Explain term: ${info.term}`}
        className="inline-flex items-center gap-1 font-semibold text-teal-800 underline decoration-teal-400 decoration-dotted underline-offset-4 hover:text-teal-900 hover:decoration-teal-600 transition-colors cursor-pointer select-none py-0.5"
      >
        <span>{label}</span>
        <HelpCircle className="h-3.5 w-3.5 text-teal-600 shrink-0 opacity-80 hover:opacity-100" />
      </button>

      {/* React Portal to document.body: renders above sticky header with high z-index */}
      {mounted &&
        isOpen &&
        createPortal(
          <>
            {/* Click-outside backdrop */}
            <div
              className="fixed inset-0 z-[9998] bg-slate-900/15 backdrop-blur-[1px] cursor-default"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Floating Popover Card */}
            <div
              ref={popoverRef}
              role="dialog"
              aria-modal="true"
              style={{
                position: "absolute",
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${position.width}px`,
              }}
              className="z-[9999] min-w-[260px] max-w-[320px] rounded-2xl bg-white p-4 text-left shadow-2xl border border-teal-200/90 ring-1 ring-slate-900/10 animate-in fade-in zoom-in-95 duration-150"
            >
              {/* Header with Term and Close X button */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 mb-2.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                    i
                  </span>
                  <h4 className="text-xs font-bold text-calm-heading leading-tight truncate">
                    {info.term}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0 min-h-[28px] min-w-[28px] flex items-center justify-center"
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
          </>,
          document.body
        )}
    </>
  );
};
