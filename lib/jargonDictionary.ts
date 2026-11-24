import { JargonDefinition, JargonTermKey } from "@/types/recovery";
import { Language } from "@/types/incident";

export const jargonDictionary: Record<
  Language,
  Record<JargonTermKey, JargonDefinition>
> = {
  en: {
    utr_number: {
      term: "UTR Number (Unique Transaction Reference)",
      meaning:
        "The unique 12-to-22 digit tracking ID for any bank or UPI transfer. It is the single piece of proof that links your bank account to the receiver's account.",
      whereToFind:
        "Find it in your Bank SMS alert, UPI app (GPay/PhonePe/Paytm) transaction history under 'UPI Ref No.', or your bank passbook/statement.",
    },
    lien_hold: {
      term: "Lien (Account Freeze / Hold)",
      meaning:
        "A legal freeze placed on a scammer's bank account or digital wallet that locks the stolen money so they cannot withdraw or move it.",
      whereToFind:
        "When 1930 or your bank marks a Lien, the funds stay frozen inside the recipient bank until a police/court clearance order releases it back to you.",
    },
    chargeback: {
      term: "Chargeback",
      meaning:
        "A formal request made to your card network (Visa/Mastercard/RuPay) to forcibly reverse an unauthorized transaction back to your card.",
      whereToFind:
        "Raised directly with your debit/credit card issuing bank customer care or dispute portal within 3 to 30 days of the unauthorized transaction.",
    },
    zero_fir_ncr: {
      term: "Zero FIR / NCR (Non-Cognizable Report)",
      meaning:
        "A formal police complaint that any police station must register immediately, regardless of where the cyber scam took place or whose jurisdiction it falls under.",
      whereToFind:
        "Request it at any local police station or Cyber Crime Police Station (CCPS). They cannot turn you away for lack of territorial jurisdiction.",
    },
    nodal_officer: {
      term: "Nodal Officer (Bank Escalation)",
      meaning:
        "A senior bank grievance officer dedicated to resolving customer disputes when regular branch staff or customer care numbers fail to help.",
      whereToFind:
        "Found on your bank's official website under 'Grievance Redressal / Escalation Matrix Level 2'. Usually responds within 7 business days.",
    },
    principal_nodal_officer: {
      term: "Principal Nodal Officer (PNO)",
      meaning:
        "The highest internal authority in an Indian bank for unresolved complaints and high-value cyber fraud claims before escalating to the RBI Ombudsman.",
      whereToFind:
        "Found under your bank's 'Level 3 Grievance Matrix'. Required for tracking fraud cases involving ₹20 Lakh or higher.",
    },
    eow_ccps: {
      term: "EOW / CCPS (Economic Offences Wing / Cyber Crime Police Station)",
      meaning:
        "Specialized police departments equipped to investigate complex, organized, and high-value financial crimes (typically ₹20 Lakh to ₹50 Lakh+).",
      whereToFind:
        "Located at your District Police Commissionerate or State Police Headquarters. They possess direct powers to seize suspect bank accounts.",
    },
    cibil_freeze: {
      term: "CIBIL / Credit Bureau Freeze",
      meaning:
        "A temporary lock placed on your credit profile (TransUnion CIBIL / Experian / Equifax) so scammers cannot secretly take loans or credit cards in your name.",
      whereToFind:
        "Activated directly on cibil.com or by reporting identity theft on the national portal to prevent collateral damage to your credit score.",
    },
  },
  hi: {
    utr_number: {
      term: "UTR नंबर (अद्वितीय लेन-देन संदर्भ संख्या)",
      meaning:
        "हर बैंक या UPI ट्रांसफर का 12 से 22 अंकों का यूनिक ट्रैकिंग नंबर। यह आपके खाते से पैसे निकलने और धोखेबाज के खाते में जाने का सबसे बड़ा पक्का सबूत है।",
      whereToFind:
        "यह बैंक के SMS अलर्ट, UPI ऐप (PhonePe, GPay, Paytm) की पासबुक में 'UPI Ref No.', या बैंक स्टेटमेंट में मिलता है।",
    },
    lien_hold: {
      term: "लीन (खाता फ्रीज / राशि पर रोक)",
      meaning:
        "धोखेबाज के बैंक खाते पर लगाई गई कानूनी रोक, जिससे वह चुराए गए पैसे निकाल या कहीं और ट्रांसफर नहीं कर पाता।",
      whereToFind:
        "1930 या आपके बैंक की शिकायत पर धोखेबाज के बैंक द्वारा लगाया जाता है। इसके बाद अदालत या पुलिस आदेश द्वारा पैसे वापस रिलीज होते हैं।",
    },
    chargeback: {
      term: "चार्ज-बैक (कार्ड लेनदेन वापसी)",
      meaning:
        "कार्ड नेटवर्क (Visa, Mastercard, RuPay) से अनधिकृत लेन-देन को रद्द करके पैसे सीधे आपके कार्ड में वापस मंगाने की आधिकारिक प्रक्रिया।",
      whereToFind:
        "धोखाधड़ी के तुरंत बाद अपने कार्ड जारीकर्ता बैंक की कस्टमर केयर या डिस्प्यूट फॉर्म के जरिए 3 से 30 दिनों में दर्ज कराया जाता है।",
    },
    zero_fir_ncr: {
      term: "जीरो FIR / NCR (असंज्ञेय रिपोर्ट)",
      meaning:
        "एक आधिकारिक पुलिस शिकायत जिसे कोई भी पुलिस स्टेशन तुरंत दर्ज करने के लिए बाध्य है, भले ही अपराध कहीं भी और किसी भी क्षेत्र में हुआ हो।",
      whereToFind:
        "किसी भी नजदीकी थाने या साइबर क्राइम पुलिस स्टेशन में दर्ज कराएं। पुलिस क्षेत्राधिकार का हवाला देकर मना नहीं कर सकती।",
    },
    nodal_officer: {
      term: "नोडल अधिकारी (बैंक शिकायत निवारण)",
      meaning:
        "बैंक का वरिष्ठ शिकायत निवारण अधिकारी, जो तब हस्तक्षेप करता है जब बैंक शाखा या सामान्य कस्टमर केयर मदद करने में विफल रहते हैं।",
      whereToFind:
        "बैंक की आधिकारिक वेबसाइट पर 'Grievance Redressal Level 2' के तहत ईमेल और फोन नंबर मिल जाएगा। आमतौर पर 7 दिनों में जवाब मिलता है।",
    },
    principal_nodal_officer: {
      term: "प्रधान नोडल अधिकारी (PNO)",
      meaning:
        "बैंक का सर्वोच्च आंतरिक शिकायत अधिकारी, जो बड़े साइबर फ्रॉड (₹20 लाख या अधिक) और अनसुलझी शिकायतों की सीधी निगरानी करता है।",
      whereToFind:
        "बैंक की वेबसाइट के 'Level 3 Grievance Matrix' में इसका विवरण होता है। RBI लोकपाल से पहले यह अंतिम बैंक स्तर है।",
    },
    eow_ccps: {
      term: "EOW / CCPS (आर्थिक अपराध शाखा / साइबर क्राइम थाना)",
      meaning:
        "पुलिस की विशेष विंग जो बड़े और संगठित वित्तीय घोटालों (विशेषकर ₹20 लाख या उससे अधिक) की उच्च-स्तरीय जांच करती है।",
      whereToFind:
        "जिला पुलिस मुख्यालय या कमिश्नरेट में स्थित होता है। इनके पास सीधे फर्जी खाते सीज करने और फॉरेंसिक जांच के अधिकार होते हैं।",
    },
    cibil_freeze: {
      term: "CIBIL / क्रेडिट रिपोर्ट फ्रीज",
      meaning:
        "आपकी क्रेडिट प्रोफाइल पर लगाई जाने वाली रोक ताकि धोखेबाज आपके चुराए गए आधार/पैन पर फर्जी लोन या क्रेडिट कार्ड न ले सकें।",
      whereToFind:
        "cibil.com, Experian या Equifax की वेबसाइट पर जाकर या पहचान चोरी की शिकायत दर्ज कराके सक्रिय किया जाता है।",
    },
  },
};
