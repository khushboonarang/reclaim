# Reclaim (रिकलेम) — Your Calm Post-Fraud Co-Pilot

> **A mobile-first, bilingual (English & Hindi) AI post-fraud co-pilot designed to guide cyber-fraud victims through emergency containment, statutory bank disputes, and police filings with low cognitive load and zero panic.**

🔗 **Live Public Demo**: [https://reclaim-india.vercel.app](https://reclaim-india.vercel.app)  
🛡️ **Privacy Architecture**: 100% On-Device (`localStorage`) • Zero External Database • Zero Tracking

---

## 📌 Executive Summary

Every year, millions of Indian citizens fall prey to rapidly evolving cyber fraud—from unauthorized UPI debits and courier phishing to coercion-driven **Digital Arrests** and Telegram investment scams. 

In the crucial **"Golden Hour"** (the first 2 to 24 hours), victims are in acute psychological shock. Instead of clear, calming guidance, they are confronted with bureaucratic hurdles, fragmented helplines, dismissive local desks, and arcane banking jargon (*UTR Numbers*, *Lien Holds*, *Zero FIRs*, *PNO Escalations*).

**Reclaim** is built as a trauma-informed, privacy-first progressive web application (PWA) that acts as an emergency post-fraud co-pilot. It transforms confusing regulatory and legal requirements into clear, step-by-step containment and recovery actions.

---

## 🚨 The Problem: Golden Hour Friction & Regulatory Gaps

1. **The Golden Hour Window**: Stolen funds are rapidly bounced across multi-tier "mule" bank accounts. Calling **1930** or dispatching an electronic alert via the **Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS)** within the first 2 hours yields the highest probability of freezing funds before cashout.
2. **Cognitive Overload & Panic**: Panicked victims frequently download unverified third-party "recovery" apps, fall victim to secondary scams, or fail to collect essential forensic evidence (like 12-digit UTR numbers).
3. **RBI Zero/Limited Customer Liability Friction**: RBI Circular `DBR.No.Leg.BC.78/09.07.005/2017-18` grants zero or limited customer liability if unauthorized electronic transactions are reported within **3 business days**. Most victims are unaware of this timeline or do not know the exact legal wording needed to invoke it.
4. **Jurisdictional Bouncing (The "Thana" Problem)**: Victims visiting local police stations are routinely turned away with claims of "lack of territorial jurisdiction," despite Ministry of Home Affairs (MHA) mandates requiring the registration of **Zero FIRs** for cyber offences.

---

## ✨ Key Product Features & Thoughtful Design Decisions

### 1. Trauma-Informed, Anti-Panic UX
- **No Ticking Countdown Timers**: Standard emergency apps use flashing red timers and loud banners that spike cortisol and induce irrational decisions. Reclaim uses a soft neutral editorial palette (`#fafaf8`), high-contrast dark slate typography, and calming teal accents (`#0f766e`) to foster focus and clarity.
- **Supportive, Empathetic Voice**: Non-judgmental language that immediately reassures the user: *"Take a deep breath. Let's figure out your next step together."*

### 2. Dual-Path Onboarding (Screen 1)
- **Path 1 (Empathetic Free-Text Intake)**: Victims can describe what happened in their own words, augmented by quick optional pills for **Approximate Loss Amount** (`Under ₹20 Lakh` vs `₹20 Lakh or more`) and **Time Elapsed** (`Just now / Under 2 hrs`, `Earlier today`, `More than 24 hrs ago`).
- **Path 2 (Guided Scenario Cards)**: 5 instant one-tap scenarios covering:
  1. *UPI / Bank Transfer Fraud* (unauthorized debit, fake QR, wrong link)
  2. *Digital Arrest / Fake Authority Call* (police, CBI, customs impersonation)
  3. *Investment / Part-Time Task Scam* (Telegram reviews, fake crypto trading apps)
  4. *Phishing Link / OTP Shared* (clicked link or shared code, money not yet lost)
  5. *Social Media / Account Hijacked* (WhatsApp, Instagram, email compromised)

### 3. Intelligent Triage & ₹20 Lakh Smart Routing
The app dynamically triages the incident without requiring external server calls:
- **Golden Hour Window Detection**: If the incident occurred within 2 hours, an **Immediate Action Priority** containment protocol is activated.
- **₹20 Lakh+ High-Value Track**: In India, cyber fraud exceeding ₹20 Lakh falls under specialized jurisdiction. Reclaim automatically routes police complaints to the **District Cyber Crime Police Station (CCPS) / Economic Offences Wing (EOW)** and banking escalation directly to the **Principal Nodal Officer (PNO)** for Section 102 CrPC / Section 106 BNSS account freezes.
- **Standard Track (< ₹20 Lakh)**: Routes to **1930 National Helpline**, **NCRP Portal (cybercrime.gov.in)**, **Local Police / Zero FIR**, and the **Bank Nodal Officer**.
- **Near-Miss / Preventive Track**: If a phishing link or OTP was compromised but no funds were debited, the user is routed to an immediate **Digital Hygiene & Containment Checklist** so they are spared unnecessary police/court procedures.

