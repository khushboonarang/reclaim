export type Language = "en" | "hi";

export type AmountBracket = "under_20l" | "above_20l" | "not_sure" | "";

export type TimeElapsed = "under_2hrs" | "today" | "over_24hrs" | "";

export type FraudCategory =
  | "upi_bank_transfer"
  | "digital_arrest"
  | "investment_task"
  | "phishing_otp"
  | "social_account_hacked"
  | "other";

export interface IncidentData {
  pathType: "free_text" | "guided_option";
  incidentText: string;
  selectedCategory: FraudCategory | null;
  amountBracket: AmountBracket;
  timeElapsed: TimeElapsed;
  capturedAt: string;
}

export interface ScenarioOption {
  id: FraudCategory;
  iconName: "CreditCard" | "ShieldAlert" | "TrendingUp" | "KeyRound" | "UserX";
  titleKey: string;
  descKey: string;
  tagKey: string;
}
