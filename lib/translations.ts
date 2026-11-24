import { AmountBracket, FraudCategory, Language, TimeElapsed } from "@/types/incident";

export interface TranslationDictionary {
  brand: {
    name: string;
    tagline: string;
    privacyBadge: string;
    privacyTooltip: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    safetyNote: string;
  };
  path1: {
    sectionTitle: string;
    sectionSubtitle: string;
    textareaPlaceholder: string;
    textareaHint: string;
    amountLabel: string;
    timeLabel: string;
    ctaButton: string;
    ctaSubtext: string;
    validationWarning: string;
  };
  amountOptions: Record<Exclude<AmountBracket, "">, string>;
  timeOptions: Record<Exclude<TimeElapsed, "">, string>;
  dividerText: string;
  path2: {
    sectionTitle: string;
    sectionSubtitle: string;
    scenarios: Record<
      FraudCategory,
      {
        title: string;
        description: string;
        badge: string;
      }
    >;
  };
  verification: {
    badge: string;
    headline: string;
    subheadline: string;
    dataCardTitle: string;
    dataCardNotice: string;
    labelPathType: string;
    labelCategory: string;
    labelIncidentDetails: string;
    labelAmountBracket: string;
    labelTimeElapsed: string;
    labelCapturedAt: string;
    labelDeviceStorage: string;
    deviceStorageValue: string;
    module2NoticeTitle: string;
    module2NoticeDesc: string;
    btnEdit: string;
    btnReset: string;
    pathFreeText: string;
    pathGuided: string;
    notSpecified: string;
  };
  footer: {
    helplineText: string;
    helplineNumber: string;
    disclaimer: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brand: {
      name: "Reclaim",
      tagline: "Your Calm Post-Fraud Co-Pilot",
      privacyBadge: "100% On-Device • Private",
      privacyTooltip: "No data is sent to external databases. Your information remains strictly inside your browser.",
    },
    hero: {
      headline: "Take a deep breath. Let's figure out your next step together.",
      subheadline:
        "Experiencing fraud is overwhelming, but swift, clear action makes all the difference. We will guide you calmly without confusion or judgment.",
      safetyNote: "Your safety first: Do not share OTPs, PINs, or transfer more money.",
    },
    path1: {
      sectionTitle: "Tell us what happened",
      sectionSubtitle: "Type freely in your own words, or tap the quick tags below to get started.",
      textareaPlaceholder:
        "Example: ₹35,000 was debited via UPI after I clicked a fake courier tracking link 30 minutes ago...",
      textareaHint: "Tip: Mention what platform was used, approximate amount, and how long ago it occurred.",
      amountLabel: "Approximate Loss Amount (Optional)",
      timeLabel: "When did it happen? (Optional)",
      ctaButton: "Get My Step-by-Step Plan",
      ctaSubtext: "Generates an immediate, personalized recovery checklist",
      validationWarning: "Please either describe what happened or select a quick option below.",
    },
    amountOptions: {
      under_20l: "Under ₹20 Lakh",
      above_20l: "₹20 Lakh or more",
      not_sure: "Not sure / No direct loss",
    },
    timeOptions: {
      under_2hrs: "Just now / Under 2 hrs",
      today: "Earlier today",
      over_24hrs: "More than 24 hrs ago",
    },
    dividerText: "OR PICK WHAT MATCHES YOUR SITUATION",
    path2: {
      sectionTitle: "Or pick what matches your situation",
      sectionSubtitle: "Tap any common scenario to immediately start a tailored response plan.",
      scenarios: {
        upi_bank_transfer: {
          title: "UPI / Bank Transfer Fraud",
          description: "Unauthorized debit, fake QR code scan, or payment sent to wrong link",
          badge: "Financial",
        },
        digital_arrest: {
          title: "Digital Arrest / Fake Authority Call",
          description: "Impersonation of Police, CBI, ED, Customs, or FedEx threatening legal action",
          badge: "Coercion",
        },
        investment_task: {
          title: "Investment / Part-Time Task Scam",
          description: "Telegram tasks, YouTube review pay, fake trading apps, or crypto promise",
          badge: "Investment",
        },
        phishing_otp: {
          title: "Phishing Link / OTP Shared",
          description: "Clicked suspicious link or shared code, but money is not yet debited",
          badge: "Urgent Preventive",
        },
        social_account_hacked: {
          title: "Social Media / Account Hacked",
          description: "WhatsApp, Instagram, Gmail, or device hijacked or locked out",
          badge: "Identity",
        },
        other: {
          title: "Other Cyber Incident",
          description: "Online shopping scam, identity theft, or unlisted fraud",
          badge: "General",
        },
      },
    },
    verification: {
      badge: "Module 1 State Verified",
      headline: "Incident Captured Successfully",
      subheadline:
        "Here is the exact data captured and saved to your device. This context will power your step-by-step recovery plan in Module 2.",
      dataCardTitle: "Captured Incident Profile",
      dataCardNotice: "Saved to browser localStorage (Privacy by Design)",
      labelPathType: "Intake Path",
      labelCategory: "Identified Category",
      labelIncidentDetails: "Incident Description",
      labelAmountBracket: "Approximate Loss",
      labelTimeElapsed: "Time Elapsed",
      labelCapturedAt: "Captured At",
      labelDeviceStorage: "Storage Destination",
      deviceStorageValue: "Local Device Storage only (Zero remote database)",
      module2NoticeTitle: "Ready for Module 2: Personalized Action Protocol",
      module2NoticeDesc:
        "The captured session state is ready to generate golden-hour freezing commands, bank dispute scripts, and national cyber crime reporting templates.",
      btnEdit: "Edit / Adjust Details",
      btnReset: "Start Over",
      pathFreeText: "Path 1 — Free Text Description",
      pathGuided: "Path 2 — Guided Scenario Selection",
      notSpecified: "Not specified",
    },
    footer: {
      helplineText: "National Cyber Crime Helpline (India):",
      helplineNumber: "1930",
      disclaimer: "Reclaim is an emergency guidance tool. We do not store personal credentials or charge fees.",
    },
  },
  hi: {
    brand: {
      name: "Reclaim",
      tagline: "आपका शांत साइबर-धोखाधड़ी सहायक",
      privacyBadge: "100% ऑन-डिवाइस • सुरक्षित",
      privacyTooltip: "कोई भी डेटा बाहरी सर्वर पर नहीं भेजा जाता। आपकी जानकारी पूरी तरह आपके ब्राउज़र में सुरक्षित है।",
    },
    hero: {
      headline: "एक गहरी सांस लें। आइए मिलकर आपका अगला कदम तय करें।",
      subheadline:
        "धोखाधड़ी का सामना करना तनावपूर्ण हो सकता है, लेकिन तुरंत सही कदम उठाने से नुकसान रोका जा सकता है। हम बिना किसी जल्दबाजी के आपका मार्गदर्शन करेंगे।",
      safetyNote: "सुरक्षा सावधानी: किसी के साथ OTP, PIN साझा न करें और अतिरिक्त पैसे ट्रांसफर न करें।",
    },
    path1: {
      sectionTitle: "बताएं क्या हुआ",
      sectionSubtitle: "अपने शब्दों में खुलकर लिखें, या तुरंत शुरुआत के लिए नीचे दिए गए विकल्पों को चुनें।",
      textareaPlaceholder:
        "उदाहरण: 30 मिनट पहले एक फर्जी कूरियर ट्रैकिंग लिंक पर क्लिक करने के बाद मेरे खाते से UPI द्वारा ₹35,000 कट गए...",
      textareaHint: "सुझाव: कौन सा ऐप इस्तेमाल हुआ, लगभग कितनी राशि कटी और यह कब हुआ, जरूर लिखें।",
      amountLabel: "अनुमानित नुकसान राशि (वैकल्पिक)",
      timeLabel: "यह कब हुआ? (वैकल्पिक)",
      ctaButton: "मेरी चरण-दर-चरण योजना प्राप्त करें",
      ctaSubtext: "तत्काल व्यक्तिगत रिकवरी चेकलिस्ट तैयार करता है",
      validationWarning: "कृपया अपनी स्थिति का विवरण लिखें या नीचे दिए गए किसी विकल्प को चुनें।",
    },
    amountOptions: {
      under_20l: "₹20 लाख से कम",
      above_20l: "₹20 लाख या अधिक",
      not_sure: "निश्चित नहीं / कोई प्रत्यक्ष नुकसान नहीं",
    },
    timeOptions: {
      under_2hrs: "अभी-अभी / 2 घंटे के भीतर",
      today: "आज पहले",
      over_24hrs: "24 घंटे से अधिक पहले",
    },
    dividerText: "या अपनी स्थिति के अनुसार विकल्प चुनें",
    path2: {
      sectionTitle: "या अपनी स्थिति के अनुसार विकल्प चुनें",
      sectionSubtitle: "अपनी स्थिति से मिलता-जुलता कार्ड चुनें और तुरंत अपनी समाधान योजना शुरू करें।",
      scenarios: {
        upi_bank_transfer: {
          title: "UPI / बैंक ट्रांसफर धोखाधड़ी",
          description: "अनधिकृत डेबिट, फर्जी QR कोड स्कैन, या गलत लिंक पर भुगतान भेजा गया",
          badge: "वित्तीय",
        },
        digital_arrest: {
          title: "डिजिटल अरेस्ट / फर्जी अधिकारी कॉल",
          description: "पुलिस, CBI, कस्टम्स या कूरियर अधिकारी बनकर कानूनी धमकी देना",
          badge: "धमकी / दबाव",
        },
        investment_task: {
          title: "निवेश / पार्ट-टाइम टास्क घोटाला",
          description: "टेलीग्राम टास्क, यूट्यूब लाइक टास्क, फर्जी ट्रेडिंग ऐप या क्रिप्टो का झांसा",
          badge: "निवेश घोटाला",
        },
        phishing_otp: {
          title: "फिशिंग लिंक / OTP साझा किया",
          description: "संदिग्ध लिंक पर क्लिक किया या कोड दिया, पर अभी पैसे नहीं कटे हैं",
          badge: "तत्काल रोकथाम",
        },
        social_account_hacked: {
          title: "सोशल मीडिया / अकाउंट हैक",
          description: "WhatsApp, Instagram, Gmail या डिवाइस का अनधिकृत नियंत्रण",
          badge: "पहचान सुरक्षा",
        },
        other: {
          title: "अन्य साइबर घटना",
          description: "ऑनलाइन शॉपिंग घोटाला, पहचान की चोरी, या अन्य धोखाधड़ी",
          badge: "सामान्य",
        },
      },
    },
    verification: {
      badge: "मॉड्यूल 1 डेटा सत्यापित",
      headline: "घटना का विवरण सफलतापूर्वक दर्ज हुआ",
      subheadline:
        "यह विवरण आपके डिवाइस पर सुरक्षित रूप से सहेज लिया गया है। यही डेटा मॉड्यूल 2 में आपकी चरण-दर-चरण रिकवरी योजना तैयार करेगा।",
      dataCardTitle: "दर्ज की गई घटना की प्रोफाइल",
      dataCardNotice: "केवल आपके ब्राउज़र के localStorage में सुरक्षित (Privacy by Design)",
      labelPathType: "इनटेक का माध्यम",
      labelCategory: "पहचानी गई श्रेणी",
      labelIncidentDetails: "घटना का विवरण",
      labelAmountBracket: "अनुमानित नुकसान राशि",
      labelTimeElapsed: "बीता हुआ समय",
      labelCapturedAt: "दर्ज करने का समय",
      labelDeviceStorage: "डेटा संग्रहण स्थान",
      deviceStorageValue: "केवल स्थानीय डिवाइस स्टोरेज (कोई बाहरी डेटाबेस नहीं)",
      module2NoticeTitle: "मॉड्यूल 2 के लिए तैयार: व्यक्तिगत रिकवरी प्रोटोकॉल",
      module2NoticeDesc:
        "सहेजी गई जानकारी बैंक खाता फ्रीज करने के निर्देश, 1930 हेल्पलाइन रिपोर्टिंग प्रारूप और विवाद पत्र बनाने के लिए तैयार है।",
      btnEdit: "विवरण संपादित करें",
      btnReset: "पुनः शुरू करें",
      pathFreeText: "पाथ 1 — मुक्त विवरण इनपुट",
      pathGuided: "पाथ 2 — निर्देशित विकल्प चयन",
      notSpecified: "दर्ज नहीं किया गया",
    },
    footer: {
      helplineText: "राष्ट्रीय साइबर अपराध हेल्पलाइन (भारत):",
      helplineNumber: "1930",
      disclaimer: "Reclaim एक आपातकालीन मार्गदर्शन साधन है। हम कोई पासवर्ड या पिन नहीं मांगते और न ही कोई शुल्क लेते हैं।",
    },
  },
};
