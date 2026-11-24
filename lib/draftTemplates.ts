import { IncidentData, Language } from "@/types/incident";
import { TriageResult } from "@/types/recovery";

export interface DraftFieldValues {
  victimName: string;
  accountNumber: string;
  bankName: string;
  disputedAmount: string;
  utrNumber: string;
  transactionDateTime: string;
  beneficiaryDetails: string;
  ncrpNumber: string;
  policeStationName: string;
  contactPhone: string;
}

export function getDefaultDraftFields(
  incident: IncidentData,
  triage: TriageResult
): DraftFieldValues {
  // Extract amount if user typed digits in incident text, or format based on bracket
  let initialAmount = "";
  const amountMatch = incident.incidentText.match(/(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)/i);
  if (amountMatch && amountMatch[1] && amountMatch[1].replace(/,/g, "").length >= 3) {
    initialAmount = amountMatch[1];
  } else if (incident.amountBracket === "above_20l") {
    initialAmount = "25,00,000";
  } else if (incident.amountBracket === "under_20l") {
    initialAmount = "35,000";
  }

  // Format date time
  const now = new Date(incident.capturedAt || Date.now());
  const dateFormatted = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeFormatted = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    victimName: "[Your Full Legal Name]",
    accountNumber: "[Your 11-16 Digit Bank Account Number]",
    bankName: "[Your Bank Name, e.g. SBI / HDFC / ICICI]",
    disputedAmount: initialAmount || "[Exact Amount Debited, e.g. ₹48,500]",
    utrNumber: "[12-Digit UTR Number from SMS/Statement]",
    transactionDateTime: `${dateFormatted} at ${timeFormatted}`,
    beneficiaryDetails: "[Scammer UPI ID / Account Number / VPA]",
    ncrpNumber: "[14-Digit NCRP Acknowledgement ID from 1930]",
    policeStationName:
      triage.track === "high_value"
        ? "District Cyber Crime Police Station / Economic Offences Wing (EOW)"
        : "Cyber Crime Police Station / Local Police Station",
    contactPhone: "[Your Registered Mobile Number]",
  };
}

