"use client";

import React, { useState, useEffect, useMemo } from "react";
import { IncidentData, Language } from "@/types/incident";
import { performTriage, generateRecoveryPhases } from "@/lib/recoveryEngine";
import { FourWCard } from "./FourWCard";
import { SmartText } from "./SmartText";
import { ComplaintDraftModal } from "./ComplaintDraftModal";
import { PocketCounterCardModal } from "./PocketCounterCardModal";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Phone,
  ExternalLink,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Building2,
  FileCheck2,
  Layers,
  FileText,
  Briefcase,
} from "lucide-react";

interface RecoveryEngineViewProps {
  incident: IncidentData;
  lang: Language;
}

const STORAGE_KEY_CHECKLIST = "reclaim_checklist_progress_v2";

export const RecoveryEngineView: React.FC<RecoveryEngineViewProps> = ({
  incident,
  lang,
}) => {
  const isEn = lang === "en";

  // 1. Run Intelligent Triage
  const triage = useMemo(
    () => performTriage(incident, lang),
    [incident, lang]
  );

  // 2. Generate Conditional Recovery Phases
  const phases = useMemo(
    () => generateRecoveryPhases(incident, triage, lang),
    [incident, triage, lang]
  );

  // 3. Active Phase tab state
  const [activePhaseNum, setActivePhaseNum] = useState<number>(1);

  // 4. Checklist completion state (persisted in localStorage, cleanly reset per case)
  const [completedTaskIds, setCompletedTaskIds] = useState<Record<string, boolean>>({});

  // 5. Module 3 Modal States
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [draftInitialTab, setDraftInitialTab] = useState<"bank" | "police">("bank");
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKLIST);
      if (saved) {
        setCompletedTaskIds(JSON.parse(saved));
      } else {
        setCompletedTaskIds({});
      }
    } catch (e) {
      console.warn("Could not load checklist from localStorage", e);
      setCompletedTaskIds({});
    }
  }, [incident.capturedAt]);

  const handleToggleTask = (id: string) => {
    setCompletedTaskIds((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not persist checklist", e);
      }
      return updated;
    });
  };

  // Calculate overall progress across all applicable items
  const allItems = useMemo(
    () => phases.flatMap((phase) => phase.items),
    [phases]
  );
  const completedCount = allItems.filter((i) => completedTaskIds[i.id]).length;
  const progressPercent = allItems.length > 0
    ? Math.round((completedCount / allItems.length) * 100)
    : 0;

  // Find currently active phase
  const currentPhase = phases.find((p) => p.number === activePhaseNum) || phases[0];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 1. Triage Priority Banner */}
      <section
        className={`rounded-2xl p-5 sm:p-6 border transition-all duration-200 shadow-sm ${
          triage.track === "high_value"
            ? "bg-gradient-to-r from-amber-50/90 to-teal-50/70 border-amber-200/90 text-amber-950"
            : triage.track === "near_miss"
            ? "bg-gradient-to-r from-emerald-50/90 to-teal-50/70 border-emerald-200/90 text-emerald-950"
            : "bg-gradient-to-r from-teal-50/90 to-sky-50/70 border-teal-200/90 text-teal-950"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-xl shrink-0 ${
                triage.track === "high_value"
                  ? "bg-amber-600 text-white"
                  : triage.track === "near_miss"
                  ? "bg-emerald-600 text-white"
                  : "bg-teal-700 text-white"
              }`}
            >
              {triage.track === "near_miss" ? (
                <ShieldCheck className="h-5 w-5" />
              ) : triage.isGoldenHour ? (
                <Zap className="h-5 w-5" />
              ) : (
                <ShieldAlert className="h-5 w-5" />
              )}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/80 border border-current shadow-2xs">
                {triage.badgeText}
              </span>
              {triage.isGoldenHour && triage.track !== "near_miss" && (
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-800 text-white shadow-2xs">
                  {isEn ? "Golden Hour Window" : "गोल्डन ऑवर सक्रिय"}
                </span>
              )}
            </div>
          </div>

          {/* Quick Helpline Callout */}
          <a
            href="tel:1930"
            className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-xl bg-teal-800 text-white text-xs font-bold hover:bg-teal-900 shadow-xs transition-colors shrink-0"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>{isEn ? "Call 1930 Now" : "1930 पर तुरंत कॉल करें"}</span>
          </a>
        </div>

        <h2 className="text-base sm:text-lg font-bold leading-snug mb-1.5">
          {triage.bannerTitle}
        </h2>
        <p className="text-xs sm:text-sm opacity-90 leading-relaxed mb-4 max-w-3xl">
          {triage.bannerDescription}
        </p>

        {/* Smart Jurisdictional Routing Chips */}
        <div className="pt-3 border-t border-black/5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-start gap-2 bg-white/80 rounded-xl p-2.5 border border-black/5">
            <Building2 className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                {isEn ? "Police Jurisdiction:" : "नामित पुलिस क्षेत्राधिकार:"}
              </span>
              <span className="font-semibold text-calm-heading">
                <SmartText text={triage.routedPoliceAuthority} lang={lang} />
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-white/80 rounded-xl p-2.5 border border-black/5">
            <FileCheck2 className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                {isEn ? "Banking Escalation Desk:" : "नामित बैंक शिकायत स्तर:"}
              </span>
              <span className="font-semibold text-calm-heading">
                <SmartText text={triage.routedBankAuthority} lang={lang} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Top Action Bar: Module 3 Quick Tools (Drafts + Counter Reference Card) */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-calm-border/80 shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
            ✓
          </span>
          <div>
            <span className="text-xs sm:text-sm font-bold text-calm-heading block">
              {isEn ? "Recovery Action Progress" : "रिकवरी कार्रवाई की प्रगति"}
            </span>
            <span className="text-[11px] text-teal-800 font-semibold">
              {completedCount} / {allItems.length} {isEn ? "Actions Completed" : "कार्य पूर्ण"} ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Action Buttons for Drafts & Visit Mode */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setDraftInitialTab("bank");
              setIsDraftModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 min-h-[42px] px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs border border-teal-200 transition-colors shadow-2xs"
          >
            <FileText className="h-4 w-4 text-teal-700" />
            <span>{isEn ? "Ready-to-Use Drafts" : "तैयार शिकायत प्रारूप"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCounterModalOpen(true)}
            className="inline-flex items-center gap-1.5 min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-2xs"
          >
            <Briefcase className="h-4 w-4 text-teal-300" />
            <span>{isEn ? "Branch / Thana Visit Mode" : "शाखा / थाना विज़िट मोड"}</span>
          </button>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80 mt-1">
          <div
            className="h-full bg-teal-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {/* 3. Near-Miss Exit Path Card (If no direct money loss) */}
      {triage.track === "near_miss" && (
        <section className="bg-emerald-50/80 rounded-2xl p-5 sm:p-6 border border-emerald-200 shadow-soft">
          <div className="flex items-start gap-3.5 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-emerald-950">
                {isEn
                  ? "You're Protected — Digital Hygiene & Prevention Track"
                  : "आप सुरक्षित हैं — डिजिटल स्वच्छता एवं रोकथाम ट्रैक"}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 mt-0.5 leading-relaxed">
                {isEn
                  ? "Because no funds were transferred out, formal bank disputes or police FIR court orders are NOT required. Complete the 3 containment steps below to ensure your accounts and devices are fully shielded."
                  : "चूंकि कोई राशि ट्रांसफर नहीं हुई है, इसलिए बैंक विवाद या अदालत के आदेश की आवश्यकता नहीं है। अपने खाते और डिवाइस को पूरी तरह सुरक्षित करने के लिए नीचे दिए गए 3 रोकथाम कदम पूरे करें।"}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 4. Conditional 5-Stage Stepper Navigation */}
      {triage.track !== "near_miss" && (
        <nav
          aria-label="Recovery Phases"
          className="bg-white rounded-2xl p-2 sm:p-3 border border-calm-border/80 shadow-soft overflow-x-auto scrollbar-none"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
            {phases.map((phase) => {
              const isActive = phase.number === activePhaseNum;
              const phaseCompletedCount = phase.items.filter(
                (i) => completedTaskIds[i.id]
              ).length;
              const isPhaseDone =
                phase.items.length > 0 &&
                phaseCompletedCount === phase.items.length;

              return (
                <button
                  key={phase.number}
                  type="button"
                  onClick={() => setActivePhaseNum(phase.number)}
                  className={`min-h-[46px] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center gap-2 select-none ${
                    isActive
                      ? "bg-teal-700 text-white shadow-xs font-bold"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-white text-teal-800"
                        : isPhaseDone
                        ? "bg-teal-600 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {isPhaseDone ? "✓" : phase.number}
                  </span>
                  <span>{phase.shortTitle}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-teal-800/80 text-teal-100"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {phaseCompletedCount}/{phase.items.length}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* 5. Active Phase Title & 4W Precision Checklist */}
      <section className="space-y-4">
        {/* Phase Header Info */}
        <div className="px-1 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider mb-1">
              <Layers className="h-3.5 w-3.5 text-teal-600" />
              <span>
                {isEn ? "Phase" : "चरण"} {currentPhase.number} / {phases.length}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-calm-heading">
              {currentPhase.title}
            </h3>
            <p className="text-xs sm:text-sm text-calm-muted mt-1 leading-relaxed">
              <SmartText text={currentPhase.description} lang={lang} />
            </p>
          </div>

          {/* Quick Action Shortcut inside Phase 3 */}
          {currentPhase.number === 3 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraftInitialTab("bank");
                  setIsDraftModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-800 text-white text-xs font-bold hover:bg-teal-900 transition-colors shadow-2xs"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>{isEn ? "Open Pre-Filled Drafts" : "तैयार पत्र प्रारूप खोलें"}</span>
              </button>
            </div>
          )}
        </div>

        {/* 4W Action Items List */}
        <div className="space-y-3 sm:space-y-4">
          {currentPhase.items.map((item) => (
            <FourWCard
              key={item.id}
              item={item}
              lang={lang}
              isCompleted={!!completedTaskIds[item.id]}
              onToggleComplete={handleToggleTask}
            />
          ))}
        </div>

        {/* Next Phase Navigation Button */}
        {triage.track !== "near_miss" && activePhaseNum < phases.length && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setActivePhaseNum((prev) => Math.min(prev + 1, phases.length))}
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-teal-800 text-white text-xs sm:text-sm font-semibold hover:bg-teal-900 transition-colors shadow-xs"
            >
              <span>
                {isEn
                  ? `Proceed to ${phases[activePhaseNum]?.shortTitle}`
                  : `अगले ${phases[activePhaseNum]?.shortTitle} पर जाएं`}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>

      {/* 6. Emergency & Official Portal Links Bar */}
      <footer className="rounded-2xl bg-slate-100/80 border border-calm-border/80 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-teal-700" />
          <span className="font-semibold text-slate-800">
            {isEn ? "Official Reporting Channels:" : "आधिकारिक रिपोर्टिंग चैनल:"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="tel:1930"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 font-bold border border-teal-200 hover:bg-teal-100 transition-colors"
          >
            <Phone className="h-3 w-3" />
            <span>📞 1930</span>
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-slate-800 font-semibold border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            <span>cybercrime.gov.in</span>
          </a>
          <a
            href="https://cms.rbi.org.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-slate-800 font-semibold border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            <span>cms.rbi.org.in</span>
          </a>
        </div>
      </footer>

      {/* Module 3 Modal: Complaint Draft Generator */}
      <ComplaintDraftModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        incident={incident}
        triage={triage}
        lang={lang}
        initialTab={draftInitialTab}
      />

      {/* Module 3 Modal: Pocket Counter Card (Branch & Thana Visit Mode) */}
      <PocketCounterCardModal
        isOpen={isCounterModalOpen}
        onClose={() => setIsCounterModalOpen(false)}
        lang={lang}
        triage={triage}
      />
    </div>
  );
};