### 4. 4W Precision Engine + Interactive Checklist
Every action step is structured using the **4W Framework** (collapsible and scannable on mobile):
- **WHAT**: Concrete, unambiguous action to take.
- **WHEN**: Realistic timeframe (e.g., *"Immediately within 2 to 24 hours"*).
- **WHERE**: Authority desk with direct dial (`tel:1930`) and portal links (`cybercrime.gov.in`, `cms.rbi.org.in`).
- **HOW**: Numbered step-by-step guidance + a **Procedure Brief** containing:
  - 💬 **Verbatim Script**: Exactly what to say to the bank manager or police officer.
  - 📋 **Documents Needed**: Checklists for statements, identity cards, UTR proofs.
  - ✨ **What Happens Next**: Demystification of back-office inter-bank procedures.
- **Progress Tracking**: Every checkbox state is preserved locally, displaying a live progress bar.

### 5. Zero-Jargon Layer (2-Line Plain-Language Popovers)
Key technical terms feature subtle dotted underlines. Tapping any term opens an accessible 2-line popover/bottom-sheet explaining:
1. Simple everyday meaning (no legalese).
2. Practical tip on where to find it or what happens next.
- *Covered terms*: **UTR Number**, **Lien (Hold)**, **Chargeback**, **Zero FIR / NCR**, **Nodal Officer**, **Principal Nodal Officer (PNO)**, **EOW / CCPS**, and **CIBIL Freeze**.

### 6. Auto-Generated Copy-Paste Complaint Draft Generator
Pre-filled formal petitions formatted to statutory RBI and IT Act standards:
- **Bank Dispute & Lien Request Email**: Formal notice addressed to the Branch Manager / PNO citing RBI Circular 2017-18 for zero customer liability and requesting CFCFRMS inter-bank lien marking.
- **Police / Cyber Cell Complaint Letter**: Formal complaint addressed to the SHO / CCPS / EOW invoking **Section 66D IT Act** and **Section 102 CrPC / 106 BNSS** for account seizure.
- **Interactive Inline Editor**: Users can tweak their name, amount, UTR number, and scammer details directly inside the draft before copying or downloading as `.txt` / printing.

### 7. Offline-Friendly "Bank & Thana Visit Mode" (Pocket Counter Card)
A high-contrast card designed for victims standing at a noisy physical counter:
- **What to Carry (4-Item Document Checklist)**: ID proof, stamped statement, UTR receipt, and 2 printed complaint copies.
- **3-Line Authoritative Counter Script**: High-contrast cue cards with the exact 3 sentences to speak firmly at the counter to secure a signed receiving copy and prevent jurisdictional deflection.
- **Print Friendly**: One-touch print/save format for pocket reference.

### 8. Full Bilingual Synchronization (English & हिंदी)
- Immediate, reactive language toggle (`English` | `हिंदी`) in the header that translates all headers, 4W instructions, jargon explainers, drafts, and counter cards into natural, respectful Hindi.

### 9. Privacy-by-Design Architecture
- **Zero External Database**: No personal identity numbers, bank accounts, or financial figures leave the victim's device.
- All session state and checklist progress are stored strictly in browser `localStorage` (`reclaim_incident_session_v1`, `reclaim_checklist_progress_v1`).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Client Hydration)
- **Library**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type safety)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom calm color tokens, dynamic `100dvh` viewport safe-areas)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PWA**: Standalone Web App Manifest (`manifest.json`), Apple touch icons, responsive viewport configuration
- **Hosting**: [Vercel](https://vercel.com/) (Edge CDN, SSL)

---

## 💻 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.17+ or v20+ recommended)
- `npm` or `pnpm`

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/khushboonarang/reclaim.git
   cd reclaim
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📱 Cross-Device & Mobile-First Compatibility

| Device Profile | Screen Width | Optimization |
| :--- | :--- | :--- |
| **Small Mobile** | 360px – 390px | Min 44px touch targets, compact headers, single-column 4W flow |
| **iPhones / Modern Android** | 390px – 430px | `100dvh` protection against bottom-bar bugs, safe-area inset padding |
| **Tablets / iPads** | 768px – 1024px | 2-column scenario cards, side-by-side 4W metadata, balanced margins |
| **Desktop / Laptops** | 1200px – 1440px+ | Centered reading view (`max-w-4xl`), enhanced editorial typography |

---

## 📄 License & Public Service Notice

This project is open-source under the [MIT License](LICENSE). 

*Disclaimer: Reclaim is an emergency guidance and decision-support co-pilot. It does not provide paid legal representation or store personal credentials. Always report ongoing cyber emergencies directly to the National Cyber Crime Helpline at **1930** or [cybercrime.gov.in](https://cybercrime.gov.in).*
