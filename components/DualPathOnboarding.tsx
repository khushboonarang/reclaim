"use client";

import React, { useState } from "react";
import { AmountBracket, FraudCategory, IncidentData, Language, TimeElapsed } from "@/types/incident";
import { translations } from "@/lib/translations";
import {
  CreditCard,
  ShieldAlert,
  TrendingUp,
  KeyRound,
  UserX,
  ArrowRight,
  Clock,
  IndianRupee,
  Sparkles,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

interface DualPathOnboardingProps {
  lang: Language;
  onCaptureIncident: (data: Omit<IncidentData, "capturedAt">) => void;
}

export const DualPathOnboarding: React.FC<DualPathOnboardingProps> = ({
  lang,
  onCaptureIncident,
}) => {
  const t = translations[lang];

  // Path 1 local form state
  const [incidentText, setIncidentText] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<AmountBracket>("");
  const [selectedTime, setSelectedTime] = useState<TimeElapsed>("");
  const [showError, setShowError] = useState(false);

  // Path 1 Submission handler
  const handlePath1Submit = (e: React.FormEvent) => {
    e.preventDefault();

    // The user can type text or select tags
    const hasText = incidentText.trim().length > 0;
    const hasTags = selectedAmount !== "" || selectedTime !== "";

    if (!hasText && !hasTags) {
      setShowError(true);
      return;
    }

    setShowError(false);

    onCaptureIncident({
      pathType: "free_text",
      incidentText: incidentText.trim() || (lang === "en" ? "Self-reported incident with quick tags" : "त्वरित टैग के साथ दर्ज की गई घटना"),
      selectedCategory: "other", // AI in Module 2 will classify this, or defaults to general
      amountBracket: selectedAmount,
      timeElapsed: selectedTime,
    });
  };

  // Path 2 Card Click handler
  const handleGuidedOptionSelect = (category: FraudCategory) => {
    const scenario = t.path2.scenarios[category];

    onCaptureIncident({
      pathType: "guided_option",
      incidentText: `${scenario.title} — ${scenario.description}`,
      selectedCategory: category,
      amountBracket: selectedAmount || "not_sure",
      timeElapsed: selectedTime || "under_2hrs",
    });
  };

  // Scenario Cards Configuration
  const guidedScenarios: Array<{
    category: FraudCategory;
    icon: React.ReactNode;
    colorClasses: string;
  }> = [
    {
      category: "upi_bank_transfer",
      icon: <CreditCard className="h-5 w-5 text-teal-700 sm:h-6 sm:w-6" />,
      colorClasses: "bg-teal-50/70 border-teal-200/70 text-teal-900 group-hover:border-teal-400",
    },
    {
      category: "digital_arrest",
      icon: <ShieldAlert className="h-5 w-5 text-sky-700 sm:h-6 sm:w-6" />,
      colorClasses: "bg-sky-50/70 border-sky-200/70 text-sky-900 group-hover:border-sky-400",
    },
    {
      category: "investment_task",
      icon: <TrendingUp className="h-5 w-5 text-emerald-700 sm:h-6 sm:w-6" />,
      colorClasses: "bg-emerald-50/70 border-emerald-200/70 text-emerald-900 group-hover:border-emerald-400",
    },
    {
      category: "phishing_otp",
      icon: <KeyRound className="h-5 w-5 text-amber-700 sm:h-6 sm:w-6" />,
      colorClasses: "bg-amber-50/70 border-amber-200/70 text-amber-900 group-hover:border-amber-400",
    },
    {
      category: "social_account_hacked",
      icon: <UserX className="h-5 w-5 text-indigo-700 sm:h-6 sm:w-6" />,
      colorClasses: "bg-indigo-50/70 border-indigo-200/70 text-indigo-900 group-hover:border-indigo-400",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:px-6 sm:py-10">
      {/* Empathetic Hero Header */}
      <section className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-medium mb-3 border border-teal-200/80">
          <Sparkles className="h-3.5 w-3.5 text-teal-600" />
          <span>{lang === "en" ? "Guided Emergency Recovery" : "निर्देशित आपातकालीन रिकवरी"}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-calm-heading tracking-tight leading-snug sm:leading-tight mb-3">
          {t.hero.headline}
        </h1>

        <p className="text-sm sm:text-base text-calm-muted max-w-2xl mx-auto leading-relaxed">
          {t.hero.subheadline}
        </p>

        {/* Calm reassurance banner */}
        <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-100/80 text-slate-700 text-xs font-medium border border-slate-200">
          <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
          <span>{t.hero.safetyNote}</span>
        </div>
      </section>

      {/* PATH 1: Primary Free-Text Intake */}
      <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-card border border-calm-border/80 transition-all duration-200 hover:border-teal-200/80 mb-8">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white text-xs font-bold">
            1
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-calm-heading">
            {t.path1.sectionTitle}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-calm-muted mb-4 pl-8">
          {t.path1.sectionSubtitle}
        </p>

        <form onSubmit={handlePath1Submit} className="space-y-5">
          {/* Text Area */}
          <div className="relative">
            <textarea
              value={incidentText}
              onChange={(e) => {
                setIncidentText(e.target.value);
                if (showError) setShowError(false);
              }}
              rows={4}
              placeholder={t.path1.textareaPlaceholder}
              aria-label={t.path1.sectionTitle}
              className="w-full rounded-xl border border-calm-border bg-calm-bg/50 p-3.5 sm:p-4 text-sm sm:text-base text-calm-heading placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-3 focus:ring-teal-500/15 transition-all duration-150 resize-y min-h-[110px]"
            />
            <p className="mt-1.5 text-[11px] sm:text-xs text-slate-500 flex items-center gap-1">
              <HelpCircle className="h-3 w-3 text-slate-400 shrink-0" />
              {t.path1.textareaHint}
            </p>
          </div>

          {/* Quick Context Pill Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Amount Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <IndianRupee className="h-3.5 w-3.5 text-teal-600" />
                {t.path1.amountLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {(["under_20l", "above_20l"] as Array<Exclude<AmountBracket, "" | "not_sure">>).map(
                  (bracket) => {
                    const isSelected = selectedAmount === bracket;
                    return (
                      <button
                        key={bracket}
                        type="button"
                        onClick={() =>
                          setSelectedAmount(isSelected ? "" : bracket)
                        }
                        className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-150 select-none flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50/40"
                        }`}
                        aria-pressed={isSelected}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isSelected ? "bg-white" : "bg-slate-300"
                          }`}
                        />
                        {t.amountOptions[bracket]}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Time Elapsed Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-teal-600" />
                {t.path1.timeLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {(["under_2hrs", "today", "over_24hrs"] as Array<Exclude<TimeElapsed, "">>).map(
                  (time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() =>
                          setSelectedTime(isSelected ? "" : time)
                        }
                        className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-150 select-none flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50/40"
                        }`}
                        aria-pressed={isSelected}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isSelected ? "bg-white" : "bg-slate-300"
                          }`}
                        />
                        {t.timeOptions[time]}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Validation Warning if completely empty */}
          {showError && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-amber-700 shrink-0" />
              <span>{t.path1.validationWarning}</span>
            </div>
          )}

          {/* Primary CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full min-h-[50px] sm:min-h-[54px] rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-semibold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-md shadow-teal-900/10 transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-teal-500/25 active:scale-[0.99] touch-manipulation"
            >
              <span>{t.path1.ctaButton}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              {t.path1.ctaSubtext}
            </p>
          </div>
        </form>
      </section>

      {/* Subtle Divider */}
      <div className="relative my-8 sm:my-10 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative bg-calm-bg px-4">
          <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {t.dividerText}
          </span>
        </div>
      </div>

      {/* PATH 2: Secondary Guided Option Cards */}
      <section>
        <div className="mb-4 text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-bold text-calm-heading">
            {t.path2.sectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-calm-muted">
            {t.path2.sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {guidedScenarios.map((item, index) => {
            const scenario = t.path2.scenarios[item.category];
            const isLastOdd =
              index === guidedScenarios.length - 1 &&
              guidedScenarios.length % 2 !== 0;

            return (
              <button
                key={item.category}
                type="button"
                onClick={() => handleGuidedOptionSelect(item.category)}
                className={`group relative text-left p-4 sm:p-5 rounded-2xl bg-white border border-calm-border/90 shadow-soft hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-teal-500/20 min-h-[88px] flex items-start gap-3.5 touch-manipulation ${
                  isLastOdd ? "sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full" : ""
                }`}
              >
                {/* Icon box */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${item.colorClasses}`}
                >
                  {item.icon}
                </div>

                {/* Card Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="text-sm sm:text-base font-bold text-calm-heading group-hover:text-teal-800 transition-colors">
                      {scenario.title}
                    </h3>
                    <span className="hidden sm:inline-block shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {scenario.badge}
                    </span>
                  </div>
                  <p className="text-xs text-calm-muted leading-relaxed line-clamp-2">
                    {scenario.description}
                  </p>
                </div>

                {/* Right Arrow chevron */}
                <div className="self-center pl-1 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Emergency Helpline Reminder Footer */}
      <footer className="mt-12 pt-6 border-t border-slate-200/80 text-center">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-600">
          <span>{t.footer.helplineText}</span>
          <a
            href="tel:1930"
            className="inline-flex items-center gap-1 font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full hover:bg-teal-100 transition-colors"
          >
            <span>📞</span>
            <span>{t.footer.helplineNumber}</span>
          </a>
        </div>
        <p className="text-[11px] text-slate-600 mt-2 max-w-md mx-auto">
          {t.footer.disclaimer}
        </p>
      </footer>
    </div>
  );
};
