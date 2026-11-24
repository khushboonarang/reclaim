import { AmountBracket, FraudCategory, IncidentData, Language, TimeElapsed } from "@/types/incident";
import { FourWActionItem, RecoveryPhase, TriageResult } from "@/types/recovery";

/**
 * Intelligent Triage and Routing
 */
export function performTriage(
  incident: IncidentData,
  lang: Language
): TriageResult {
  const isEn = lang === "en";

  // 1. Detect Category
  let category: FraudCategory = incident.selectedCategory || "other";
  const lowerText = incident.incidentText.toLowerCase();

  if (!incident.selectedCategory || incident.selectedCategory === "other") {
    if (
      lowerText.includes("arrest") ||
      lowerText.includes("cbi") ||
      lowerText.includes("police") ||
      lowerText.includes("customs") ||
      lowerText.includes("fedex") ||
      lowerText.includes("अरेस्ट") ||
      lowerText.includes("पुलिस")
    ) {
      category = "digital_arrest";
    } else if (
      lowerText.includes("telegram") ||
      lowerText.includes("task") ||
      lowerText.includes("invest") ||
      lowerText.includes("trading") ||
      lowerText.includes("crypto") ||
      lowerText.includes("टास्क") ||
      lowerText.includes("निवेश")
    ) {
      category = "investment_task";
    } else if (
      lowerText.includes("otp") ||
      lowerText.includes("link") ||
      lowerText.includes("clicked") ||
      lowerText.includes("ओटीपी") ||
      lowerText.includes("लिंक")
    ) {
      category = "phishing_otp";
    } else if (
      lowerText.includes("whatsapp") ||
      lowerText.includes("instagram") ||
      lowerText.includes("hacked") ||
      lowerText.includes("हैक्")
    ) {
      category = "social_account_hacked";
    } else {
      category = "upi_bank_transfer";
    }
  }

  // 2. Detect Track based on ₹20 Lakh threshold & Near-miss condition
  const isNearMiss =
    (category === "phishing_otp" &&
      (incident.amountBracket === "not_sure" || !incident.amountBracket)) ||
    lowerText.includes("no money") ||
    lowerText.includes("not debited") ||
    lowerText.includes("पैसे नहीं कटे");

  const isHighValue = incident.amountBracket === "above_20l";

  const track: TriageResult["track"] = isNearMiss
    ? "near_miss"
    : isHighValue
    ? "high_value"
    : "standard";

  // 3. Time Urgency (Golden Hour under 2 hours)
  const isGoldenHour =
    incident.timeElapsed === "under_2hrs" ||
    lowerText.includes("mins") ||
    lowerText.includes("minutes") ||
    lowerText.includes("just now") ||
    lowerText.includes("अभी");

  // 4. Construct Banner & Routing Authorities
  if (track === "near_miss") {
    return {
      category,
      track,
      isGoldenHour: false,
      bannerTitle: isEn
        ? "Preventive Protection Protocol — Zero Direct Loss Detected"
        : "निवारक सुरक्षा प्रोटोकॉल — कोई प्रत्यक्ष वित्तीय नुकसान नहीं",
      bannerDescription: isEn
        ? "Because money has not left your account, the priority is immediate containment of devices, OTPs, and card access to prevent future exploitation."
        : "चूंकि आपके खाते से पैसे नहीं कटे हैं, इसलिए मुख्य प्राथमिकता कार्ड, डिवाइस और क्रेडेंशियल्स को तुरंत सुरक्षित करना है।",
      badgeText: isEn ? "Preventive Containment" : "निवारक सुरक्षा",
      routedPoliceAuthority: isEn
        ? "NCRP Portal Preventive Complaint"
        : "NCRP पोर्टल पर संदिग्ध लिंक शिकायत",
      routedBankAuthority: isEn
        ? "Bank Card/NetBanking Hotlisting Desk"
        : "बैंक कार्ड/नेटबैंकिंग ब्लॉक शाखा",
      primaryHelpline: "1930",
    };
  }

  if (track === "high_value") {
    return {
      category,
      track,
      isGoldenHour,
      bannerTitle: isEn
        ? isGoldenHour
          ? "Immediate Action Priority + High-Value Track (₹20L+ Jurisdiction)"
          : "High-Value Priority Track (₹20 Lakh+ Jurisdiction Activated)"
        : isGoldenHour
        ? "तत्काल कार्रवाई प्राथमिकता + उच्च-मूल्य ट्रैक (₹20 लाख+ क्षेत्राधिकार)"
        : "उच्च-मूल्य प्राथमिकता ट्रैक (₹20 लाख+ क्षेत्राधिकार सक्रिय)",
      bannerDescription: isEn
        ? isGoldenHour
          ? "Immediate Action Priority: Reporting right now maximizes the chance of freezing the transferred funds across multi-tier accounts."
          : "Cases involving ₹20 Lakh or more are routed to specialized Economic Offences Wings and Bank Principal Nodal Officers for coordinated multi-bank lien freezing."
        : isGoldenHour
          ? "तत्काल कार्रवाई प्राथमिकता: अभी तुरंत रिपोर्ट करने से विभिन्न बैंक स्तरों पर ट्रांसफर किए गए फंड को फ्रीज करने की संभावना सबसे अधिक होती है।"
          : "₹20 लाख या उससे अधिक के मामलों को त्वरित लीन (फ्रीज) और अंतर-बैंक समन्वय के लिए सीधे आर्थिक अपराध शाखा (EOW) और प्रधान नोडल अधिकारी (PNO) को भेजा जाता है।",
      badgeText: isEn
        ? "High-Value Protocol (₹20L+ Jurisdiction)"
        : "उच्च-मूल्य प्रोटोकॉल (₹20 लाख+ क्षेत्राधिकार)",
      routedPoliceAuthority: isEn
        ? "District Cyber Crime Police Station (CCPS) / Economic Offences Wing (EOW)"
        : "जिला साइबर क्राइम पुलिस स्टेशन (CCPS) / आर्थिक अपराध शाखा (EOW)",
      routedBankAuthority: isEn
        ? "Principal Nodal Officer (PNO) & Fraud Risk Management (FRM)"
        : "प्रधान नोडल अधिकारी (PNO) एवं फ्रॉड रिस्क टीम",
      primaryHelpline: "1930",
    };
  }

  // Standard Track (< ₹20 Lakh)
  return {
    category,
    track,
    isGoldenHour,
    bannerTitle: isEn
      ? isGoldenHour
        ? "Immediate Action Priority: Golden Hour Window Active"
        : "Standard Cyber Fraud Recovery Track Active"
      : isGoldenHour
      ? "तत्काल कार्रवाई प्राथमिकता: गोल्डन ऑवर विंडो सक्रिय"
      : "मानक साइबर धोखाधड़ी समाधान ट्रैक सक्रिय",
    bannerDescription: isEn
      ? isGoldenHour
        ? "Immediate Action Priority: Reporting right now maximizes the chance of freezing the transferred funds before cashout."
        : "Follow these 5 structured containment and recovery steps to place a lien on suspect accounts and initiate dispute filing."
      : isGoldenHour
        ? "तत्काल कार्रवाई प्राथमिकता: अभी तुरंत रिपोर्ट करने से धोखेबाज द्वारा पैसे निकालने से पहले खाते को फ्रीज (Lien) करने की संभावना सबसे अधिक है।"
        : "धोखेबाज के खाते पर लीन (रोक) लगाने और बैंक विवाद दर्ज कराने के लिए इन 5 चरणों का पालन करें।",
    badgeText: isEn ? "Standard Track (< ₹20 Lakh)" : "मानक ट्रैक (< ₹20 लाख)",
    routedPoliceAuthority: isEn
      ? "Local Cyber Crime Police Cell & NCRP Portal"
      : "स्थानीय साइबर सेल व NCRP पोर्टल",
    routedBankAuthority: isEn
      ? "Bank Nodal Officer & Dispute Desk"
      : "बैंक नोडल अधिकारी एवं विवाद निवारण डेस्क",
    primaryHelpline: "1930",
  };
}

