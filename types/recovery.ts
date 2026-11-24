import { AmountBracket, FraudCategory, Language, TimeElapsed } from "./incident";

export type JargonTermKey =
  | "utr_number"
  | "lien_hold"
  | "chargeback"
  | "zero_fir_ncr"
  | "nodal_officer"
  | "principal_nodal_officer"
  | "eow_ccps"
  | "cibil_freeze";

export interface JargonDefinition {
  term: string;
  meaning: string; // 1-2 sentence everyday plain-language meaning
  whereToFind: string; // Where to find it / What happens next
}

export interface FourWProcedureBrief {
  whatToSayOrWrite: string;
  documentsNeeded: string[];
  whatHappensNext: string;
}

export interface FourWActionItem {
  id: string;
  title: string;
  what: string;
  when: string;
  where: string;
  whereContact?: string;
  whereUrl?: string;
  howSteps: string[];
  procedureBrief: FourWProcedureBrief;
  applicableTracks: Array<"all" | "high_value" | "standard" | "near_miss">;
  categories?: FraudCategory[];
}

export interface RecoveryPhase {
  number: number;
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  iconName: "ShieldAlert" | "FolderLock" | "FileCheck" | "Scale" | "CheckCircle2";
  items: FourWActionItem[];
}

export interface TriageResult {
  category: FraudCategory;
  track: "high_value" | "standard" | "near_miss";
  isGoldenHour: boolean; // under 2 hours
  bannerTitle: string;
  bannerDescription: string;
  badgeText: string;
  routedPoliceAuthority: string;
  routedBankAuthority: string;
  primaryHelpline: string;
}