export function generateBankDisputeEmail(
  incident: IncidentData,
  triage: TriageResult,
  fields: DraftFieldValues,
  lang: Language
): { subject: string; body: string } {
  const isEn = lang === "en";
  const isHighValue = triage.track === "high_value";

  if (isEn) {
    const recipientAuthority = isHighValue
      ? "To,\nThe Principal Nodal Officer (PNO) & Chief Grievance Officer,\nFraud Risk Management (FRM) Cell,\n[Bank Name Head Office / Zonal Office]"
      : "To,\nThe Branch Manager / Nodal Officer (Grievance Redressal),\n[Branch Name],\n[Bank Name]";

    const subject = `URGENT: Unauthorized Cyber Fraud Debit of ₹${fields.disputedAmount} — Immediate Inter-Bank Lien & Dispute Request | A/c No: ${fields.accountNumber}`;

    const body = `${recipientAuthority}

Dear Sir/Madam,

SUB: INTIMATION OF UNAUTHORIZED ELECTRONIC BANKING TRANSACTION UNDER RBI CIRCULAR DBR.No.Leg.BC.78/09.07.005/2017-18 & REQUEST FOR IMMEDIATE INTER-BANK LIEN (FREEZE)

I am an account holder maintaining Account No: ${fields.accountNumber} with your branch. I am writing to immediately report an unauthorized electronic fraud debit that occurred on ${fields.transactionDateTime} without my lawful authorization.

1. TRANSACTION & INCIDENT PARTICULARS:
• Account Holder Name: ${fields.victimName}
• Account Number: ${fields.accountNumber}
• Disputed Amount Debited: ₹${fields.disputedAmount}
• Unique Transaction Reference (UTR) Number: ${fields.utrNumber}
• Date & Time of Debit: ${fields.transactionDateTime}
• Recipient / Beneficiary Details: ${fields.beneficiaryDetails}
• Incident Summary: ${incident.incidentText}
• National Cyber Crime (NCRP / 1930) Acknowledgement No: ${fields.ncrpNumber}

2. STATUTORY COMPLIANCE & LEGAL GROUNDS:
I have reported this unauthorized fraudulent debit within 3 business days of occurrence in strict adherence to RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18 (Customer Protection – Limiting Liability of Customers in Unauthorized Electronic Banking Transactions).

${
  isHighValue
    ? "As this incident involves a high-value financial loss of ₹20 Lakhs or above, I am escalating this petition directly to the Principal Nodal Officer (PNO) and FRM Desk for urgent multi-tier inter-bank tracing and immediate coordination with NPCI/beneficiary banks."
    : "I request immediate entry of this dispute onto the National Automated Clearing House / NPCI electronic chargeback and dispute network."
}

3. SPECIFIC ACTIONS REQUESTED:
i. Immediately mark an electronic alert on the Citizen Financial Cyber Fraud Reporting System (CFCFRMS) to place a LIEN (FREEZE) on the beneficiary account at the recipient bank.
ii. Hotlist/block the compromised payment instruments to prevent secondary debits.
iii. Provide me with an official Bank Dispute / Token Number and a formal written acknowledgment seal.
iv. Restore shadow credit / reverse the disputed debit under RBI limited customer liability guidelines.

Kindly treat this on highest priority.

Yours faithfully,

${fields.victimName}
Contact Phone: ${fields.contactPhone}
Date: ${new Date().toLocaleDateString("en-IN")}`;

    return { subject, body };
  } else {
    // Hindi Version
    const recipientAuthority = isHighValue
      ? "सेवा में,\nप्रधान नोडल अधिकारी (PNO) एवं मुख्य शिकायत निवारण अधिकारी,\nफ्रॉड रिस्क मैनेजमेंट (FRM) सेल,\n[बैंक का नाम - प्रधान कार्यालय]"
      : "सेवा में,\nशाखा प्रबंधक / नोडल अधिकारी (शिकायत निवारण),\n[शाखा का नाम],\n[बैंक का नाम]";

    const subject = `अति आवश्यक: ₹${fields.disputedAmount} के अनधिकृत साइबर फ्रॉड की सूचना एवं धोखेबाज के खाते पर तत्काल लीन लगाने हेतु | खाता संख्या: ${fields.accountNumber}`;

    const body = `${recipientAuthority}

महोदय/महोदया,

विषय: RBI सर्कुलर DBR.No.Leg.BC.78/09.07.005/2017-18 के तहत अनधिकृत इलेक्ट्रॉनिक लेनदेन की सूचना एवं लाभार्थी खाते पर तत्काल लीन लगाने की मांग।

मेरा आपके बैंक की शाखा में बचत/चालू खाता संख्या ${fields.accountNumber} है। मैं अत्यंत विनम्रतापूर्वक सूचित करता हूँ कि दिनांक ${fields.transactionDateTime} को मेरे खाते से ₹${fields.disputedAmount} का अनधिकृत साइबर धोखाधड़ी लेन-देन हुआ है।

1. घटना एवं लेन-देन का विवरण:
• खाताधारक का नाम: ${fields.victimName}
• बैंक खाता संख्या: ${fields.accountNumber}
• अनधिकृत डेबिट राशि: ₹${fields.disputedAmount}
• लेनदेन संदर्भ संख्या (UTR नंबर): ${fields.utrNumber}
• लेनदेन का दिनांक व समय: ${fields.transactionDateTime}
• लाभार्थी / धोखेबाज का विवरण: ${fields.beneficiaryDetails}
• घटना का संक्षिप्त विवरण: ${incident.incidentText}
• राष्ट्रीय साइबर क्राइम पोर्टल (1930 / NCRP) पावती संख्या: ${fields.ncrpNumber}

2. विधिक आधार एवं RBI दिशानिर्देश:
मैंने घटना के 3 कार्यदिवसों के भीतर बैंक को लिखित सूचना देकर RBI के सर्कुलर DBR.No.Leg.BC.78/09.07.005/2017-18 (शून्य ग्राहक देयता नियम) का पूर्ण पालन किया है।

${
  isHighValue
    ? "चूंकि यह मामला ₹20 लाख या उससे अधिक के उच्च-मूल्य साइबर अपराध का है, अतः मैं इसे सीधे प्रधान नोडल अधिकारी (PNO) व साइबर फ्रॉड सेल को अंतर-बैंक समन्वयन व त्वरित लीन लगाने हेतु प्रेषित कर रहा हूँ।"
    : "अतः बैंक से अनुरोध है कि तत्काल NPCI और लाभार्थी बैंक के साथ विवाद दर्ज कर कानूनी कार्रवाई शुरू करें।"
}

3. आपसे अपेक्षित त्वरित कार्रवाई:
i. 1930 / CFCFRMS नेटवर्क के माध्यम से लाभार्थी बैंक को तत्काल अलर्ट भेजकर धोखेबाज के खाते पर लीन (फ्रीज) लगवाया जाए।
ii. प्रभावित पेमेंट माध्यम (कार्ड/UPI) को स्थायी रूप से सुरक्षित/हॉटलिस्ट किया जाए।
iii. इस शिकायत का आधिकारिक बैंक कंप्लेंट टोकन नंबर व मुहरयुक्त पावती पर्ची दी जाए।
iv. RBI नियमों के अनुसार अनधिकृत डेबिट राशि की सुरक्षित वापसी की प्रक्रिया प्रारंभ की जाए।

धन्यवाद।

भवदीय,
${fields.victimName}
मोबाइल नंबर: ${fields.contactPhone}
दिनांक: ${new Date().toLocaleDateString("en-IN")}`;

    return { subject, body };
  }
}