/**
 * Generate 5 Conditional Recovery Phases + 4W Precision Engine
 */
export function generateRecoveryPhases(
  incident: IncidentData,
  triage: TriageResult,
  lang: Language
): RecoveryPhase[] {
  const isEn = lang === "en";
  const isHighValue = triage.track === "high_value";
  const isNearMiss = triage.track === "near_miss";

  // --- PHASE 1: Immediate Containment ---
  const phase1Items: FourWActionItem[] = [
    {
      id: "p1_call_1930",
      title: isEn
        ? "Dial 1930 Cyber Fraud Helpline (or file on cybercrime.gov.in)"
        : "1930 साइबर हेल्पलाइन पर कॉल करें (या cybercrime.gov.in पर दर्ज करें)",
      what: isEn
        ? "Report the financial fraud immediately to trigger Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS)."
        : "नागरिक वित्तीय धोखाधड़ी प्रबंधन प्रणाली (CFCFRMS) के जरिए धोखेबाज के बैंक खाते को तत्काल ब्लॉक कराने के लिए 1930 पर कॉल करें।",
      when: isEn
        ? "Immediately (within the first 2 to 24 hours of incident)"
        : "तुरंत (घटना के पहले 2 से 24 घंटों के भीतर)",
      where: isEn
        ? "Helpline: 1930 (National Cyber Crime Reporting Portal - MHA)"
        : "हेल्पलाइन: 1930 (गृह मंत्रालय, भारत सरकार)",
      whereContact: "1930",
      whereUrl: "https://cybercrime.gov.in",
      howSteps: isEn
        ? [
            "Dial 1930 from your registered mobile number.",
            "State clearly: 'I am calling to report an unauthorized financial cyber fraud and request a freeze on the recipient account.'",
            "Provide the operator with your bank name, account number, debit time, and recipient UPI ID/account.",
            "Save the 14-digit Complaint Acknowledgement Number sent to you via SMS immediately.",
          ]
        : [
            "अपने पंजीकृत मोबाइल नंबर से 1930 डायल करें।",
            "ऑपरेटर से कहें: 'मेरे खाते से अनधिकृत साइबर धोखाधड़ी हुई है, कृपया लाभार्थी खाते पर तत्काल फ्रीज लगाएं।'",
            "ऑपरेटर को अपना बैंक, खाता संख्या, डेबिट का सही समय और धोखेबाज का UPI ID या खाता बताएं।",
            "SMS द्वारा प्राप्त 14 अंकों का शिकायत पावती नंबर (Acknowledgement Number) तुरंत सुरक्षित रख लें।",
          ],
      procedureBrief: {
        whatToSayOrWrite: isEn
          ? "Tell the operator: 'An unauthorized transaction of ₹[Amount] occurred from my [Bank Name] account at [Time]. The recipient UPI/account is [Details]. Please raise an alert on CFCFRMS to place a Lien on the suspect account.'"
          : "ऑपरेटर से कहें: 'मेरे [बैंक का नाम] खाते से [समय] पर ₹[राशि] का अनधिकृत लेन-देन हुआ है। धोखेबाज का खाता/UPI [विवरण] है। कृपया CFCFRMS पोर्टल पर लीन लगाने का अलर्ट तुरंत भेजें।'",
        documentsNeeded: isEn
          ? ["Your Bank Account Number", "Approximate Time of Debit", "Recipient Account or UPI ID", "Transaction ID / UTR Number"]
          : ["आपका बैंक खाता नंबर", "पैसे कटने का सही समय", "धोखेबाज का खाता या UPI ID", "लेनदेन संदर्भ संख्या (UTR नंबर)"],
        whatHappensNext: isEn
          ? "The 1930 operator sends an electronic alert simultaneously to both your bank and the recipient bank to lock (Lien) the stolen amount in transit."
          : "1930 ऑपरेटर आपके बैंक और धोखेबाज के बैंक दोनों को तुरंत इलेक्ट्रॉनिक अलर्ट भेजता है ताकि रकम को लीन (फ्रीज) किया जा सके।",
      },
      applicableTracks: ["all", "high_value", "standard"],
    },
    {
      id: "p1_block_banking_channels",
      title: isEn
        ? "Block Compromised UPI ID, NetBanking, and Debit/Credit Cards"
        : "प्रभावित UPI आईडी, नेटबैंकिंग और डेबिट/क्रेडिट कार्ड को तुरंत ब्लॉक करें",
      what: isEn
        ? "Freeze the specific payment instrument used in the scam to prevent secondary debits."
        : "धोखेबाज द्वारा आगे और पैसे निकालने से रोकने के लिए अपने बैंक कार्ड और UPI एक्सेस को ब्लॉक करें।",
      when: isEn ? "Within minutes of identifying the breach" : "धोखाधड़ी का पता चलते ही अगले कुछ मिनटों में",
      where: isEn
        ? "Your Bank's 24x7 Emergency Hotlisting Number or Official Mobile App"
        : "आपके बैंक का 24x7 हॉटलिस्टिंग नंबर या आधिकारिक मोबाइल बैंकिंग ऐप",
      howSteps: isEn
        ? [
            "Open your bank's official app or call customer support.",
            "Use the 'Manage Cards' section to switch off International, Online, and Contactless transactions.",
            "Reset your UPI PIN through the official UPI application.",
            "If NetBanking password was exposed, lock Internet Banking using the 'Instant Lock' facility.",
          ]
        : [
            "अपने बैंक के आधिकारिक ऐप में जाएं या कस्टमर केयर नंबर पर कॉल करें।",
            "'Manage Cards' में जाकर ऑनलाइन और अंतरराष्ट्रीय लेन-देन तुरंत बंद करें।",
            "अपने UPI ऐप में जाकर UPI पिन तुरंत बदलें या रीसेट करें।",
            "यदि नेटबैंकिंग पासवर्ड साझा हुआ है, तो इंटरनेट बैंकिंग को तुरंत लॉक करें।",
          ],
      procedureBrief: {
        whatToSayOrWrite: isEn
          ? "Tell bank customer care: 'My card/UPI has been compromised due to fraud. Please hotlist this card and suspend outbound UPI debits immediately.'"
          : "बैंक कस्टमर केयर से कहें: 'मेरा कार्ड/UPI धोखाधड़ी में प्रभावित हुआ है। कृपया इस कार्ड को हॉटलिस्ट करें और तुरंत आउटगोइंग ट्रांसफर ब्लॉक करें।'",
        documentsNeeded: isEn
          ? ["Last 4 digits of card", "Registered mobile number", "Customer ID / Account number"]
          : ["कार्ड के अंतिम 4 अंक", "पंजीकृत मोबाइल नंबर", "कस्टमर आईडी / खाता संख्या"],
        whatHappensNext: isEn
          ? "The bank deactivates electronic payment tokens, preventing any scheduled or recurring mandate charges."
          : "बैंक इलेक्ट्रॉनिक पेमेंट टोकन रद्द कर देता है जिससे कोई नया या ऑटो-डेबिट ट्रांजेक्शन न हो सके।",
      },
      applicableTracks: ["all", "high_value", "standard", "near_miss"],
    },
    {
      id: "p1_disconnect_rogue_apps",
      title: isEn
        ? "Revoke Rogue Screen-Sharing Apps & Malicious APKs"
        : "संदिग्ध स्क्रीन-शेयरिंग ऐप और फर्जी APK को तुरंत हटाएं",
      what: isEn
        ? "Uninstall remote access tools (AnyDesk, TeamViewer, RustDesk) or fake APKs installed under scammer instructions."
        : "धोखेबाज के कहने पर डाउनलोड किए गए स्क्रीन-शेयरिंग ऐप (AnyDesk, RustDesk आदि) या अज्ञात APK तुरंत हटाएं।",
      when: isEn ? "Immediately before logging into any other app" : "किसी भी अन्य बैंकिंग ऐप को खोलने से पहले",
      where: isEn
        ? "Phone Settings > Apps > Installed Applications & Device Administrators"
        : "फोन सेटिंग्स > ऐप्स > इंस्टॉल किए गए ऐप्स और डिवाइस एडमिनिस्ट्रेटर",
      howSteps: isEn
        ? [
            "Put phone in Airplane Mode immediately to terminate remote connections.",
            "Inspect 'Device Admin Apps' in Settings and revoke permissions for any unknown apps.",
            "Uninstall recently downloaded APKs (such as fake courier, electricity bill, or trading apps).",
            "Clear browser cookies and downloaded cache files.",
          ]
        : [
            "रिमोट कनेक्शन तुरंत काटने के लिए फोन को एयरप्लेन मोड में डालें।",
            "सेटिंग्स में 'Device Admin Apps' देखें और किसी भी अज्ञात ऐप की अनुमति रद्द करें।",
            "हाल ही में डाउनलोड किए गए सभी फर्जी APKs (जैसे कूरियर, बिजली बिल, या ट्रेडिंग ऐप) अनइंस्टॉल करें।",
            "ब्राउज़र कैश और कुकीज़ साफ करें।",
          ],
      procedureBrief: {
        whatToSayOrWrite: isEn
          ? "Check Settings > Accessibility > Installed Services to ensure no screen-mirroring overlay is running in the background."
          : "सेटिंग्स > एक्सेसिबिलिटी > इंस्टॉल्ड सर्विसेज में जाकर सुनिश्चित करें कि कोई गुप्त स्क्रीन रिकॉर्डर सक्रिय नहीं है।",
        documentsNeeded: isEn
          ? ["App package name", "Download timestamp"]
          : ["ऐप का नाम", "डाउनलोड करने का समय"],
        whatHappensNext: isEn
          ? "Cuts off the scammer's real-time visibility of SMS OTPs and notification banners."
          : "धोखेबाज को आपके OTP और नोटिफिकेशन देखने से तुरंत रोक देता है।",
      },
      applicableTracks: ["all", "high_value", "standard", "near_miss"],
    },
  ];

  // --- PHASE 2: Evidence Preservation ---
  const phase2Items: FourWActionItem[] = [
    {
      id: "p2_extract_utr_receipts",
      title: isEn
        ? "Extract UTR Number, Bank Statement & Official Transaction Advice"
        : "UTR नंबर, बैंक स्टेटमेंट और आधिकारिक लेनदेन रसीद सुरक्षित करें",
      what: isEn
        ? "Collect the official bank transaction statement displaying the exact UTR Number for every debit."
        : "खाते से हुए हर डेबिट का पक्का प्रमाण और 12-22 अंकों का UTR नंबर बैंक स्टेटमेंट से निकालें।",
      when: isEn ? "Within 2 to 6 hours of incident" : "घटना के 2 से 6 घंटे के भीतर",
      where: isEn
        ? "NetBanking Portal / Official UPI App Transaction Details"
        : "नेटबैंकिंग पोर्टल या UPI ऐप की लेनदेन पासबुक",
      howSteps: isEn
        ? [
            "Log in to NetBanking via a clean browser and download the PDF Account Statement.",
            "Note down the 12-digit UTR Number (Unique Transaction Reference) for each fraudulent transaction.",
            "Screenshot the in-app payment receipt from Google Pay / PhonePe / Paytm.",
            "Highlight the recipient VPA (Virtual Payment Address) or Beneficiary Account Number and IFSC.",
          ]
        : [
            "सुरक्षित कंप्यूटर/ब्राउज़र से नेटबैंकिंग में लॉगिन करें और विस्तृत PDF स्टेटमेंट डाउनलोड करें।",
            "हर धोखाधड़ी वाले लेनदेन का 12 अंकों का UTR नंबर नोट करें।",
            "Google Pay, PhonePe या Paytm की इन-ऐप रसीद का पूरा स्क्रीनशॉट लें।",
            "धोखेबाज का UPI ID (VPA) या बैंक खाता संख्या और IFSC कोड अलग से नोट करें।",
          ],
      procedureBrief: {
        whatToSayOrWrite: isEn
          ? "Format your evidence list: 'Txn 1: ₹[Amount] | UTR: [Number] | Date & Time: [DD/MM/YYYY HH:MM] | Recipient: [UPI ID / Account]'"
          : "अपने साक्ष्यों को क्रमबद्ध करें: 'लेनदेन 1: ₹[राशि] | UTR: [संख्या] | दिनांक व समय: [समय] | लाभार्थी: [UPI ID / खाता]'",
        documentsNeeded: isEn
          ? ["Bank PDF Statement with Bank Stamp / Watermark", "UPI App Transaction Receipts", "Original Bank SMS Debit Alerts"]
          : ["बैंक मुहर/वाटरमार्क वाला PDF स्टेटमेंट", "UPI ऐप की रसीद स्क्रीनशॉट", "बैंक द्वारा भेजा गया मूल SMS अलर्ट"],
        whatHappensNext: isEn
          ? "The UTR acts as the primary forensic key used by cyber police and banks to trace inter-bank fund flow."
          : "यह UTR नंबर साइबर पुलिस और बैंकों के लिए धन के प्रवाह को ट्रैक करने की मुख्य कुंजी बनता है।",
      },
      applicableTracks: ["all", "high_value", "standard"],
    },
    {
      id: "p2_preserve_communications",
      title: isEn
        ? "Archive Scammer Chats, Audio Recordings, Call Logs & Fake Documents"
        : "धोखेबाज के चैट स्क्रीनशॉट, कॉल लॉग, ऑडियो और फर्जी दस्तावेज सुरक्षित करें",
      what: isEn
        ? "Preserve unedited conversational evidence from WhatsApp, Telegram, SMS, or Phone Logs."
        : "WhatsApp, Telegram, SMS या फोन कॉल का कोई भी चैट या सबूत डिलीट न करें, उन्हें डिजिटल रूप से सुरक्षित करें।",
      when: isEn ? "Before blocking or deleting scammer chats" : "धोखेबाज का नंबर ब्लॉक या डिलीट करने से पहले",
      where: isEn
        ? "Local Phone Storage / Cloud Drive (Private)"
        : "फोन का सुरक्षित फोल्डर या निजी क्लाउड ड्राइव",
      howSteps: isEn
        ? [
            "Take full scroll-screenshots of chats showing the scammer's full phone number or handle.",
            "Export WhatsApp chat history with media (Settings > Chats > Export Chat).",
            "Screenshot call logs showing incoming call duration and timestamp.",
            "Save any fake identity cards, FIR copies, arrest warrants, or courier letters sent by the scammer.",
          ]
        : [
            "चैट का पूरा स्क्रीनशॉट लें जिसमें धोखेबाज का पूरा फोन नंबर या प्रोफाइल दिख रही हो।",
            "WhatsApp चैट को 'Export Chat' विकल्प से सुरक्षित फ़ाइल के रूप में सेव करें।",
            "कॉल लॉग का स्क्रीनशॉट लें जिसमें कॉल का समय और अवधि स्पष्ट दिखे।",
            "धोखेबाज द्वारा भेजे गए फर्जी पुलिस आई-कार्ड, वारंट या कूरियर नोटिस को सुरक्षित रखें।",
          ],
      procedureBrief: {
        whatToSayOrWrite: isEn
          ? "Do NOT delete the chat or block the scammer before exporting the logs. Digital signatures are lost once messages are cleared."
          : "चैट एक्सपोर्ट करने से पहले संदेश डिलीट न करें। चैट खाली करने से डिजिटल टाइमस्टैम्प नष्ट हो जाते हैं।",
        documentsNeeded: isEn
          ? ["Chat export (.txt file)", "High-resolution screenshots", "Call history logs with carrier caller ID"]
          : ["चैट एक्सपोर्ट (.txt फ़ाइल)", "स्पष्ट स्क्रीनशॉट", "कॉल इतिहास लॉग"],
        whatHappensNext: isEn
          ? "Provides forensic attribution for Section 66D IT Act and IPC / BNS impersonation charges."
          : "IT एक्ट की धारा 66D और BNS के तहत धोखेबाज पर कानूनी धाराएं लगाने में ठोस आधार बनता है।",
      },
      applicableTracks: ["all", "high_value", "standard"],
    },
  ];

  // --- PHASE 3: Official Reporting & Filing ---
  const phase3Items: FourWActionItem[] = [
    {
      id: "p3_ncrp_portal_complaint",
      title: isEn
        ? "File Formal Cyber Crime Complaint on cybercrime.gov.in (NCRP)"
        : "cybercrime.gov.in (NCRP पोर्टल) पर औपचारिक शिकायत दर्ज करें",
      what: isEn
        ? "Submit a comprehensive legal complaint with transaction hashes and evidence on the National Cyber Crime Reporting Portal."
        : "राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल पर सभी लेन-देन और साक्ष्यों के साथ विस्तृत औपचारिक शिकायत दर्ज करें।",
      when: isEn ? "Within 24 hours of incident" : "घटना के 24 घंटे के भीतर",
      where: isEn
        ? "National Cyber Crime Reporting Portal (cybercrime.gov.in)"
        : "राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल (cybercrime.gov.in)",
      whereUrl: "https://cybercrime.gov.in",
      howSteps: isEn
        ? [
            "Visit cybercrime.gov.in and click 'Report Cyber Crime' > 'Financial Fraud'.",
            "Register/Log in with your mobile number and state OTP.",
            "Fill in Victim details and input Bank/UPI/Wallet transaction entries one by one with corresponding UTRs.",
            "Upload the saved bank statement PDF and chat screenshots as evidence attachments (max 10MB).",
            "Submit and download the generated PDF Complaint Copy containing the 14-digit Acknowledgement Number.",
          ]
        : [
            "cybercrime.gov.in पर जाएं और 'Report Cyber Crime' > 'Financial Fraud' पर क्लिक करें।",
            "अपने मोबाइल नंबर और OTP से लॉग इन करें।",
            "पीड़ित का विवरण भरें और प्रत्येक अनधिकृत लेनदेन का UTR नंबर और बैंक खाता जोड़ें।",
            "बैंक स्टेटमेंट PDF और चैट के स्क्रीनशॉट साक्ष्य के रूप में अपलोड करें।",
            "शिकायत सबमिट करें और 14 अंकों के पावती नंबर वाली PDF कॉपी डाउनलोड करें।",
          ],
      procedureBrief: {
        whatToSayOrWrite: isEn
          ? "Incident Summary: 'On [Date] at [Time], I was deceived into transferring ₹[Total Amount] under false pretenses of [Category]. Suspect details: [Phone/UPI]. Request immediate inter-bank Lien marking and FIR registration.'"
          : "शिकायत का संक्षिप्त विवरण: '[दिनांक] को [समय] पर धोखेबाज ने [धोखाधड़ी का प्रकार] का झांसा देकर ₹[राशि] का अनधिकृत ट्रांसफर कराया। धोखेबाज का विवरण: [फोन/UPI]। कृपया तुरंत लीन लगाने और FIR दर्ज करने की कृपा करें।'",
        documentsNeeded: isEn
          ? ["Bank Statement PDF", "Government Identity Proof (Aadhaar / Voter ID)", "Transaction Receipts with UTR", "Suspect Chat Screenshots"]
          : ["बैंक स्टेटमेंट PDF", "पहचान पत्र (आधार कार्ड/पैन)", "UTR रसीदें", "धोखेबाज के चैट स्क्रीनशॉट"],
        whatHappensNext: isEn
          ? "The complaint is electronically transferred to your state's designated Cyber Crime Police Station for review and formal FIR conversion."
          : "यह शिकायत सीधे आपके संबंधित जिले के साइबर थाने को औपचारिक जांच और FIR दर्ज करने के लिए भेज दी जाती है।",
      },
      applicableTracks: ["all", "high_value", "standard"],
    },
    {
      id: "p3_bank_written_dispute",
      title: isEn
        ? "Submit Written Bank Dispute Letter & Demand Lien Marking Confirmation"
        : "बैंक में लिखित विवाद पत्र (Dispute Letter) दें और लीन पुष्टि की मांग करें",
      what: isEn
        ? "Deliver an official fraud intimation letter to your home branch manager claiming zero liability under RBI customer protection guidelines."
        : "RBI ग्राहक सुरक्षा दिशानिर्देशों के तहत अपनी होम ब्रांच में लिखित शिकायत पत्र सौंपें और रिसीविंग मुहर लें।",
      when: isEn ? "Within 3 business days of the incident" : "घटना के 3 कार्यदिवसों के भीतर",
      where: isEn
        ? "Your Home Bank Branch (In-person) & Registered Nodal Officer Email"
        : "आपकी गृह बैंक शाखा (व्यक्तिगत रूप से) व नोडल अधिकारी का आधिकारिक ईमेल",
      howSteps: isEn
        ? [
            "Draft a formal letter addressed to the Branch Manager citing the 14-digit NCRP acknowledgement number.",
            "Attach printed copies of the bank statement highlighting disputed debits and the NCRP complaint slip.",
            "Submit physically at the branch and obtain a stamped 'Received' counterfoil or acknowledgement seal.",
            "Request the bank's internal Fraud Dispute Ticket / Token Number.",
          ]
        : [
            "शाखा प्रबंधक के नाम एक औपचारिक पत्र लिखें जिसमें NCRP पावती संख्या का अनिवार्य उल्लेख हो।",
            "पत्र के साथ विवादित बैंक स्टेटमेंट की प्रति और पुलिस शिकायत की पर्ची संलग्न करें।",
            "शाखा में व्यक्तिगत रूप से जमा करें और अपने पास मौजूद प्रति पर बैंक की 'Received' मुहर और हस्ताक्षर लें।",
            "बैंक का आंतरिक कंप्लेंट टोकन नंबर अवश्य प्राप्त करें।",
          ],
      procedureBrief: {
        whatToSayOrWrite: isEn
          ? "Reference RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18: 'I have notified the bank within 3 days of unauthorized electronic banking fraud. I request prompt provisional credit and inter-bank Lien freeze confirmation.'"
          : "पत्र में RBI सर्कुलर का हवाला दें: 'मैंने अनधिकृत लेन-देन की सूचना 3 दिनों के भीतर दी है। अतः RBI नियमों के तहत धोखेबाज के खाते पर लीन लगाने व मुझे अनधिकृत डेबिट से राहत देने का कष्ट करें।'",
        documentsNeeded: isEn
          ? ["Written Dispute Letter (2 copies)", "NCRP Acknowledgment Copy", "Stamped Bank Statement", "Copy of Aadhaar/PAN"]
          : ["लिखित शिकायत पत्र (2 प्रतियां)", "NCRP पावती की प्रति", "बैंक स्टेटमेंट", "आधार/पैन की प्रति"],
        whatHappensNext: isEn
          ? "Bank enters the dispute in the National Automated Clearing House (NACH/NPCI) network and communicates with the recipient bank."
          : "बैंक NPCI और लाभार्थी बैंक के साथ विवाद दर्ज कर कानूनी समन्वय शुरू करता है।",
      },
      applicableTracks: ["all", "high_value", "standard"],
    },
    ...(isHighValue
      ? [
          {
            id: "p3_eow_ccps_representation",
            title: isEn
              ? "File Physical Representation at District Cyber Crime Police Station (CCPS) / EOW"
              : "जिला साइबर क्राइम पुलिस स्टेशन (CCPS) / आर्थिक अपराध शाखा (EOW) में व्यक्तिगत शिकायत दर्ज करें",
            what: isEn
              ? "Submit an escalated high-value case docket directly to the Assistant Commissioner of Police (ACP) / Superintendent of Police (SP) heading the District CCPS or Economic Offences Wing."
              : "₹20 लाख से अधिक के बड़े नुकसान के लिए सीधे जिला पुलिस अधीक्षक (SP) या साइबर क्राइम पुलिस स्टेशन (CCPS) में विस्तृत केस डॉकेट जमा करें।",
            when: isEn ? "Within 24 to 48 hours" : "24 से 48 घंटे के भीतर",
            where: isEn
              ? "District Cyber Crime Police Station / Economic Offences Wing (District Police Headquarters)"
              : "जिला साइबर अपराध पुलिस स्टेशन / आर्थिक अपराध शाखा (जिला पुलिस मुख्यालय)",
            howSteps: isEn
              ? [
                  "Prepare a comprehensive printed dossier with index: Complaint petition, NCRP Acknowledgement, bank statement, UTR log, and suspect credentials.",
                  "Visit the District Cyber Police Station or EOW desk during officer hours.",
                  "Request immediate registration of FIR under Section 66D IT Act and relevant sections of BNS / IPC.",
                  "Obtain a certified free copy of the First Information Report (FIR) signed by the Investigating Officer (IO).",
                ]
              : [
                  "पूरा केस डॉकेट तैयार करें: विस्तृत शिकायत पत्र, NCRP पावती, मुहर लगा बैंक स्टेटमेंट, UTR सूची और साक्ष्य।",
                  "जिला साइबर क्राइम थाने या EOW मुख्यालय में जांच अधिकारी से मिलें।",
                  "IT एक्ट की धारा 66D एवं BNS की सुसंगत धाराओं के तहत नियमित FIR दर्ज कराने का आग्रह करें।",
                  "जांच अधिकारी (IO) द्वारा हस्ताक्षरित FIR की प्रमाणित प्रति निःशुल्क प्राप्त करें।",
                ],
            procedureBrief: {
              whatToSayOrWrite: isEn
                ? "State to the Station House Officer (SHO): 'This is an organized syndicate cyber fraud involving a financial loss of ₹[Amount] exceeding ₹20 Lakhs. Kindly invoke high-value jurisdiction to freeze suspect beneficiary pools under Section 106 BNSS / 102 CrPC.'"
                : "थाना प्रभारी (SHO) से कहें: 'यह ₹20 लाख से अधिक की संगठित साइबर धोखाधड़ी का मामला है। अतः विशेष क्षेत्राधिकार के तहत धोखेबाज के बैंक खातों को धारा 106 BNSS / 102 CrPC में तुरंत सीज/फ्रीज करने का नोटिस जारी करें।'",
              documentsNeeded: isEn
                ? ["Formal Petition addressed to Commissioner / SP", "Printed NCRP Complaint", "Attested Bank Statements", "Certified Identity Proof"]
                : ["पुलिस अधीक्षक के नाम हस्ताक्षरित प्रार्थना पत्र", "NCRP शिकायत की प्रति", "सत्यापित बैंक स्टेटमेंट", "पहचान प्रमाण"],
              whatHappensNext: isEn
                ? "The Investigating Officer issues formal Section 102 CrPC notices to the recipient banks ordering an absolute freeze on the accounts."
                : "जांच अधिकारी धारा 102 CrPC / 106 BNSS के तहत धोखेबाज के बैंकों को खाता सीज करने का आधिकारिक कानूनी नोटिस जारी करता है।",
            },
            applicableTracks: ["high_value" as const],
          },
        ]
      : [
          {
            id: "p3_local_police_zero_fir",
            title: isEn
              ? "Obtain Zero FIR / NCR from Nearest Police Station"
              : "नजदीकी पुलिस थाने से जीरो FIR या NCR पावती प्राप्त करें",
            what: isEn
              ? "Ensure formal police registration cannot be refused based on where the scam originated."
              : "यदि स्थानीय थाना क्षेत्राधिकार का बहाना बनाए, तो जीरो FIR या NCR दर्ज करने का वैधानिक अधिकार प्रयोग करें।",
            when: isEn ? "Within 2 to 3 days" : "2 से 3 दिनों के भीतर",
            where: isEn
              ? "Nearest Police Station or Local Cyber Desk"
              : "निकटतम पुलिस स्टेशन या स्थानीय साइबर हेल्पडेस्क",
            howSteps: isEn
              ? [
                  "Carry 2 copies of your printed NCRP acknowledgment and bank debit evidence.",
                  "Request the duty officer to record a General Diary (GD) entry or Zero FIR.",
                  "Ensure the GD / NCR number is stamped onto your receiving copy.",
                ]
              : [
                  "NCRP पावती और बैंक स्टेटमेंट की 2 मुद्रित प्रतियां लेकर जाएं।",
                  "ड्यूटी अधिकारी से जनरल डायरी (GD) या जीरो FIR दर्ज करने का अनुरोध करें।",
                  "अपनी प्रति पर GD नंबर या NCR नंबर की मुहर अवश्य लगवाएं।",
                ],
            procedureBrief: {
              whatToSayOrWrite: isEn
                ? "Remind officers courteously: 'Under MHA guidelines, cyber fraud complaints are eligible for Zero FIR registration without territorial restrictions.'"
                : "अधिकारी से विनम्रतापूर्वक कहें: 'गृह मंत्रालय के स्पष्ट निर्देशानुसार साइबर अपराध में बिना किसी क्षेत्राधिकार विवाद के जीरो FIR दर्ज की जा सकती है।'",
              documentsNeeded: isEn
                ? ["NCRP Complaint Slip", "Bank Statement", "Aadhaar Card copy"]
                : ["NCRP शिकायत पर्ची", "बैंक स्टेटमेंट", "आधार कार्ड प्रति"],
              whatHappensNext: isEn
                ? "Generates the jurisdictional crime record required by bank compliance teams for claims processing."
                : "बैंक क्लेम और कानूनी दावे के लिए आवश्यक आधिकारिक पुलिस रिकॉर्ड तैयार हो जाता है।",
            },
            applicableTracks: ["standard" as const],
          },
        ]),
  ];

  // --- PHASE 4: Tracking & Escalation ---
  const phase4Items: FourWActionItem[] = [
    {
      id: "p4_track_lien_status",
      title: isEn
        ? "Verify Inter-Bank Lien Amount & Layer-1 / Layer-2 Account Freezes"
        : "इंटर-बैंक लीन राशि और लेयर-1/लेयर-2 खाता फ्रीज की स्थिति जांचें",
      what: isEn
        ? "Track whether the 1930 CFCFRMS alert successfully caught and froze the money in the scammer's bank before it was withdrawn."
        : "यह सुनिश्चित करें कि 1930 अलर्ट के बाद धोखेबाज के बैंक खाते में आपकी कितनी राशि पर लीन (रोक) लग पाई है।",
      when: isEn ? "3 to 5 days post-reporting" : "शिकायत के 3 से 5 दिनों बाद",
      where: isEn
        ? "NCRP Portal 'Track Status' / Bank Cyber Dispute Team"
        : "NCRP पोर्टल का 'Track Complaint Status' या बैंक की साइबर डिस्प्यूट टीम",
      whereUrl: "https://cybercrime.gov.in",
      howSteps: isEn
        ? [
            "Log in to cybercrime.gov.in with your complaint number.",
            "Check the 'Action Taken Report' to see which recipient banks have marked a Lien.",
            "Contact your home bank's dispute department and quote the NCRP ID to verify inter-bank acknowledgment.",
            "Record how much of your total lost amount has been successfully frozen in transit.",
          ]
        : [
            "cybercrime.gov.in पर अपने पावती नंबर से लॉगिन करके शिकायत का स्टेटस जांचें।",
            "'Action Taken' कॉलम में देखें कि किस-किस बैंक खाते पर लीन (फ्रीज) लग चुका है।",
            "अपने बैंक के साइबर डिस्प्यूट सेल से संपर्क कर दोनों बैंकों के बीच हुए पत्राचार की पुष्टि करें।",
            "नोट करें कि आपकी कुल राशि में से कितनी राशि विभिन्न खातों में सुरक्षित रोक ली गई है।",
          ],
      procedureBrief: {
        whatToSayOrWrite: isEn
          ? "Ask the bank: 'Please provide the CFCFRMS response log confirming how much balance was placed under Lien at the recipient bank for my transaction UTR [Number].'"
          : "बैंक से पूछें: 'कृपया CFCFRMS रिस्पॉन्स रिपोर्ट दें कि मेरे UTR [नंबर] के विरुद्ध धोखेबाज के बैंक में कितनी राशि पर लीन दर्ज हुई है।'",
        documentsNeeded: isEn
          ? ["14-digit NCRP Complaint ID", "Bank Token Number", "Transaction UTR"]
          : ["14 अंकों का NCRP पावती नंबर", "बैंक कंप्लेंट टोकन", "लेनदेन UTR"],
        whatHappensNext: isEn
          ? "Reveals the exact amount available for recovery via judicial or bank repatriation procedures."
          : "यह स्पष्ट हो जाता है कि अदालत या बैंक द्वारा कितनी धनराशि वापस आपके खाते में लौटाई जा सकती है।",
      },
      applicableTracks: ["all", "high_value", "standard"],
    },
    {
      id: "p4_escalate_nodal_ombudsman",
      title: isEn
        ? isHighValue
          ? "Escalate to Bank Principal Nodal Officer (PNO) & RBI Ombudsman"
          : "Escalate to Bank Nodal Officer & RBI Banking Ombudsman"
        : isHighValue
        ? "बैंक के प्रधान नोडल अधिकारी (PNO) एवं RBI लोकपाल को शिकायत अग्रेषित करें"
        : "बैंक नोडल अधिकारी एवं RBI बैंकिंग लोकपाल को शिकायत अग्रेषित करें",
      what: isEn
        ? "If the bank rejects the dispute or fails to respond within 30 days, invoke the RBI Integrated Ombudsman Scheme (CMS)."
        : "यदि बैंक 30 दिनों में उचित जवाब न दे या लापरवाही बरते, तो नोडल अधिकारी व RBI लोकपाल पोर्टल पर अपील करें।",
      when: isEn ? "If unresolved after 7 to 30 days" : "यदि 7 से 30 दिनों तक समाधान न मिले",
      where: isEn
        ? "RBI Complaint Management System (cms.rbi.org.in)"
        : "RBI शिकायत प्रबंधन प्रणाली (cms.rbi.org.in)",
      whereUrl: "https://cms.rbi.org.in",
      howSteps: isEn
        ? [
            "Locate your bank's designated Principal Nodal Officer / Nodal Officer details on your bank's website.",
            "Send a comprehensive escalation email attaching the initial branch receipt and police report.",
            "If no resolution is given in 30 days, navigate to cms.rbi.org.in and file under 'Deficiency in Banking Service'.",
            "Attach proof that you reported the unauthorized debit within 3 days of occurrence.",
          ]
        : [
            "बैंक की आधिकारिक वेबसाइट से नोडल अधिकारी / प्रधान नोडल अधिकारी (PNO) का ईमेल और पता निकालें।",
            "शाखा की पावती मुहर और पुलिस रिपोर्ट संलग्न करते हुए विस्तृत अपील ईमेल भेजें।",
            "यदि 30 दिनों में बैंक संतोषजनक समाधान न दे, तो सीधे cms.rbi.org.in पर ऑनलाइन केस दर्ज करें।",
            "यह प्रमाण संलग्न करें कि आपने धोखाधड़ी की सूचना 3 दिन के भीतर दे दी थी।",
          ],
      procedureBrief: {
        whatToSayOrWrite: isEn
          ? "Subject: 'Escalation to PNO / Ombudsman: Failure of timely containment in unauthorized debit of ₹[Amount] | Account [No]'"
          : "विषय: 'नोडल अधिकारी / RBI लोकपाल को अपील: खाता [संख्या] से अनधिकृत लेन-देन ₹[राशि] के मामले में सेवा में कमी'",
        documentsNeeded: isEn
          ? ["Proof of initial intimation within 3 days", "Bank complaint ticket number", "Police FIR / NCR copy", "Email correspondence with branch"]
          : ["3 दिन के भीतर सूचना देने का प्रमाण", "बैंक टोकन नंबर", "पुलिस FIR / NCR प्रति", "बैंक शाखा से हुए ईमेल"],
        whatHappensNext: isEn
          ? "The RBI Ombudsman holds statutory powers to order banks to reverse unauthorized transactions under Zero/Limited Customer Liability."
          : "RBI लोकपाल बैंक की लापरवाही पाए जाने पर पीड़ित के पक्ष में अनिवार्य हर्जाना और धनवापसी का आदेश दे सकता है।",
      },
      applicableTracks: ["all", "high_value", "standard"],
    },
  ];

  // --- PHASE 5: Fund Release & Closure ---
  const phase5Items: FourWActionItem[] = [
    {
      id: "p5_court_release_order",
      title: isEn
        ? "Obtain Court Order for Return of Frozen Funds (Section 457 CrPC / 503 BNSS)"
        : "फ्रीज हुई रकम वापस पाने के लिए अदालत से रिलीज ऑर्डर (धारा 457 CrPC / 503 BNSS) प्राप्त करें",
      what: isEn
        ? "File an application before the jurisdictional Magistrate court to order the recipient bank to transfer the frozen funds under Lien back to your account."
        : "संबंधित मजिस्ट्रेट अदालत में आवेदन देकर धोखेबाज के बैंक में फ्रीज पड़ी राशि को वापस अपने खाते में मंगाने का न्यायिक आदेश लें।",
      when: isEn ? "Once police confirms funds are frozen under Lien" : "जैसे ही पुलिस पुष्टि करे कि रकम बैंक में सुरक्षित फ्रीज है",
      where: isEn
        ? "District Magistrate / Cyber Court having local jurisdiction"
        : "संबंधित मुख्य न्यायिक मजिस्ट्रेट (CJM) या साइबर विशेष अदालत",
      howSteps: isEn
        ? [
            "Request the Investigating Officer (IO) for the formal Bank Seizure Report / Panchnama confirming the frozen balance.",
            "Engage a legal counsel or legal aid to file an application under Section 457 of CrPC (or Section 503 BNSS).",
            "Produce your original KYC, bank statements, and payment trails verifying you are the rightful owner.",
            "Once the Magistrate signs the release order, submit certified copies to both banks for immediate account credit.",
          ]
        : [
            "जांच अधिकारी (IO) से बैंक सीजर रिपोर्ट (पंचनामा) की प्रमाणित प्रति प्राप्त करें जिसमें फ्रीज राशि दर्ज हो।",
            "अदालत में धारा 457 CrPC (या नई भारतीय नागरिक सुरक्षा संहिता 503 BNSS) के तहत राशि अवमुक्त कराने का आवेदन दें।",
            "अपने बैंक खाते का मूल स्वामित्व और साक्ष्य प्रस्तुत करें।",
            "अदालत द्वारा आदेश जारी होने पर उसकी प्रमाणित प्रति संबंधित बैंकों में जमा कर राशि अपने खाते में वापस लें।",
          ],
      procedureBrief: {
        whatToSayOrWrite: isEn
          ? "Legal Application: 'Application under Section 457 CrPC for release of interim custody of seized funds under Lien belonging to the applicant lying in [Recipient Bank Account Number].'"
          : "अदालती प्रार्थना पत्र: 'आवेदक के खाते से धोखाधड़ी द्वारा निकाली गई और धोखेबाज के खाते में फ्रीज पड़ी राशि को धारा 457 CrPC के तहत अवमुक्त करने हेतु।'",
        documentsNeeded: isEn
          ? ["Certified copy of Police FIR", "Police Seizure Memo confirming Lien", "Applicant Identity & Address Proof", "Indemnity Bond if required by Magistrate"]
          : ["प्रमाणित FIR प्रति", "पुलिस सीजर मेमो (लीन पुष्टि)", "पहचान व पते का प्रमाण", "न्यायालय द्वारा वांछित क्षतिपूर्ति बंधपत्र"],
        whatHappensNext: isEn
          ? "The recipient bank executes the court mandate, debiting the frozen pool and issuing a direct RTGS/NEFT back into your verified bank account."
          : "धोखेबाज का बैंक अदालत के आदेश का पालन करते हुए फ्रीज राशि को सीधे आपके खाते में NEFT/RTGS द्वारा वापस भेज देता है।",
      },
      applicableTracks: ["all", "high_value", "standard"],
    },
    {
      id: "p5_cibil_identity_hygiene",
      title: isEn
        ? "Activate CIBIL / Credit Bureau Alert & Perform Device Security Hardening"
        : "CIBIL / क्रेडिट ब्यूरो अलर्ट सक्रिय करें और डिवाइस सुरक्षा को रीसेट करें",
      what: isEn
        ? "Audit your credit report for unauthorized loans and perform a comprehensive security purge on devices."
        : "धोखेबाज द्वारा आपके नाम पर फर्जी लोन या क्रेडिट कार्ड लेने से रोकने के लिए CIBIL अलर्ट सक्रिय करें और फोन को सुरक्षित करें।",
      when: isEn ? "During case closure and post-recovery" : "केस पूरा होने और रिकवरी के पश्चात",
      where: isEn
        ? "TransUnion CIBIL, Experian, Equifax & Device Security Settings"
        : "CIBIL.com, Experian India पोर्टल व फोन सेटिंग्स",
      whereUrl: "https://www.cibil.com",
      howSteps: isEn
        ? [
            "Download your official CIBIL CIR (Credit Information Report) to ensure no unrecognized inquiries or loans were opened.",
            "If Aadhaar OTP was exposed, lock your Aadhaar biometrics using the mAadhaar app or resident.uidai.gov.in.",
            "Change all Master Passwords (Email, Google, Apple ID, Banking) using a dedicated password manager.",
            "Enable hardware or authenticator app 2-Factor Authentication (avoiding SMS-only OTPs).",
          ]
        : [
            "cibil.com से अपनी विस्तृत क्रेडिट रिपोर्ट डाउनलोड करें और देखें कि कोई फर्जी लोन आवेदन तो नहीं हुआ।",
            "यदि आधार या OTP साझा हुआ था, तो mAadhaar ऐप से अपने आधार बायोमेट्रिक्स को लॉक करें।",
            "ईमेल, सोशल मीडिया और बैंक के पासवर्ड तुरंत मजबूत व नए पासवर्ड से बदलें।",
            "SMS आधारित OTP के बजाय ऑथेंटिकेटर ऐप (Google Authenticator) से 2-स्टेप वेरिफिकेशन चालू करें।",
          ],
      procedureBrief: {
        whatToSayOrWrite: isEn
          ? "File a dispute on cibil.com if any unfamiliar loan application or inquiry is spotted in your report post-incident."
          : "क्रेडिट रिपोर्ट में कोई भी अनजान लोन इंक्वायरी दिखने पर तुरंत CIBIL पोर्टल पर 'Identity Fraud Dispute' दर्ज करें।",
        documentsNeeded: isEn
          ? ["PAN Card", "Aadhaar Card", "Police Complaint Copy for identity theft disputes"]
          : ["पैन कार्ड", "आधार कार्ड", "पहचान दुरुपयोग संबंधी पुलिस शिकायत की प्रति"],
        whatHappensNext: isEn
          ? "Shields your financial profile permanently from collateral identity abuse, rogue sim-swaps, and secondary credit fraud."
          : "आपकी वित्तीय पहचान और क्रेडिट स्कोर भविष्य के किसी भी अनधिकृत दुरुपयोग से हमेशा के लिए सुरक्षित हो जाते हैं।",
      },
      applicableTracks: ["all", "high_value", "standard"],
    },
  ];

  // If Near-Miss: Return Phase 1 only (with the near-miss checklist in place)
  if (isNearMiss) {
    return [
      {
        number: 1,
        id: "phase_1_containment",
        title: isEn
          ? "Phase 1: Urgent Preventive Containment"
          : "चरण 1: तत्काल निवारक सुरक्षा व रोकथाम",
        shortTitle: isEn ? "1. Containment" : "1. रोकथाम",
        description: isEn
          ? "Neutralize leaked credentials, lock payment channels, and secure devices before any money can be stolen."
          : "खाते से पैसे कटने से पहले लीक हुए पासवर्ड, OTP और डिवाइस एक्सेस को तुरंत सुरक्षित करें।",
        iconName: "ShieldAlert",
        items: phase1Items.filter((item) =>
          item.applicableTracks.includes("near_miss")
        ),
      },
    ];
  }

  // Full 5-Phase Recovery Journey
  return [
    {
      number: 1,
      id: "phase_1_containment",
      title: isEn
        ? "Phase 1: Immediate Containment"
        : "चरण 1: तत्काल रोकथाम (Immediate Containment)",
      shortTitle: isEn ? "1. Containment" : "1. रोकथाम",
      description: isEn
        ? "Halt further loss, alert 1930 for rapid bank freezing, and lock payment credentials."
        : "और नुकसान रोकें, 1930 पर कॉल करके खाता फ्रीज कराएं और पेमेंट माध्यमों को ब्लॉक करें।",
      iconName: "ShieldAlert",
      items: phase1Items,
    },
    {
      number: 2,
      id: "phase_2_evidence",
      title: isEn
        ? "Phase 2: Evidence Preservation"
        : "चरण 2: साक्ष्य संकलन (Evidence Preservation)",
      shortTitle: isEn ? "2. Evidence" : "2. साक्ष्य",
      description: isEn
        ? "Extract critical forensic transaction IDs (UTR numbers) and archive untampered communication records."
        : "लेनदेन का मुख्य UTR नंबर निकालें और चैट, कॉल लॉग व बैंक संदेशों का पक्का रिकॉर्ड सुरक्षित करें।",
      iconName: "FolderLock",
      items: phase2Items,
    },
    {
      number: 3,
      id: "phase_3_reporting",
      title: isEn
        ? "Phase 3: Official Reporting & Filing"
        : "चरण 3: आधिकारिक शिकायत व प्राथमिकी (Reporting & Filing)",
      shortTitle: isEn ? "3. Reporting" : "3. रिपोर्टिंग",
      description: isEn
        ? isHighValue
          ? "Lodge mandatory NCRP portal complaint, submit formal bank dispute letter, and file at District CCPS / EOW."
          : "NCRP पोर्टल पर शिकायत दर्ज करें, बैंक में लिखित विवाद पत्र दें और जीरो FIR / स्थानीय पुलिस शिकायत कराएं।"
        : isHighValue
        ? "NCRP पोर्टल पर शिकायत करें, बैंक को लिखित पत्र दें और जिला साइबर थाने (CCPS / EOW) में प्राथमिकी दर्ज कराएं।"
        : "NCRP पोर्टल पर औपचारिक शिकायत, बैंक विवाद पत्र और जीरो FIR दर्ज कराएं।",
      iconName: "FileCheck",
      items: phase3Items,
    },
    {
      number: 4,
      id: "phase_4_escalation",
      title: isEn
        ? "Phase 4: Tracking & Escalation"
        : "चरण 4: ट्रैकिंग एवं उच्च-स्तरीय अपील (Tracking & Escalation)",
      shortTitle: isEn ? "4. Escalation" : "4. अपील व ट्रैकिंग",
      description: isEn
        ? isHighValue
          ? "Track inter-bank Lien amounts and escalate unresolved delays to Bank Principal Nodal Officer (PNO) & RBI Ombudsman."
          : "लीन राशि की ट्रैकिंग करें और बैंक में समाधान न मिलने पर नोडल अधिकारी व RBI बैंकिंग लोकपाल से अपील करें।"
        : isHighValue
        ? "फ्रीज हुई लीन राशि की निगरानी करें और विलंब होने पर बैंक के प्रधान नोडल अधिकारी (PNO) व RBI लोकपाल को भेजें।"
        : "लीन स्टेटस ट्रैक करें और बैंक नोडल अधिकारी एवं RBI लोकपाल के समक्ष शिकायत दर्ज करें।",
      iconName: "Scale",
      items: phase4Items,
    },
    {
      number: 5,
      id: "phase_5_closure",
      title: isEn
        ? "Phase 5: Fund Release & Closure"
        : "चरण 5: धनवापसी एवं अंतिम सुरक्षा (Fund Release & Closure)",
      shortTitle: isEn ? "5. Fund Release" : "5. धनवापसी",
      description: isEn
        ? "Secure Magistrate court release order for frozen funds, audit credit score, and execute device security lockdown."
        : "अदालत से फ्रीज धन की वापसी का न्यायिक आदेश लें, CIBIL क्रेडिट स्कोर सुरक्षित करें और संपूर्ण सुरक्षा समीक्षा करें।",
      iconName: "CheckCircle2",
      items: phase5Items,
    },
  ];
}
