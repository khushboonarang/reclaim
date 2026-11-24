"use client";

import { useState, useEffect, useCallback } from "react";
import { AmountBracket, FraudCategory, IncidentData, Language, TimeElapsed } from "@/types/incident";

const STORAGE_KEY_INCIDENT = "reclaim_incident_session_v1";
const STORAGE_KEY_LANG = "reclaim_language_pref";

export function useIncidentSession() {
  const [lang, setLangState] = useState<Language>("en");
  const [incident, setIncident] = useState<IncidentData | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state from localStorage on mount (Privacy by design: browser local only)
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY_LANG) as Language | null;
      if (savedLang === "en" || savedLang === "hi") {
        setLangState(savedLang);
      } else {
        // Detect browser language if available
        const navLang = navigator.language.toLowerCase();
        if (navLang.startsWith("hi")) {
          setLangState("hi");
        }
      }

      const savedIncident = localStorage.getItem(STORAGE_KEY_INCIDENT);
      if (savedIncident) {
        const parsed = JSON.parse(savedIncident) as IncidentData;
        setIncident(parsed);
      }
    } catch (e) {
      console.warn("Storage access restricted or unavailable:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Update language
  const setLanguage = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, newLang);
      document.documentElement.lang = newLang;
    } catch (e) {
      console.warn("Failed to persist language:", e);
    }
  }, []);

  // Save captured incident to localStorage
  const captureIncident = useCallback(
    (data: Omit<IncidentData, "capturedAt">) => {
      const fullIncident: IncidentData = {
        ...data,
        capturedAt: new Date().toISOString(),
      };
      setIncident(fullIncident);
      try {
        localStorage.setItem(STORAGE_KEY_INCIDENT, JSON.stringify(fullIncident));
      } catch (e) {
        console.warn("Failed to save incident locally:", e);
      }
    },
    []
  );

  // Clear / Reset
  const resetIncident = useCallback(() => {
    setIncident(null);
    try {
      localStorage.removeItem(STORAGE_KEY_INCIDENT);
    } catch (e) {
      console.warn("Failed to remove incident from local storage:", e);
    }
  }, []);

  return {
    lang,
    setLanguage,
    incident,
    captureIncident,
    resetIncident,
    isHydrated,
  };
}