export function generatePoliceComplaintLetter(
  incident: IncidentData,
  triage: TriageResult,
  fields: DraftFieldValues,
  lang: Language
): { subject: string; body: string } {
  const isEn = lang === "en";
  const isHighValue = triage.track === "high_value";

  if (isEn) {
    const authorityTitle = isHighValue
      ? "To,\nThe Superintendent of Police / Assistant Commissioner of Police,\nDistrict Cyber Crime Police Station (CCPS) / Economic Offences Wing (EOW),\n[District / City Police Headquarters]"
      : `To,\nThe Station House Officer (SHO) / Cyber Crime Helpdesk,\n${fields.policeStationName},\n[City / District]`;

    const subject = `COMPLAINT: Cyber Financial Fraud of ₹${fields.disputedAmount} under Section 66D Information Technology Act & Relevant Sections of BNS / IPC`;

    const body = `${authorityTitle}

Respected Officer,

I, ${fields.victimName}, resident of [Your Residential Address], holding Mobile Number: ${fields.contactPhone}, wish to lodge a formal complaint regarding an organized cyber fraud committed against me resulting in a financial loss of ₹${fields.disputedAmount}.

1. CHRONOLOGY OF THE INCIDENT:
On ${fields.transactionDateTime}, I was approached/manipulated by unknown cyber criminals under the pretext of ${incident.incidentText}.

2. FINANCIAL & FORENSIC TRAIL:
• Total Amount Defrauded: ₹${fields.disputedAmount}
• Debited Bank: ${fields.bankName} | Account No: ${fields.accountNumber}
• Unique Transaction Reference (UTR) No: ${fields.utrNumber}
• Scammer / Beneficiary Account / UPI: ${fields.beneficiaryDetails}
• Scammer Phone Number(s) / Social Handles: [Insert Scammer Phone/Telegram Handles]
• National Cyber Crime Portal (NCRP) Acknowledgement ID: ${fields.ncrpNumber}

3. JURISDICTION & HIGH-VALUE NOTICE:
${
  isHighValue
    ? "This matter constitutes a major organized economic offence exceeding ₹20 Lakhs. In accordance with state high-value crime protocols, I respectfully request this Hon'ble District CCPS / EOW to invoke Section 106 BNSS / Section 102 CrPC to freeze all tier-1 and tier-2 suspect beneficiary pool accounts."
    : "As cyber crimes carry no territorial boundary, I respectfully request the registration of a Zero FIR / NCR pursuant to Ministry of Home Affairs (MHA) guidelines."
}

4. PRAYER / RELIEF SOUGHT:
i. Register an FIR under Section 66D IT Act and sections 318(4) / 319(2) BNSS (Cheating by Impersonation).
ii. Issue immediate Section 102 CrPC / Section 106 BNSS notices to the recipient banks to freeze the stolen funds.
iii. Obtain Call Detail Records (CDR) and IP logs for the suspect numbers.
iv. Provide me with a certified, stamped copy of the FIR / NCR for bank claim processing.

I have attached copies of my stamped Bank Statement, NCRP Complaint Slip, UTR receipts, and chat screenshots.

Yours faithfully,

${fields.victimName}
Contact: ${fields.contactPhone}
Date: ${new Date().toLocaleDateString("en-IN")}`;

    return { subject, body };
  } else {
    // Hindi Version
    const authorityTitle = isHighValue
      ? "सेवा में,\nपुलिस अधीक्षक / सहायक पुलिस आयुक्त महोदय,\nजिला साइबर अपराध पुलिस थाना (CCPS) / आर्थिक अपराध शाखा (EOW),\n[जिला / शहर पुलिस मुख्यालय]"
      : `सेवा में,\nथाना प्रभारी महोदय / साइबर अपराध प्रकोष्ठ,\n${fields.policeStationName},\n[थाना क्षेत्र व जिला]`;

    const subject = `शिकायत प्रार्थना पत्र: ₹${fields.disputedAmount} की संगठित साइबर धोखाधड़ी के संबंध में (धारा 66D IT एक्ट एवं BNS / IPC की सुसंगत धाराओं के अंतर्गत)`;

    const body = `${authorityTitle}

महोदय,

सविनय निवेदन है कि मैं, ${fields.victimName}, निवासी [आपका पता], मोबाइल नंबर: ${fields.contactPhone}, साइबर अपराधियों द्वारा मेरे साथ की गई ₹${fields.disputedAmount} की गंभीर वित्तीय धोखाधड़ी के संबंध में यह प्राथमिकी दर्ज कराने हेतु प्रार्थना पत्र प्रस्तुत कर रहा हूँ।

1. घटना का क्रमवार विवरण:
दिनांक ${fields.transactionDateTime} को अज्ञात साइबर ठगों ने मुझे निम्नलिखित प्रकार से झांसे में लिया:
"${incident.incidentText}"

2. वित्तीय एवं तकनीकी साक्ष्य विवरण:
• कुल धोखाधड़ी राशि: ₹${fields.disputedAmount}
• पीड़ित का बैंक व खाता: ${fields.bankName} | खाता संख्या: ${fields.accountNumber}
• लेनदेन संदर्भ संख्या (UTR नंबर): ${fields.utrNumber}
• धोखेबाज का बैंक खाता / UPI आईडी: ${fields.beneficiaryDetails}
• धोखेबाज का मोबाइल नंबर / टेलीग्राम आईडी: [धोखेबाज का नंबर/आईडी यहाँ लिखें]
• राष्ट्रीय साइबर अपराध पोर्टल (NCRP/1930) पावती संख्या: ${fields.ncrpNumber}

3. विधिक क्षेत्राधिकार:
${
  isHighValue
    ? "चूंकि यह संगठित अपराध ₹20 लाख से अधिक की गंभीर वित्तीय धोखाधड़ी का है, अतः आपसे विनम्र निवेदन है कि धारा 106 BNSS / 102 CrPC के अंतर्गत लाभार्थी के सभी बैंक खातों को तत्काल सीज/फ्रीज करने का विधिक नोटिस बैंकों को जारी किया जाए।"
    : "गृह मंत्रालय के स्पष्ट निर्देशों के अनुसार साइबर अपराध में क्षेत्राधिकार का कोई बंधन नहीं है, अतः तत्काल जीरो FIR या NCR दर्ज करने की कृपा करें।"
}

4. प्रार्थना:
i. सूचना प्रौद्योगिकी अधिनियम की धारा 66D एवं BNS की सुसंगत धाराओं में तत्काल FIR दर्ज की जाए।
ii. संबंधित बैंकों को धारा 102 CrPC / 106 BNSS का नोटिस भेजकर चुराई गई राशि पर लीन (फ्रीज) लगाया जाए।
iii. धोखेबाज के मोबाइल नंबर की CDR एवं IPDR ट्रेस कराई जाए।
iv. मुझे बैंक में प्रस्तुत करने हेतु FIR / NCR की प्रमाणित प्रति निःशुल्क उपलब्ध कराई जाए।

संलग्नक: बैंक स्टेटमेंट, NCRP पावती पर्ची, UTR रसीदें, और चैट के स्क्रीनशॉट।

भवदीय,
${fields.victimName}
मोबाइल: ${fields.contactPhone}
दिनांक: ${new Date().toLocaleDateString("en-IN")}`;

    return { subject, body };
  }
}
