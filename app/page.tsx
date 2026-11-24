"use client";

import React, { useState } from "react";
import { useIncidentSession } from "@/hooks/useIncidentSession";
import { Header } from "@/components/Header";
import { DualPathOnboarding } from "@/components/DualPathOnboarding";
import { CapturedStateVerification } from "@/components/CapturedStateVerification";

export default function Home() {
  const {
    lang,
    setLanguage,
    incident,
    captureIncident,
    resetIncident,
    isHydrated,
  } = useIncidentSession();

  // If user chooses to edit, temporarily set editingMode to true to return to form
  const [isEditing, setIsEditing] = useState(false);

  const handleCapture = (data: Parameters<typeof captureIncident>[0]) => {
    captureIncident(data);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleReset = () => {
    resetIncident();
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-calm-bg text-calm-text flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Reclaim Calm Navigation Bar with New Case Reset Button */}
      <Header
        lang={lang}
        onLanguageChange={setLanguage}
        hasActiveIncident={!!incident && !isEditing}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start pb-12 sm:pb-16">
        {!isHydrated ? (
          // Elegant subtle loading skeleton for hydration
          <div className="w-full max-w-3xl mx-auto px-4 py-16 animate-pulse space-y-6">
            <div className="h-8 bg-slate-200/60 rounded-full w-48 mx-auto" />
            <div className="h-10 bg-slate-200/60 rounded-xl w-3/4 mx-auto" />
            <div className="h-4 bg-slate-200/40 rounded w-1/2 mx-auto" />
            <div className="h-64 bg-slate-200/30 rounded-2xl w-full mt-8" />
          </div>
        ) : incident && !isEditing ? (
          /* Transition Screen: Verification & Module 2 & 3 Recovery Engine */
          <CapturedStateVerification
            lang={lang}
            incident={incident}
            onEdit={handleEdit}
            onReset={handleReset}
          />
        ) : (
          /* Screen 1: Dual-Path Onboarding */
          <DualPathOnboarding
            lang={lang}
            onCaptureIncident={handleCapture}
          />
        )}
      </main>
    </div>
  );
}
