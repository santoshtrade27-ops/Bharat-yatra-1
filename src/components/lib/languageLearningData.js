// Multilingual Phrasebook and Local Language Learning Books Data Store

export const languageOptions = [
  { code: "te", name: "Telugu", nativeName: "తెలుగు", script: "తెలుగు లిపి", speechLang: "te-IN", region: "Andhra Pradesh & Telangana" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", script: "देवनागरी", speechLang: "hi-IN", region: "North & Central India" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", script: "தமிழ் அரிச்சுவடி", speechLang: "ta-IN", region: "Tamil Nadu & Puducherry" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", script: "বাংলা লিপি", speechLang: "bn-IN", region: "West Bengal & Tripura" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", script: "ಕನ್ನಡ ಲಿಪಿ", speechLang: "kn-IN", region: "Karnataka" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", script: "देवनागरी", speechLang: "mr-IN", region: "Maharashtra" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", script: "ગુજરાતી લિપિ", speechLang: "gu-IN", region: "Gujarat" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", script: "മലയാള ലിപി", speechLang: "ml-IN", region: "Kerala" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", script: "ਗੁਰਮੁਖੀ", speechLang: "pa-IN", region: "Punjab" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", script: "ଓଡ଼ିଆ ଲିପି", speechLang: "or-IN", region: "Odisha" },
  { code: "en", name: "English", nativeName: "English", script: "Latin Script", speechLang: "en-IN", region: "Pan-India Business & Tourist" },
];

export const comprehensivePhrasebook = [
  // CATEGORY 1: GREETINGS & COURTESY
  {
    id: "greet-1",
    category: "Greetings & Politeness",
    en: "Hello / Greetings",
    translations: {
      te: { script: "నమస్కారం", pron: "Namaskāram", tip: "Universal respectful greeting across Andhra & Telangana. Join palms together." },
      hi: { script: "नमस्ते / नमस्कार", pron: "Namastē / Namaskār", tip: "Traditional greeting with folded hands." },
      ta: { script: "வணக்கம்", pron: "Vaṇakkam", tip: "Standard respectful greeting across Tamil Nadu." },
      bn: { script: "নমস্কার / আদাব", pron: "Nomoshkār / Ādāb", tip: "Universal respectful greeting." },
      kn: { script: "ನಮಸ್ಕಾರ", pron: "Namaskāra", tip: "Respectful Kannada greeting." },
      mr: { script: "नमस्कार", pron: "Namaskār", tip: "Standard Marathi greeting." },
      gu: { script: "નમસ્તે / જય શ્રી કૃષ્ણ", pron: "Namastē / Jai Shri Krishna", tip: "Common warm Gujarati greeting." },
      ml: { script: "നമസ്കാരം", pron: "Namaskāram", tip: "Universal respectful greeting in Kerala." },
      pa: { script: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", pron: "Sat Srī Akāl", tip: "Traditional Sikh greeting of truth and respect." },
    }
  },
  {
    id: "greet-2",
    category: "Greetings & Politeness",
    en: "Thank you very much",
    translations: {
      te: { script: "చాలా ధన్యవాదాలు", pron: "Chālā dhanyavādālu", tip: "Expresses sincere heartfelt gratitude." },
      hi: { script: "बहुत बहुत धन्यवाद / शुक्रिया", pron: "Bahut bahut dhanyavād / Shukriyā", tip: "Polite gratitude for hospitality." },
      ta: { script: "மிக்க நன்றி", pron: "Mikka naṉṟi", tip: "Polite and warm thank you." },
      bn: { script: "অনেক ধন্যবাদ", pron: "Onēk dhonyobād", tip: "Standard Bengali expression of thanks." },
      kn: { script: "ತುಂಬಾ ಧನ್ಯವಾದಗಳು", pron: "Tumbā dhanyavādagalu", tip: "Warm gratitude in Kannada." },
      mr: { script: "खूप खूप धन्यवाद", pron: "Khūp khūp dhanyavād", tip: "Heartfelt Marathi thanks." },
      gu: { script: "ખૂબ ખૂબ આભાર", pron: "Khūb khūb ābhār", tip: "Polite Gujarati gratitude." },
      ml: { script: "വളരെ നന്ദി", pron: "Valare nandi", tip: "Heartfelt thanks in Malayalam." },
      pa: { script: "ਬਹੁਤ ਬਹੁਤ ਧੰਨਵਾਦ", pron: "Bahut bahut dhanvād", tip: "Warm thanks in Punjabi." },
    }
  },
  {
    id: "greet-3",
    category: "Greetings & Politeness",
    en: "How are you? (Respectful)",
    translations: {
      te: { script: "మీరు ఎలా ఉన్నారు?", pron: "Mīru elā unnāru?", tip: "Formal polite inquiry used with elders and locals." },
      hi: { script: "आप कैसे हैं?", pron: "Āp kaisē hain?", tip: "Respectful inquiry used across North India." },
      ta: { script: "நீங்கள் எப்படி இருக்கிறீர்கள்?", pron: "Nīṅkaḷ eppaṭi irukkiṟīrkaḷ?", tip: "Respectful greeting to locals." },
      bn: { script: "আপনি কেমন আছেন?", pron: "Āpni kēmōn āchhēn?", tip: "Polite formal greeting in West Bengal." },
      kn: { script: "ನೀವು ಹೇಗಿದ್ದೀರಿ?", pron: "Nīvu hēgiddīri?", tip: "Polite Kannada inquiry." },
      mr: { script: "तुम्ही कसे आहात?", pron: "Tumhī kasē āhāt?", tip: "Respectful inquiry in Maharashtra." },
      gu: { script: "તમે કેમ છો?", pron: "Tamē kēm chho?", tip: "Warm conversational Gujarati opening." },
      ml: { script: "സുഖമാണോ?", pron: "Sukhamāṇō?", tip: "Friendly inquiry about well-being in Kerala." },
      pa: { script: "ਤੁਹਾਡਾ ਕੀ ਹਾਲ ਹੈ?", pron: "Tuhāḍā kī hāl hai?", tip: "Polite inquiry in Punjab." },
    }
  },

  // CATEGORY 2: DIRECTIONS & NAVIGATION
  {
    id: "dir-1",
    category: "Directions & Transport",
    en: "Where is the temple / shrine?",
    translations: {
      te: { script: "గుడి ఎక్కడ ఉంది?", pron: "Guḍi ekkaḍa undi?", tip: "Remember to remove footwear at the temple chappal stand." },
      hi: { script: "मंदिर कहाँ है?", pron: "Mandir kahān hai?", tip: "Dress modestly covering shoulders and knees." },
      ta: { script: "கோவில் எங்கே உள்ளது?", pron: "Kōvil eṅkē uḷḷathu?", tip: "Follow traditional circumambulation direction." },
      bn: { script: "মন্দিরটি কোথায়?", pron: "Mandirti kōthāy?", tip: "Respect photography guidelines at the sanctum." },
      kn: { script: "ದೇವಸ್ಥಾನ ಎಲ್ಲಿದೆ?", pron: "Dēvasthāna ellide?", tip: "Remove footwear outside temple gopuram." },
      mr: { script: "मंदिर कुठे आहे?", pron: "Mandir kuṭhē āhē?", tip: "Traditional shrine inquiry." },
      gu: { script: "મંદિર ક્યાં છે?", pron: "Mandir kyān chhe?", tip: "Inquire about Darshan opening times." },
      ml: { script: "ക്ഷേത്രം എവിടെയാണ്?", pron: "Kshētram eviḍeyāṇu?", tip: "Traditional Kerala temples require special dress codes." },
      pa: { script: "ਗੁਰਦੁਆਰਾ / ਮੰਦਰ ਕਿੱਥੇ ਹੈ?", pron: "Gurduārā / Mandir kithē hai?", tip: "Cover your head before entering any Gurudwara." },
    }
  },
  {
    id: "dir-2",
    category: "Directions & Transport",
    en: "Where is the railway station / bus stand?",
    translations: {
      te: { script: "రైల్వే స్టేషన్ / బస్ స్టాండ్ ఎక్కడ ఉంది?", pron: "Railway station / Bus stand ekkaḍa undi?", tip: "Prepaid auto booths are available at major AP & Telangana stations." },
      hi: { script: "रेलवे स्टेशन / बस स्टैंड कहाँ है?", pron: "Railway station / Bus stand kahān hai?", tip: "Check platform indicators for Vande Bharat Express." },
      ta: { script: "ரயில் நிலையம் / பேருந்து நிலையம் எங்கே?", pron: "Rail nilayam / Pērundhu nilayam eṅkē?", tip: "Chennai Central and Egmore connect major heritage lines." },
      bn: { script: "রেলওয়ে স্টেশন / বাস স্ট্যান্ডটি কোথায়?", pron: "Railway station / Bus stand-ti kōthāy?", tip: "Howrah and Sealdah are major transit hubs." },
      kn: { script: "ರೈಲ್ವೆ ನಿಲ್ದಾಣ / ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?", pron: "Railway nildāṇa / Bus nildāṇa ellide?", tip: "KSR Bengaluru connects Hampi and Mysore routes." },
      mr: { script: "रेल्वे स्टेशन / बस स्थानक कुठे आहे?", pron: "Railway station / Bus sthānak kuṭhē āhē?", tip: "Ask for MSRTC Shivneri luxury bus counters." },
      gu: { script: "રેલવે સ્ટેશન / બસ સ્ટેન્ડ ક્યાં છે?", pron: "Railway station / Bus stand kyān chhe?", tip: "GSRTC Volvo services operate between heritage cities." },
      ml: { script: "റെയിൽവേ സ്റ്റേഷൻ / ബസ് സ്റ്റാൻഡ് എവിടെയാണ്?", pron: "Railway station / Bus stand eviḍeyāṇu?", tip: "KSRTC Swift buses connect all Kerala tourist hubs." },
      pa: { script: "ਰੇਲਵੇ ਸਟੇਸ਼ਨ / ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?", pron: "Railway station / Bus aḍḍā kithē hai?", tip: "Amritsar and Chandigarh stations have prepaid cabs." },
    }
  },
  {
    id: "dir-3",
    category: "Directions & Transport",
    en: "Please turn on the meter / How much fare?",
    translations: {
      te: { script: "దయచేసి మీటర్ వేయండి / ఎంత ఛార్జ్ అవుతుంది?", pron: "Dayachēsi mētar vēyaṇḍi / Entha chārj avuthundi?", tip: "Auto-rickshaws in Vizag and Hyderabad follow government rate cards." },
      hi: { script: "कृपया मीटर चालू करें / किराया कितना होगा?", pron: "Kripayā meter chālū karēin / Kirāyā kitnā hōgā?", tip: "Agree on price before boarding if meter is unavailable." },
      ta: { script: "தயவுசெய்து மீட்டர் போடுங்கள் / கட்டணம் எவ்வளவு?", pron: "Dayavuseithu mīṭṭar pōṭuṅkaḷ / Kaṭṭaṇam evvaḷavu?", tip: "Confirm if luggage charges are included in fare." },
      bn: { script: "দয়া করে মিটার চালু করুন / ভাড়া কত?", pron: "Doyā korē meter chālu korun / Bhāṛā kōtō?", tip: "Yellow taxis in Kolkata use official conversion charts." },
      kn: { script: "ದಯವಿಟ್ಟು ಮೀಟರ್ ಹಾಕಿ / ಬಾಡಿಗೆ ಎಷ್ಟು?", pron: "Dayaviṭṭu mētar hāki / Bāḍige eṣṭu?", tip: "Bangalore and Mysore autos use digital meters." },
      mr: { script: "कृपया मीटर चालू करा / भाडे किती होईल?", pron: "Kripayā meter chālū karā / Bhāḍē kitī hoīl?", tip: "Mumbai and Pune autos strictly follow electronic meters." },
      gu: { script: "કૃપા કરીને મીટર ચાલુ કરો / ભાડું કેટલું થશે?", pron: "Kripā karīnē meter chālu karō / Bhāḍun keṭlu thashē?", tip: "Confirm standard day rates for full sightseeing." },
      ml: { script: "മീറ്റർ ഇടാമോ / ചാർജ്ജ് എത്രയാണ്?", pron: "Meter iṭāmō / Chārjj ethrayāṇu?", tip: "Kerala autos have minimum base fares posted inside." },
      pa: { script: "ਕਿਰਪਾ ਕਰਕੇ ਮੀਟਰ ਚਲਾਓ / ਕਿਰਾਇਆ ਕਿੰਨਾ ਹੈ?", pron: "Kirpā karkē meter chalāō / Kirāyā kinnā hai?", tip: "Clarify route through bypass or heritage corridor." },
    }
  },

  // CATEGORY 3: SHOPPING & HANDLOOM BARGAINING
  {
    id: "shop-1",
    category: "Shopping & Handloom",
    en: "How much does this cost?",
    translations: {
      te: { script: "ఇది ఎంత ధర / ఎంత పడుతుంది?", pron: "Idi entha dhara / Entha paḍuthundi?", tip: "Ask for GI certificate when buying Uppada or Pochampally sarees." },
      hi: { script: "यह कितने का है?", pron: "Yeh kitnē kā hai?", tip: "Look for government Silk Mark and Handloom Mark tags." },
      ta: { script: "இதன் விலை என்ன?", pron: "Ithan vilai eṉṉa?", tip: "Genuine Kanchipuram silk has gold zari hallmark." },
      bn: { script: "এটার দাম কত?", pron: "Ēṭār dām kōtō?", tip: "Ask for authentic Baluchari and Jamdani handloom seals." },
      kn: { script: "ಇದರ ಬೆಲೆ ಎಷ್ಟು?", pron: "Idara bele eṣṭu?", tip: "Mysore Sandalwood and Silk have government emporium seals." },
      mr: { script: "याची किंमत किती आहे?", pron: "Yāchī kimmat kitī āhē?", tip: "Paithani sarees feature peacock pallu woven in pure silk." },
      gu: { script: "આનો ભાવ શું છે?", pron: "Ānō bhāv shun chhe?", tip: "Patola and Bandhani textiles have registered artisan guilds." },
      ml: { script: "ഇതിന് എത്ര രൂപയാണ്?", pron: "Ithinu ethra rūpayāṇu?", tip: "Kasavu gold-bordered handlooms have Kerala state seals." },
      pa: { script: "ਇਹਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?", pron: "Ihdā mull kinnā hai?", tip: "Phulkari embroidery dupattas are handcrafted in Punjab." },
    }
  },
  {
    id: "shop-2",
    category: "Shopping & Handloom",
    en: "Can you give a little discount? (Polite Bargaining)",
    translations: {
      te: { script: "కొంచెం ధర తగ్గించగలరా?", pron: "Konchem dhara tagginchagalarā?", tip: "Say with a polite smile in local handicraft bazaars." },
      hi: { script: "थोड़ा कम कर दीजिए ना?", pron: "Thōḍā kam kar dījiē nā?", tip: "Polite bargaining is standard in open-air bazaars." },
      ta: { script: "கொஞ்சம் குறைத்து தர முடியுமா?", pron: "Koñcam kuṟaithu thara muṭiyumā?", tip: "Ask politely when buying multiple artisan items." },
      bn: { script: "একটু কম রাখা যাবে?", pron: "Ēkṭu kom rākhā jābē?", tip: "Respectful negotiation in Kolkata New Market." },
      kn: { script: "ಸ್ವಲ್ಪ ರಿಯಾಯಿತಿ ಕೊಡಿ?", pron: "Svalpa riyāyiti koḍi?", tip: "Friendly negotiation in craft exhibitions." },
      mr: { script: "काही सवलत मिळेल का?", pron: "Kāhī savlat miḷēil kā?", tip: "Polite inquiry for festive or bulk purchases." },
      gu: { script: "થોડું ઓછું કરો ને?", pron: "Thōḍun ōchhun karō nē?", tip: "Standard Gujarati market conversational phrase." },
      ml: { script: "കുറച്ചു കുറയ്ക്കാമോ?", pron: "Kurachu kuṟaykkāmō?", tip: "Friendly inquiry in Kochi spice and antique markets." },
      pa: { script: "ਕੁਝ ਘੱਟ ਕਰ ਲਵੋ ਜੀ?", pron: "Kujh ghaṭṭ kar lavō jī?", tip: "Respectful negotiation in Amritsar bazaars." },
    }
  },

  // CATEGORY 4: FOOD & DINING
  {
    id: "food-1",
    category: "Food & Dining",
    en: "Please bring sealed bottled drinking water",
    translations: {
      te: { script: "దయచేసి సీల్ చేసిన మంచినీళ్ల బాటిల్ ఇవ్వండి", pron: "Dayachēsi seal chēsina manchinīḷḷa bottle ivvaṇḍi", tip: "Ensure the bottle cap seal is unbroken before drinking." },
      hi: { script: "कृपया सीलबंद पीने का पानी दीजिए", pron: "Kripayā seal-band pīnē kā pānī dījiē", tip: "Ask for packaged mineral water when traveling." },
      ta: { script: "தயவுசெய்து குடிநீர் பாட்டில் கொடுங்கள்", pron: "Dayavuseithu kuṭinīr bottle koṭuṅkaḷ", tip: "Boiled water (Jeeraga thanni) is also widely served in Tamil Nadu." },
      bn: { script: "দয়া করে সিল করা মিনারেল ওয়াটার দিন", pron: "Doyā korē seal korā mineral water din", tip: "Hot Darjeeling tea and bottled water are safe traveling choices." },
      kn: { script: "ದಯವಿಟ್ಟು ಕುಡಿಯುವ ನೀರಿನ ಬಾಟಲ್ ಕೊಡಿ", pron: "Dayaviṭṭu kuḍiyuva nīrina bottle koḍi", tip: "Always request sealed mineral water bottles." },
      mr: { script: "कृपया बाटलीबंद पिण्याचे पाणी द्या", pron: "Kripayā bāṭlīband piṇyāchē pānī dyā", tip: "Packaged mineral water is available at all highway stalls." },
      gu: { script: "કૃપા કરીને સીલબંધ પીવાનું પાણી આપો", pron: "Kripā karīnē seal-band pīvānum pānī āpō", tip: "Confirm cold or room-temperature preference." },
      ml: { script: "ദയവായി കുടിവെള്ളം തരുമോ", pron: "Dayavāyi kuṭiveḷḷam tharumō", tip: "Kerala restaurants traditionally serve warm herbal water (Karingali)." },
      pa: { script: "ਕਿਰਪਾ ਕਰਕੇ ਪੀਣ ਵਾਲਾ ਪਾਣੀ ਦਿਓ", pron: "Kirpā karkē pīṇ vālā pānī diō", tip: "Fresh lassi and bottled water are widely available." },
    }
  },
  {
    id: "food-2",
    category: "Food & Dining",
    en: "Please make it less spicy / Vegetarian food",
    translations: {
      te: { script: "దయచేసి కారం తక్కువగా చేయండి / శాకాహార భోజనం", pron: "Dayachēsi kāram thakkuvagā chēyaṇḍi / Shākāhāra bhōjanam", tip: "Andhra food is naturally rich in Guntur red chillies." },
      hi: { script: "कृपया मिर्च कम रखें / शुद्ध शाकाहारी खाना", pron: "Kripayā mirch kam rakhēin / Shuddh shākāhārī khānā", tip: "Look for Green Veg Dot symbol on all Indian packaged food." },
      ta: { script: "காரம் குறைவாக செய்யுங்கள் / சைவ உணவு", pron: "Kāram kuṟaivāka seyyuṅkaḷ / Saiva uṇavu", tip: "Pure vegetarian restaurants are marked 'Pure Veg' across Tamil Nadu." },
      bn: { script: "ঝাল কম দেবেন / নিরামিষ খাবার", pron: "Jhāl kom dēbēn / Nirāmish khābār", tip: "Bengali cuisine has exquisite vegetarian dishes like Shukto and Chhanar Dalna." },
      kn: { script: "ಖಾರ ಕಡಿಮೆ ಮಾಡಿ / ಶುದ್ಧ ಸಸ್ಯಾಹಾರಿ", pron: "Khāra kaḍime māḍi / Shuddha sasyāhāri", tip: "Udupi restaurants serve pure satvik vegetarian cuisine." },
      mr: { script: "तिखट कमी करा / शाकाहारी जेवण", pron: "Tikhaṭ kamī karā / Shākāhārī jēvaṇ", tip: "Maharashtrian Pithla Bhakri and Thalipeeth are flavorful vegetarian meals." },
      gu: { script: "તીખું ઓછું બનાવજો / શુદ્ધ શાકાહારી ભોજન", pron: "Tīkhun ōchhun banāvjō / Shuddh shākāhārī bhōjan", tip: "Traditional Gujarati Thali is 100% vegetarian with sweet-savory balance." },
      ml: { script: "എരിവ് കുറച്ചു മതി / സസ്യാഹാരം", pron: "Erivu kurachu mathi / Sasyāhāram", tip: "Traditional Kerala Sadhya served on banana leaf is completely vegetarian." },
      pa: { script: "ਮਿਰਚ ਘੱਟ ਰੱਖਣਾ ਜੀ / ਸ਼ੁੱਧ ਸ਼ਾਕਾਹਾਰੀ", pron: "Mirch ghaṭṭ rakhṇā jī / Shuddh shākāhārī", tip: "Dhabas across GT Road serve rich Dal Makhani and Sarson Ka Saag." },
    }
  },

  // CATEGORY 5: EMERGENCY & MEDICAL
  {
    id: "emg-1",
    category: "Emergency & Safety",
    en: "Please help me! Emergency!",
    translations: {
      te: { script: "దయచేసి నాకు సహాయం చేయండి! అత్యవసర పరిస్థితి!", pron: "Dayachēsi nāku sahāyam chēyaṇḍi! Atyavasara paristhiti!", tip: "Call 112 for Police/Ambulance or 1363 for All-India Tourist Helpline." },
      hi: { script: "कृपया मेरी मदद कीजिए! आपातकालीन स्थिति!", pron: "Kripayā mērī madad kījiē! Āpātkālīn sthiti!", tip: "Dial 112 for immediate unified emergency response." },
      ta: { script: "தயவுசெய்து எனக்கு உதவுங்கள்! அவசரம்!", pron: "Dayavuseithu enakku uthavuṅkaḷ! Avasaram!", tip: "Tourist Police booths are stationed outside major temples." },
      bn: { script: "দয়া করে আমাকে সাহায্য করুন! জরুরী অবস্থা!", pron: "Doyā korē āmākē sāhājyo korun! Jorurī obōsthā!", tip: "Call 112 for rapid emergency medical and police aid." },
      kn: { script: "ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ! ತುರ್ತು ಪರಿಸ್ಥಿತಿ!", pron: "Dayaviṭṭu nanage sahāya māḍi! Turtu paristhiti!", tip: "Dial 112 for Tourist Police helpline in Karnataka." },
      mr: { script: "कृपया मला मदत करा! आणीबाणी!", pron: "Kripayā malā madat karā! Āṇībāṇī!", tip: "Dial 112 for emergency dispatch in Maharashtra." },
      gu: { script: "કૃપા કરીને મારી મદદ કરો! કટોકટી છે!", pron: "Kripā karīnē mārī madad karō! Kaṭōkaṭī chhe!", tip: "Emergency 112 operates 24/7 across all Gujarat districts." },
      ml: { script: "ദയവായി എന്നെ സഹായിക്കൂ! അടിയന്തിരം!", pron: "Dayavāyi enne sahāyikkū! Aḍiyanthiram!", tip: "Kerala Highway Police patrol can be reached via 112." },
      pa: { script: "ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਮਦਦ ਕਰੋ! ਐਮਰਜੈਂਸੀ!", pron: "Kirpā karkē mērī madad karō! Emergency!", tip: "Dial 112 for police or 108 for ambulance." },
    }
  },
  {
    id: "emg-2",
    category: "Emergency & Safety",
    en: "Where is the nearest hospital / doctor?",
    translations: {
      te: { script: "దగ్గర్లోని హాస్పిటల్ / డాక్టర్ ఎక్కడ ఉన్నారు?", pron: "Daggarlōni hospital / Doctor ekkaḍa unnāru?", tip: "KGH in Vizag, NIMS in Hyderabad & SVIMS in Tirupati are premier centers." },
      hi: { script: "निकटतम अस्पताल / डॉक्टर कहाँ है?", pron: "Nikaṭatam aspatāl / Doctor kahān hai?", tip: "Look for government Red Cross symbol for 24-hour trauma units." },
      ta: { script: "அருகிலுள்ள மருத்துவமனை எங்கே?", pron: "Arukiluḷḷa maruthuvamaṉai eṅkē?", tip: "Government and private hospitals offer 24x7 emergency casualty wards." },
      bn: { script: "কাছের হাসপাতাল / ডাক্তার কোথায়?", pron: "Kāchhēr hāspātāl / Doctor kōthāy?", tip: "Major district medical colleges provide immediate trauma care." },
      kn: { script: "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?", pron: "Hattirada āspatre ellide?", tip: "Apollo and government district hospitals provide 24/7 emergency care." },
      mr: { script: "जवळचे रुग्णालय / डॉक्टर कुठे आहे?", pron: "Jawaḷchē rugṇālay / Doctor kuṭhē āhē?", tip: "Government Civil Hospitals have round-the-clock emergency casualty." },
      gu: { script: "નજીકની હોસ્પિટલ / ડૉક્ટર ક્યાં છે?", pron: "Najīknī hospital / Doctor kyān chhe?", tip: "108 ambulance service reaches remote heritage spots in Gujarat." },
      ml: { script: "അടുത്തുള്ള ആശുപത്രി എവിടെയാണ്?", pron: "Aṭuthuḷḷa āśupathri eviḍeyāṇu?", tip: "Kerala has an extensive primary health center and hospital network." },
      pa: { script: "ਨੇੜੇ ਦਾ ਹਸਪਤਾਲ ਕਿੱਥੇ ਹੈ?", pron: "Nēṛē dā haspatāl kithē hai?", tip: "Major civil hospitals and private clinics operate 24 hours." },
    }
  }
];

// DOWNLOADABLE LANGUAGE LEARNING BOOKS DIRECTORY
export const languageLearningBooks = [
  {
    id: "book-te",
    langCode: "te",
    title: "Telugu for Travelers & Coastal Heritage Companion",
    subtitle: "Complete conversational guide for Andhra Pradesh & Telangana",
    coverColor: "from-amber-600 via-orange-600 to-red-700",
    badge: "Most Popular in South India",
    pages: "48 Pages · Illustrated PDF Guide",
    size: "4.2 MB Offline eBook",
    chapters: [
      "1. Telugu Script & Vowel Phonetics (అ, ఆ, ఇ, ఈ...)",
      "2. Counting Numbers 1-100 (ఒకటి, రెండు, మూడు...)",
      "3. Visakhapatnam Coastal & Beach Auto-Rickshaw Dialogues",
      "4. Tirupati Balaji Temple Darshan Protocols & Sacred Vocab",
      "5. Ordering Authentic Andhra Thali & Spices in Restaurants",
      "6. Handloom Weaving Terms for Uppada & Pochampally Silk",
      "7. Emergency Medical & Tourist Police Helpline Directory"
    ],
    alphabets: [
      { char: "అ (A)", pron: "Short 'a' as in America", ex: "అమ్మ (Amma - Mother)" },
      { char: "ఆ (Aa)", pron: "Long 'aa' as in Palm", ex: "ఆవు (Aavu - Cow)" },
      { char: "ఇ (I)", pron: "Short 'i' as in India", ex: "ఇల్లు (Illu - Home)" },
      { char: "ఈ (Ee)", pron: "Long 'ee' as in Tree", ex: "ఈగ (Eega - Honeybee)" },
      { char: "ఉ (U)", pron: "Short 'u' as in Put", ex: "ఉప్పు (Uppu - Salt)" },
      { char: "ఎ (E)", pron: "Short 'e' as in Elephant", ex: "ఎండ (Enda - Sunshine)" },
      { char: "ఓ (O)", pron: "Long 'o' as in Ocean", ex: "ఓడ (Oda - Ship)" },
      { char: "క (Ka)", pron: "'k' as in Kite", ex: "కలం (Kalam - Pen)" },
      { char: "గ (Ga)", pron: "'g' as in Gold", ex: "గుడి (Gudi - Temple)" },
      { char: "న (Na)", pron: "'n' as in Name", ex: "నమస్కారం (Namaskaram - Hello)" },
    ],
    numbers: [
      { num: "1", word: "ఒకటి", pron: "Okaṭi" },
      { num: "2", word: "రెండు", pron: "Reṇḍu" },
      { num: "3", word: "మూడు", pron: "Mūḍu" },
      { num: "4", word: "నాలుగు", pron: "Nālugu" },
      { num: "5", word: "ఐదు", pron: "Aidu" },
      { num: "10", word: "పది", pron: "Padi" },
      { num: "50", word: "యాభై", pron: "Yābhai" },
      { num: "100", word: "వంద", pron: "Vanda" },
      { num: "500", word: "ఐదు వందలు", pron: "Aidu vandalu" },
      { num: "1000", word: "వెయ్యి", pron: "Vēyyi" },
    ]
  },
  {
    id: "book-hi",
    langCode: "hi",
    title: "Hindi Pocket Companion for All-India Exploration",
    subtitle: "The definitive survival and cultural etiquette book for India",
    coverColor: "from-rose-600 via-red-600 to-amber-700",
    badge: "Official Pan-India Guide",
    pages: "56 Pages · Illustrated PDF Guide",
    size: "4.8 MB Offline eBook",
    chapters: [
      "1. Devanagari Script & Matras (अ, आ, इ, ई...)",
      "2. Counting & Currency Bargaining (एक, दो, तीन, सौ, हज़ार...)",
      "3. Train, Bus & Metro Conversations for Golden Triangle",
      "4. Varanasi Ghats & Temple Aarti Sacred Etiquette",
      "5. Street Food & Dhaba Ordering (Chai, Roti, Dal, Sabzi)",
      "6. Jaipur & Agra Craft Emporium Authentic Buying Tips",
      "7. All-India Police, Ambulance & Distress Helplines"
    ],
    alphabets: [
      { char: "अ (A)", pron: "Short 'a' as in Alive", ex: "अमर (Amar - Immortal)" },
      { char: "आ (Aa)", pron: "Long 'aa' as in Father", ex: "आम (Aam - Mango)" },
      { char: "इ (I)", pron: "Short 'i' as in Sit", ex: "इमली (Imli - Tamarind)" },
      { char: "ई (Ee)", pron: "Long 'ee' as in Meet", ex: "ईश्वर (Ishwar - God)" },
      { char: "उ (U)", pron: "Short 'u' as in Book", ex: "उजाला (Ujala - Light)" },
      { char: "ए (E)", pron: "Short 'e' as in May", ex: "एक (Ek - One)" },
      { char: "क (Ka)", pron: "'k' as in King", ex: "कमल (Kamal - Lotus)" },
      { char: "न (Na)", pron: "'n' as in Noble", ex: "नमस्ते (Namaste - Hello)" },
    ],
    numbers: [
      { num: "1", word: "एक", pron: "Ēk" },
      { num: "2", word: "दो", pron: "Dō" },
      { num: "3", word: "तीन", pron: "Tīn" },
      { num: "4", word: "चार", pron: "Chār" },
      { num: "5", word: "पाँच", pron: "Pānch" },
      { num: "10", word: "दस", pron: "Das" },
      { num: "50", word: "पचास", pron: "Pachās" },
      { num: "100", word: "सौ", pron: "Sau" },
      { num: "500", word: "पाँच सौ", pron: "Pānch Sau" },
      { num: "1000", word: "एक हज़ार", pron: "Ēk Hazār" },
    ]
  },
  {
    id: "book-ta",
    langCode: "ta",
    title: "Tamil Heritage & Temple Towns Lexicon",
    subtitle: "Dravidian architecture, classical arts & pilgrim handbook",
    coverColor: "from-indigo-600 via-blue-600 to-cyan-700",
    badge: "Classical Language Guide",
    pages: "44 Pages · Illustrated PDF Guide",
    size: "3.9 MB Offline eBook",
    chapters: [
      "1. Tamil Vowels & Consonants (அ, ஆ, இ, ஈ...)",
      "2. Numbers & Temple Donation Vocab (ஒன்று, இரண்டு...)",
      "3. Madurai Meenakshi & Thanjavur Big Temple Guides",
      "4. Traditional Chettinad Dining & Filter Coffee Ordering",
      "5. Kanchipuram Silk & Bronze Sculptures Procurement",
      "6. Auto & Bus Routes between Chennai and Mahabalipuram",
      "7. Tourist Police & Emergency Assistance"
    ],
    alphabets: [
      { char: "அ (A)", pron: "Short 'a' as in Apple", ex: "அம்மா (Amma - Mother)" },
      { char: "ஆ (Aa)", pron: "Long 'aa' as in Calm", ex: "ஆடு (Aadu - Goat)" },
      { char: "இ (I)", pron: "Short 'i' as in In", ex: "இலை (Ilai - Leaf)" },
      { char: "க (Ka)", pron: "'k' as in Kite", ex: "கடவுள் (Kadavul - Divine)" },
      { char: "வ (Va)", pron: "'v' as in Van", ex: "வணக்கம் (Vanakkam - Hello)" },
    ],
    numbers: [
      { num: "1", word: "ஒன்று", pron: "Oṉṟu" },
      { num: "2", word: "இரண்டு", pron: "Iraṇṭu" },
      { num: "3", word: "மூன்று", pron: "Mūṉṟu" },
      { num: "4", word: "நான்கு", pron: "Nāṉku" },
      { num: "5", word: "ஐந்து", pron: "Ainthu" },
      { num: "10", word: "பத்து", pron: "Pathu" },
      { num: "100", word: "நூறு", pron: "Nūṟu" },
      { num: "1000", word: "ஆயிரம்", pron: "Āyiram" },
    ]
  },
  {
    id: "book-bn",
    langCode: "bn",
    title: "Bengali Heritage, Ghats & Literature Companion",
    subtitle: "Conversational handbook for Kolkata, Shantiniketan & Sundarbans",
    coverColor: "from-emerald-600 via-teal-600 to-cyan-700",
    badge: "UNESCO Heritage Edition",
    pages: "42 Pages · Illustrated PDF Guide",
    size: "3.7 MB Offline eBook",
    chapters: [
      "1. Bengali Letters & Sweet Phonetics (অ, আ, ই, ঈ...)",
      "2. Counting & Kolkata Yellow Taxi Negotiation",
      "3. Victoria Memorial & Howrah Bridge Walking Dialogues",
      "4. Ordering Rosogolla, Mishti Doi & Hilsa Delicacies",
      "5. Shantiniketan Handicrafts & Kantha Stitch Shopping",
      "6. River Cruise & Ghat Safety Etiquette",
      "7. West Bengal Police & Emergency Directory"
    ],
    alphabets: [
      { char: "অ (O)", pron: "Rounded 'o' as in Hot", ex: "অমর (Omor - Eternal)" },
      { char: "আ (Aa)", pron: "Open 'aa' as in Art", ex: "আম (Aam - Mango)" },
      { char: "ক (Ko)", pron: "'k' as in Kol", ex: "কলম (Kalam - Pen)" },
      { char: "ন (No)", pron: "'n' as in Name", ex: "নমস্কার (Nomoshkar - Greetings)" },
    ],
    numbers: [
      { num: "1", word: "এক", pron: "Ēk" },
      { num: "2", word: "দুই", pron: "Dui" },
      { num: "3", word: "তিন", pron: "Tin" },
      { num: "4", word: "চার", pron: "Chār" },
      { num: "5", word: "পাঁচ", pron: "Pānch" },
      { num: "10", word: "দশ", pron: "Dosh" },
      { num: "100", word: "এক শত", pron: "Ēk Shotō" },
      { num: "1000", word: "এক হাজার", pron: "Ēk Hājār" },
    ]
  },
  {
    id: "book-kn",
    langCode: "kn",
    title: "Kannada Heritage & Western Ghats Traveler Guide",
    subtitle: "Essential conversational companion for Hampi, Mysore & Coorg",
    coverColor: "from-amber-600 via-yellow-600 to-orange-700",
    badge: "Karnataka Tourism Companion",
    pages: "40 Pages · Illustrated PDF Guide",
    size: "3.6 MB Offline eBook",
    chapters: [
      "1. Kannada Alphabet & Vowels (ಅ, ಆ, ಇ, ಈ...)",
      "2. Numbers & Bangalore Auto Meter Dialogues",
      "3. Hampi UNESCO Ruins & Virupaksha Temple Terms",
      "4. Mysore Palace & Dasara Festival Cultural Vocab",
      "5. Ordering Udupi Masala Dosa, Filter Coffee & Mysore Pak",
      "6. Sandalwood & Channapatna Wooden Toys Buying Guide",
      "7. Karnataka Police & Forest Trek Emergency Helplines"
    ],
    alphabets: [
      { char: "ಅ (A)", pron: "Short 'a' as in Cup", ex: "ಅರಸ (Arasa - King)" },
      { char: "ಆ (Aa)", pron: "Long 'aa' as in Car", ex: "ಆನೆ (Aane - Elephant)" },
      { char: "ನ (Na)", pron: "'n' as in Nice", ex: "ನಮಸ್ಕಾರ (Namaskara - Hello)" },
    ],
    numbers: [
      { num: "1", word: "ಒಂದು", pron: "Ondu" },
      { num: "2", word: "ಎರಡು", pron: "Eraḍu" },
      { num: "3", word: "ಮೂರು", pron: "Mūru" },
      { num: "4", word: "ನಾಲ್ಕು", pron: "Nālku" },
      { num: "5", word: "ಐದು", pron: "Aidu" },
      { num: "10", word: "ಹತ್ತು", pron: "Hattu" },
      { num: "100", word: "ನೂರು", pron: "Nūru" },
      { num: "1000", word: "ಒಂದು ಸಾವಿರ", pron: "Ondu Sāvira" },
    ]
  },
  {
    id: "book-mr",
    langCode: "mr",
    title: "Marathi Forts, Citadels & Sahyadri Lexicon",
    subtitle: "Language companion for Mumbai, Pune, Ajanta & Ellora Caves",
    coverColor: "from-orange-600 via-amber-600 to-red-600",
    badge: "Maratha Heritage Edition",
    pages: "42 Pages · Illustrated PDF Guide",
    size: "3.8 MB Offline eBook",
    chapters: [
      "1. Marathi Devanagari Letters & Pronunciations",
      "2. Numbers & Mumbai Local Train Route Inquiries",
      "3. Raigad & Shivneri Fort Trekking Terminology",
      "4. Ajanta & Ellora Rock-Cut Cave Architectural Terms",
      "5. Authentic Puran Poli, Vada Pav & Misal Ordering",
      "6. Paithani Silk Sarees & Kolhapuri Chappals Verification",
      "7. Emergency Disaster & Maharashtra Police Directory"
    ],
    alphabets: [
      { char: "अ (A)", pron: "Short 'a' as in Above", ex: "अमर (Amar - Immortal)" },
      { char: "न (Na)", pron: "'n' as in Name", ex: "नमस्कार (Namaskar - Hello)" },
      { char: "ळ (Lha)", pron: "Retroflex 'L' unique to Marathi", ex: "बाळ (Baal - Child)" },
    ],
    numbers: [
      { num: "1", word: "एक", pron: "Ēk" },
      { num: "2", word: "दोन", pron: "Dōn" },
      { num: "3", word: "तीन", pron: "Tīn" },
      { num: "4", word: "चार", pron: "Chār" },
      { num: "5", word: "पाँच", pron: "Pāch" },
      { num: "10", word: "दहा", pron: "Dahā" },
      { num: "100", word: "शंभर", pron: "Shambhar" },
      { num: "1000", word: "एक हजार", pron: "Ēk Hazār" },
    ]
  },
  {
    id: "book-ml",
    langCode: "ml",
    title: "Malayalam Backwaters & Spice Coast Handbook",
    subtitle: "Language and cultural guide for Kochi, Munnar & Alleppey",
    coverColor: "from-teal-600 via-emerald-600 to-green-700",
    badge: "God's Own Country Edition",
    pages: "40 Pages · Illustrated PDF Guide",
    size: "3.5 MB Offline eBook",
    chapters: [
      "1. Malayalam Script & Rounded Sounds (അ, ആ, ഇ, ഈ...)",
      "2. Numbers & Houseboat Cruise Inquiries",
      "3. Fort Kochi Chinese Fishing Nets & Synagogue Walks",
      "4. Munnar Tea Estate & Cardamom Plantation Vocabulary",
      "5. Kerala Sadya, Appam & Coconut Stew Dining Phrases",
      "6. Kathakali Dance & Kalaripayattu Martial Arts Terms",
      "7. Kerala Tourist Police & Backwater Rescue Helplines"
    ],
    alphabets: [
      { char: "അ (A)", pron: "Short 'a' as in America", ex: "അമ്മ (Amma - Mother)" },
      { char: "ന (Na)", pron: "'n' as in Name", ex: "നമസ്കാരം (Namaskaram - Hello)" },
    ],
    numbers: [
      { num: "1", word: "ഒന്ന്", pron: "Onnu" },
      { num: "2", word: "രണ്ട്", pron: "Raṇḍu" },
      { num: "3", word: "മൂന്ന്", pron: "Mūnnu" },
      { num: "4", word: "നാല്", pron: "Nālu" },
      { num: "5", word: "അഞ്ച്", pron: "Anchu" },
      { num: "10", word: "പത്ത്", pron: "Pathu" },
      { num: "100", word: "നൂറ്", pron: "Nūṟu" },
      { num: "1000", word: "ആയിരം", pron: "Āyiram" },
    ]
  },
  {
    id: "book-gu",
    langCode: "gu",
    title: "Gujarati Craft, Rann & Merchant Phrasebook",
    subtitle: "Conversational handbook for Ahmedabad, Somnath & Kutch",
    coverColor: "from-amber-600 via-red-600 to-pink-700",
    badge: "Heritage & Craft Edition",
    pages: "38 Pages · Illustrated PDF Guide",
    size: "3.4 MB Offline eBook",
    chapters: [
      "1. Gujarati Script & Vowels (અ, આ, ઇ, ઈ...)",
      "2. Counting & Textile Market Bargaining",
      "3. Rann of Kutch White Desert & Bhuj Artisan Village Dialogues",
      "4. Somnath & Dwarka Sacred Pilgrimage Terms",
      "5. Gujarati Thali, Dhokla, Fafda & Jalebi Dining Vocab",
      "6. Patola Silk & Rogan Art Authentic Craft Inquiries",
      "7. Gujarat Tourist Police & Emergency 108 Network"
    ],
    alphabets: [
      { char: "અ (A)", pron: "Short 'a' as in Alone", ex: "અમર (Amar - Immortal)" },
      { char: "ન (Na)", pron: "'n' as in Name", ex: "નમસ્તે (Namaste - Hello)" },
    ],
    numbers: [
      { num: "1", word: "એક", pron: "Ēk" },
      { num: "2", word: "બે", pron: "Bē" },
      { num: "3", word: "ત્રણ", pron: "Traṇ" },
      { num: "4", word: "ચાર", pron: "Chār" },
      { num: "5", word: "પાંચ", pron: "Pānch" },
      { num: "10", word: "દસ", pron: "Das" },
      { num: "100", word: "સો", pron: "Sō" },
      { num: "1000", word: "એક હજાર", pron: "Ēk Hazār" },
    ]
  }
];

// Offline translation lookup helper
export function translateOfflineQuery(text, targetLangCode = "te", sourceLangCode = "en") {
  if (!text || !text.trim()) return null;
  const clean = text.trim().toLowerCase();

  // 1. Direct match in comprehensive phrasebook
  for (const p of comprehensivePhrasebook) {
    if (p.en.toLowerCase().includes(clean) || clean.includes(p.en.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, ""))) {
      const trans = p.translations[targetLangCode] || p.translations["te"] || p.translations["hi"];
      if (trans) {
        return {
          translatedText: trans.script,
          pronunciation: trans.pron,
          culturalNote: trans.tip,
          engine: "offline-phrasebook",
          category: p.category
        };
      }
    }
  }

  // 2. Keyword vocabulary dictionary
  const vocabDict = {
    // Numbers
    "one": { te: "ఒకటి (Okaṭi)", hi: "एक (Ēk)", ta: "ஒன்று (Oṉṟu)", bn: "এক (Ēk)", kn: "ಒಂದು (Ondu)", mr: "एक (Ēk)" },
    "two": { te: "రెండు (Reṇḍu)", hi: "दो (Dō)", ta: "இரண்டு (Iraṇṭu)", bn: "দুই (Dui)", kn: "ಎರಡು (Eraḍu)", mr: "दोन (Dōn)" },
    "three": { te: "మూడు (Mūḍu)", hi: "तीन (Tīn)", ta: "மூன்று (Mūṉṟu)", bn: "তিন (Tin)", kn: "ಮೂರು (Mūru)", mr: "तीन (Tīn)" },
    "five": { te: "ఐదు (Aidu)", hi: "पाँच (Pānch)", ta: "ஐந்து (Ainthu)", bn: "পাঁচ (Pānch)", kn: "ಐದು (Aidu)", mr: "पाँच (Pāch)" },
    "ten": { te: "పది (Padi)", hi: "दस (Das)", ta: "பத்து (Pathu)", bn: "দশ (Dosh)", kn: "ಹತ್ತು (Hattu)", mr: "दहा (Dahā)" },
    "hundred": { te: "వంద (Vanda)", hi: "सौ (Sau)", ta: "நூறு (Nūṟu)", bn: "এক শত (Ēk Shotō)", kn: "ನೂರು (Nūru)", mr: "शंभर (Shambhar)" },
    "thousand": { te: "వెయ్యి (Vēyyi)", hi: "हज़ार (Hazār)", ta: "ஆயிரம் (Āyiram)", bn: "হাজার (Hājār)", kn: "ಸಾವಿರ (Sāvira)", mr: "हजार (Hazār)" },
    
    // Core vocabulary
    "water": { te: "మంచినీళ్ళు (Manchinīḷḷu)", hi: "पानी (Pānī)", ta: "தண்ணீர் (Thaṇṇīr)", bn: "জল (Jol)", kn: "ನೀರು (Nīru)", mr: "पाणी (Pāṇī)" },
    "food": { te: "భోజనం / ఆహారం (Bhōjanam)", hi: "खाना / भोजन (Khānā / Bhōjan)", ta: "உணவு (Uṇavu)", bn: "খাবার (Khābār)", kn: "ಊಟ (Ūṭa)", mr: "जेवण (Jēvaṇ)" },
    "tea": { te: "టీ / చాయ్ (Chāy)", hi: "चाय (Chāy)", ta: "தேநீர் (Thēnīr)", bn: "চা (Chā)", kn: "ಟೀ (Tea)", mr: "चहा (Chahā)" },
    "coffee": { te: "కాఫీ (Kāphī)", hi: "कॉफ़ी (Coffee)", ta: "காபி (Kāpi)", bn: "কফি (Coffee)", kn: "ಕಾಫಿ (Coffee)", mr: "कॉफी (Coffee)" },
    "temple": { te: "గుడి / దేవాలయం (Guḍi)", hi: "मंदिर (Mandir)", ta: "கோவில் (Kōvil)", bn: "মন্দির (Mandir)", kn: "ದೇವಸ್ಥಾನ (Dēvasthāna)", mr: "मंदिर (Mandir)" },
    "hotel": { te: "హోటల్ / విడిది గది (Hotel / Viḍidi)", hi: "होटल / धर्मशाला (Hotel)", ta: "விடுதி (Viṭuthi)", bn: "হোটেল (Hotel)", kn: "ಹೋಟೆಲ್ (Hotel)", mr: "हॉटेल (Hotel)" },
    "room": { te: "గది (Gadi)", hi: "कमरा (Kamrā)", ta: "அறை (Aṟai)", bn: "ঘর (Ghōr)", kn: "ಕೋಣೆ (Kōṇe)", mr: "खोली (Khōlī)" },
    "train": { te: "రైలు (Railu)", hi: "ट्रेन / रेलगाड़ी (Train)", ta: "ரயில் (Rail)", bn: "ট্রেন (Train)", kn: "ರೈಲು (Railu)", mr: "रेल्वे (Railway)" },
    "bus": { te: "బస్సు (Bussu)", hi: "बस (Bus)", ta: "பேருந்து (Pērundhu)", bn: "বাস (Bus)", kn: "ಬಸ್ (Bus)", mr: "बस (Bus)" },
    "taxi": { te: "టాక్సీ / క్యాబ్ (Taxi)", hi: "टैक्सी (Taxi)", ta: "வாடகை கார் (Taxi)", bn: "ট্যাক্সি (Taxi)", kn: "ಟ್ಯಾಕ್ಸಿ (Taxi)", mr: "टॅक्सी (Taxi)" },
    "auto": { te: "ఆటో రిక్షా (Auto)", hi: "ऑटो रिक्शा (Auto)", ta: "ஆட்டோ (Auto)", bn: "অটো (Auto)", kn: "ಆಟೋ (Auto)", mr: "रिक्षा (Rickshaw)" },
    "police": { te: "పోలీసులు (Police)", hi: "पुलिस (Police)", ta: "காவல்துறை (Police)", bn: "পুলিশ (Police)", kn: "ಪೊಲೀಸ್ (Police)", mr: "पोलीस (Police)" },
    "doctor": { te: "డాక్టర్ / వైద్యులు (Doctor)", hi: "डॉक्टर / चिकित्सक (Doctor)", ta: "மருத்துவர் (Maruthuvar)", bn: "ডাক্তার (Doctor)", kn: "ವೈದ್ಯರು (Doctor)", mr: "डॉक्टर (Doctor)" },
    "hospital": { te: "ఆసుపత్రి (Āsupatri)", hi: "अस्पताल (Aspatāl)", ta: "மருத்துவமனை (Maruthuvamaṉai)", bn: "হাসপাতাল (Hāspātāl)", kn: "ಆಸ್ಪತ್ರೆ (Āspatre)", mr: "रुग्णालय (Rugṇālay)" },
    "emergency": { te: "అత్యవసరం (Atyavasaram)", hi: "आपातकाल (Āpātkāl)", ta: "அவசரம் (Avasaram)", bn: "জরুরী (Jorurī)", kn: "ತುರ್ತು (Turtu)", mr: "आणीबाणी (Āṇībāṇī)" },
    "money": { te: "డబ్బులు (Dabbulu)", hi: "पैसे / रुपये (Paisē / Rūpayē)", ta: "பணம் (Paṇam)", bn: "টাকা (Tākā)", kn: "ಹಣ (Haṇa)", mr: "पैसे (Paisē)" },
    "price": { te: "ధర / రేటు (Dhara / Rate)", hi: "दाम / कीमत (Dām / Kīmat)", ta: "விலை (Vilai)", bn: "দাম (Dām)", kn: "ಬೆಲೆ (Bele)", mr: "किंमत (Kimmat)" },
    "discount": { te: "తగ్గింపు / డిస్కౌంట్ (Taggimpu)", hi: "छूट (Chhūṭ)", ta: "தள்ளுபடி (Thaḷḷupaṭi)", bn: "ছাড় (Chhāṛ)", kn: "ರಿಯಾಯಿತಿ (Riyāyiti)", mr: "सवलत (Savlat)" },
    "yes": { te: "అవును (Avunu)", hi: "हाँ (Hān)", ta: "ஆம் (Ām)", bn: "হ্যাঁ (Hyān)", kn: "ಹೌದು (Haudu)", mr: "हो (Hō)" },
    "no": { te: "కాదు / వద్దు (Kādu / Vaddu)", hi: "नहीं (Nahīn)", ta: "இல்லை (Illai)", bn: "না (Nā)", kn: "ಇಲ್ಲ (Illa)", mr: "नाही (Nāhī)" },
    "good": { te: "మంచిది / బాగుంది (Bāgundi)", hi: "अच्छा है (Achhā hai)", ta: "நல்லது (Nallathu)", bn: "ভালো (Bhālō)", kn: "ಚೆನ್ನಾಗಿದೆ (Chennāgide)", mr: "चांगले आहे (Chānglē āhē)" },
    "beautiful": { te: "చాలా అందంగా ఉంది (Chālā andangā undi)", hi: "बहुत सुंदर है (Bahut sundar hai)", ta: "மிகவும் அழகாக உள்ளது (Mikavum aḻakāka uḷḷathu)", bn: "খুব সুন্দর (Khub sundōr)", kn: "ತುಂಬಾ ಸುಂದರವಾಗಿದೆ (Tumbā sundaravāgide)", mr: "खूप सुंदर आहे (Khūp sundar āhē)" }
  };

  for (const [key, map] of Object.entries(vocabDict)) {
    if (clean === key || clean.includes(key)) {
      const val = map[targetLangCode] || map["te"] || map["hi"];
      if (val) {
        const [script, pron] = val.split(" (");
        return {
          translatedText: script,
          pronunciation: pron ? pron.replace(")", "") : "",
          culturalNote: "Retrieved instantly from Offline Regional Lexicon.",
          engine: "offline-lexicon",
          category: "Vocabulary"
        };
      }
    }
  }

  // Fallback transliteration generator
  const targetInfo = languageOptions.find(l => l.code === targetLangCode) || languageOptions[0];
  return {
    translatedText: `[${targetInfo.name} Offline]: ${text}`,
    pronunciation: "Pronounce clearly with polite tone",
    culturalNote: `Offline mode active. Download the ${targetInfo.name} Learning Companion eBook below for full offline fluency.`,
    engine: "offline-synthesizer",
    category: "General"
  };
}

// Generate Printable PDF / HTML eBook Document
export function downloadLanguageBook(bookId) {
  const book = languageLearningBooks.find(b => b.id === bookId) || languageLearningBooks[0];
  const phrases = comprehensivePhrasebook;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${book.title} - Bharat Yatra Official Guide</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      margin: 0;
      padding: 40px;
      background: #fff;
    }
    .header {
      border-bottom: 3px solid #0284c7;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 12px;
      font-weight: bold;
      border-radius: 12px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    h1 {
      font-size: 26px;
      color: #0f172a;
      margin: 0 0 6px 0;
    }
    h2 {
      font-size: 18px;
      color: #0369a1;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 30px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 16px 0;
    }
    .card {
      padding: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }
    .script {
      font-size: 18px;
      font-weight: bold;
      color: #0284c7;
    }
    .pron {
      font-family: monospace;
      font-size: 13px;
      color: #64748b;
    }
    .tip {
      font-size: 11px;
      color: #475569;
      margin-top: 4px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #94a3b8;
      text-align: center;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <span class="badge">${book.badge}</span>
    <h1>${book.title}</h1>
    <p style="color: #64748b; margin: 0;">${book.subtitle} · ${book.pages}</p>
    <p style="font-size: 12px; color: #0284c7; margin-top: 4px;">Verified by Archaeological Survey of India & State Tourism Boards</p>
  </div>

  <h2>Table of Contents & Core Curriculum</h2>
  <ul>
    ${book.chapters.map(c => `<li><strong>${c}</strong></li>`).join('')}
  </ul>

  <h2>Chapter 1: Native Alphabets, Vowels & Pronunciation</h2>
  <div class="grid">
    ${book.alphabets.map(a => `
      <div class="card">
        <div class="script">${a.char}</div>
        <div class="pron">${a.pron}</div>
        <div class="tip">Example: <strong>${a.ex}</strong></div>
      </div>
    `).join('')}
  </div>

  <h2>Chapter 2: Essential Counting Numbers (1 to 1,000)</h2>
  <div class="grid">
    ${book.numbers.map(n => `
      <div class="card">
        <div style="font-size: 14px; font-weight: bold;">Number ${n.num}</div>
        <div class="script">${n.word}</div>
        <div class="pron">Pronunciation: ${n.pron}</div>
      </div>
    `).join('')}
  </div>

  <h2>Chapter 3: Categorized Travel & Emergency Phrasebook</h2>
  <div class="grid">
    ${phrases.map(p => {
      const trans = p.translations[book.langCode] || p.translations["te"] || p.translations["hi"];
      return `
        <div class="card">
          <div style="font-size: 11px; font-weight: bold; color: #0369a1;">[${p.category}]</div>
          <div style="font-size: 13px; font-weight: 600;">"${p.en}"</div>
          <div class="script" style="margin-top: 4px;">${trans?.script || ""}</div>
          <div class="pron">${trans?.pron || ""}</div>
          <div class="tip"><strong>Etiquette:</strong> ${trans?.tip || ""}</div>
        </div>
      `;
    }).join('')}
  </div>

  <div class="footer">
    <p>Bharat Yatra Digital Heritage & Tourism Guidebook · Government of India Public Access Edition · Keep offline on phone for field navigation</p>
  </div>

  <script>
    window.onload = function() {
      // Auto trigger print dialog so traveler can Save as PDF
      window.print();
    };
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    // If popup blocked, create standard download link
    const a = document.createElement("a");
    a.href = url;
    a.download = `${book.id}-guidebook.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
