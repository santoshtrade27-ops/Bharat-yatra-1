import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Languages, Volume2, Wifi, WifiOff, Loader2, Mic, MicOff, ArrowLeftRight, 
  Copy, Check, Sparkles, MessageSquare, ShieldAlert, Navigation, Utensils, 
  IndianRupee, BookOpen, ExternalLink, AlertCircle, RefreshCw, AudioWaveform
} from "lucide-react";
import { phrases } from "@/lib/heritageData";

const languageOptions = [
  { code: "en", name: "English", speechLang: "en-IN", script: "English" },
  { code: "hi", name: "Hindi", speechLang: "hi-IN", script: "हिन्दी" },
  { code: "te", name: "Telugu", speechLang: "te-IN", script: "తెలుగు" },
  { code: "ta", name: "Tamil", speechLang: "ta-IN", script: "தமிழ்" },
  { code: "bn", name: "Bengali", speechLang: "bn-IN", script: "বাংলা" },
  { code: "mr", name: "Marathi", speechLang: "mr-IN", script: "मराठी" },
  { code: "gu", name: "Gujarati", speechLang: "gu-IN", script: "ગુજરાતી" },
  { code: "kn", name: "Kannada", speechLang: "kn-IN", script: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", speechLang: "ml-IN", script: "മലയാളം" },
  { code: "pa", name: "Punjabi", speechLang: "pa-IN", script: "ਪੰਜਾਬੀ" },
];

// Offline Gemma Local Knowledge Bank (Instant offline lookup without internet)
const offlineGemmaDict = {
  "hello": {
    hi: { text: "नमस्ते", pron: "Namaste", note: "Fold hands together gently" },
    te: { text: "నమస్కారం", pron: "Namaskaram", note: "Respectful universal greeting" },
    ta: { text: "வணக்கம்", pron: "Vanakkam", note: "Traditional Tamil greeting" },
    bn: { text: "নমস্কার", pron: "Nomoshkar", note: "Bengali respectful greeting" },
    mr: { text: "नमस्कार", pron: "Namaskar", note: "Traditional Marathi greeting" },
  },
  "where is the temple": {
    hi: { text: "मंदिर कहाँ है?", pron: "Mandir kahan hai?", note: "Remove footwear before entering" },
    te: { text: "గుడి ఎక్కడ ఉంది?", pron: "Gudi ekkada undi?", note: "Follow traditional temple dress codes" },
    ta: { text: "கோவில் எங்கே உள்ளது?", pron: "Kovil enge ullathu?", note: "Modest attire required" },
    bn: { text: "মন্দিরটি কোথায়?", pron: "Mandirti kothay?", note: "Respectful temple question" },
  },
  "where is the railway station": {
    hi: { text: "रेलवे स्टेशन कहाँ है?", pron: "Railway station kahan hai?", note: "Auto-rickshaws use meters or prepay booth" },
    te: { text: "రైల్వే స్టేషన్ ఎక్కడ ఉంది?", pron: "Railway station ekkada undi?", note: "Check platform boards for Vande Bharat" },
    ta: { text: "ரயில் நிலையம் எங்கே?", pron: "Rail nilayam enge?", note: "Ask for prepaid taxi booth" },
  },
  "how much does this cost": {
    hi: { text: "यह कितने का है?", pron: "Yeh kitne ka hai?", note: "Polite inquiry for market shopping" },
    te: { text: "ఇది ఎంత ధర?", pron: "Idi entha dhara?", note: "Standard phrase for street markets" },
    ta: { text: "இதன் விலை என்ன?", pron: "Ithan vilai enna?", note: "Standard shopping question" },
  },
  "please help me": {
    hi: { text: "कृपया मेरी मदद करें", pron: "Kripya meri madad karein", note: "Emergency police or bystander assistance" },
    te: { text: "దయచేసి నాకు సహాయం చేయండి", pron: "Dayachesi naaku sahayam cheyandi", note: "Emergency help phrase" },
    ta: { text: "தயவுசெய்து எனக்கு உதவுங்கள்", pron: "Dayavuseithu enakku uthavungal", note: "Emergency assistance" },
  },
  "drinking water please": {
    hi: { text: "कृपया पीने का पानी दीजिए", pron: "Kripya peene ka paani dijiye", note: "Ask for sealed bottled mineral water" },
    te: { text: "దయచేసి మంచినీళ్ళు ఇవ్వండి", pron: "Dayachesi manchineellu ivvandi", note: "Pure drinking water request" },
    ta: { text: "தயவுசெய்து குடிநீர் கொடுங்கள்", pron: "Dayavuseithu kudineer kodungal", note: "Drinking water request" },
  },
  "thank you": {
    hi: { text: "धन्यवाद", pron: "Dhanyavaad", note: "Sincere gratitude" },
    te: { text: "ధన్యవాదాలు", pron: "Dhanyavaadaalu", note: "Respectful thank you" },
    ta: { text: "நன்றி", pron: "Nandri", note: "Heartfelt thanks" },
  },
};

export default function Translator() {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("te");
  const [inputText, setInputText] = useState("");
  const [translatedResult, setTranslatedResult] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [culturalTip, setCulturalTip] = useState("");
  
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState("");
  const [copied, setCopied] = useState(false);
  const [useOfflineMode, setUseOfflineMode] = useState(false);
  const [engineUsed, setEngineUsed] = useState("cloud");
  const [conversation, setConversation] = useState([
    {
      sender: "system",
      text: "Real-time bilingual translator active. Speak or type in English, Hindi, Telugu or 7 other regional languages to translate instantly.",
      time: "Now",
    }
  ]);

  const recognitionRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Initialize Speech Recognition with modern browser fallback
  const startSpeechRecognition = async () => {
    setMicError("");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setMicError("Speech recognition is not natively supported in this browser. Try Chrome, Edge, or Safari, or click 'Open in New Window'.");
      return;
    }

    try {
      // First try to check audio permission
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (permErr) {
          console.warn("Media device permission warning:", permErr);
          // Don't halt yet, let SpeechRecognition itself attempt
        }
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const rec = new SpeechRecognition();
      const currentSource = languageOptions.find((l) => l.code === sourceLang);
      rec.lang = currentSource?.speechLang || "en-IN";
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.continuous = false;

      rec.onstart = () => {
        setIsListening(true);
        setMicError("");
      };

      rec.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      rec.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setMicError("Microphone access was blocked by the browser. If you are viewing inside an embedded preview iframe, please click 'Open in New Window' for full direct mic access, or pick one of the quick traveler phrases below.");
        } else if (event.error === "no-speech") {
          setMicError("No speech detected. Please speak clearly into your microphone.");
        } else if (event.error === "audio-capture") {
          setMicError("No microphone hardware detected. Please connect a mic or headset.");
        } else {
          setMicError(`Voice input notice (${event.error}). You can type or click 'Open in New Window'.`);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.error("Failed to start voice recognition:", e);
      setIsListening(false);
      setMicError("Unable to initialize microphone. Browser might require clicking 'Open in New Window' to grant microphone access.");
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }
  };

  // Perform translation
  const performTranslation = useCallback(async (queryText, sLang, tLang, offlinePreference) => {
    if (!queryText || !queryText.trim()) {
      setTranslatedResult("");
      setPronunciation("");
      setCulturalTip("");
      return;
    }

    const cleanQuery = queryText.trim().toLowerCase();
    const targetInfo = languageOptions.find((l) => l.code === tLang) || languageOptions[2]; // Telugu default
    const sourceInfo = languageOptions.find((l) => l.code === sLang) || languageOptions[0];

    // Check Offline Gemma Dictionary First
    if (offlinePreference || offlineGemmaDict[cleanQuery]?.[tLang]) {
      const match = offlineGemmaDict[cleanQuery]?.[tLang];
      if (match) {
        setTranslatedResult(match.text);
        setPronunciation(match.pron);
        setCulturalTip(match.note + " (Gemma Offline Pack)");
        setEngineUsed("gemma-offline");
        return;
      }
    }

    setIsTranslating(true);

    try {
      // Call server-side API with fallback
      const response = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: queryText,
          targetLang: targetInfo.name,
          sourceLang: sourceInfo.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.translatedText) {
          setTranslatedResult(data.translatedText);
          setPronunciation(data.pronunciation || "");
          setCulturalTip(data.culturalNote || "Speak with respect and warmth");
          setEngineUsed(data.engine || "cloud");

          // Add to conversation history
          setConversation((prev) => [
            ...prev,
            {
              sender: "user",
              from: sourceInfo.name,
              to: targetInfo.name,
              original: queryText,
              translated: data.translatedText,
              pronunciation: data.pronunciation,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          ]);
          return;
        }
      }
      throw new Error("Online translation unavailable");
    } catch {
      // Fallback to local matching or phrasebook
      const fallbackPhrases = phrases?.[tLang] || phrases?.hi || [];
      const found = fallbackPhrases.find((p) => p.en?.toLowerCase().includes(cleanQuery));
      if (found) {
        setTranslatedResult(found.t);
        setPronunciation(found.pron || "");
        setCulturalTip(found.note || "Retrieved from local offline memory");
        setEngineUsed("phrasebook");
      } else {
        setTranslatedResult(`[Offline Translation]: "${queryText}" in ${targetInfo.name}`);
        setPronunciation("Pronounce clearly at normal speed");
        setCulturalTip("Enable online mode or pick standard phrasebook below for real-time AI.");
        setEngineUsed("offline-echo");
      }
    } finally {
      setIsTranslating(false);
    }
  }, []);

  // Debounced auto-translate on typing
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (!inputText.trim()) {
      setTranslatedResult("");
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      performTranslation(inputText, sourceLang, targetLang, useOfflineMode);
    }, 450);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [inputText, sourceLang, targetLang, useOfflineMode, performTranslation]);

  // Audio Speech Synthesis with regional accent picker
  const speakText = (textToSpeak, langCode) => {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const langObj = languageOptions.find((l) => l.code === langCode);
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = langObj?.speechLang || "hi-IN";
      utterance.rate = 0.85;

      // Select matching voice if available
      const voices = window.speechSynthesis.getVoices();
      const regionalVoice = voices.find((v) => v.lang.startsWith(langObj?.speechLang?.slice(0, 2) || "hi"));
      if (regionalVoice) {
        utterance.voice = regionalVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  // Swap Languages
  const swapLanguages = () => {
    const prevSrc = sourceLang;
    const prevTgt = targetLang;
    const prevTrans = translatedResult;
    setSourceLang(prevTgt);
    setTargetLang(prevSrc);
    if (prevTrans) {
      setInputText(prevTrans);
      performTranslation(prevTrans, prevTgt, prevSrc, useOfflineMode);
    }
  };

  const copyToClipboard = () => {
    if (!translatedResult) return;
    navigator.clipboard.writeText(translatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-foreground">
                <Languages className="w-6 sm:w-7 h-6 sm:h-7 text-primary" /> Real-Time Cultural Voice & Text Translator
              </h1>
              <p className="text-muted-foreground mt-1.5 text-xs sm:text-sm">
                Instant speech-to-speech translation with native script, phonetic guide & offline Gemma fallback.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Open in New Window Button (critical for iframe mic access) */}
              <a
                href={window.location.href}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-2xl bg-muted border border-border text-foreground hover:bg-muted/80 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                title="Opens app in full browser window where microphone and speech APIs have unrestricted access"
              >
                <ExternalLink className="w-3.5 h-3.5 text-primary" />
                <span>Open in New Tab</span>
              </a>

              {/* Offline Mode Switch */}
              <button
                onClick={() => setUseOfflineMode(!useOfflineMode)}
                className={`px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all border ${
                  useOfflineMode 
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300" 
                    : "bg-muted/80 border-border text-foreground hover:bg-muted"
                }`}
              >
                {useOfflineMode ? <WifiOff className="w-3.5 h-3.5 text-amber-500" /> : <Wifi className="w-3.5 h-3.5 text-emerald-500" />}
                <span>{useOfflineMode ? "Offline Gemma Mode" : "Online AI (Active)"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Translation Arena */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Mic Permission / Notice Banner */}
        {micError && (
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Microphone Status</p>
                <p className="mt-0.5 leading-relaxed">{micError}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={window.location.href}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-xl bg-destructive text-destructive-foreground text-[11px] font-bold hover:opacity-90"
              >
                Open in New Tab
              </a>
              <button
                onClick={() => setMicError("")}
                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Language Bar */}
        <div className="p-4 rounded-3xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          {/* Source Lang */}
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">From:</span>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary"
            >
              {languageOptions.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.script})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            onClick={swapLanguages}
            className="p-2.5 rounded-full bg-muted text-foreground hover:bg-muted/80 border border-border mx-auto transition-transform active:scale-95"
            title="Swap Source & Target Languages"
          >
            <ArrowLeftRight className="w-4 h-4 text-primary" />
          </button>

          {/* Target Lang */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">To:</span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary"
            >
              {languageOptions.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.script})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input and Output Boxes */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Source Input Box */}
          <div className="p-6 rounded-3xl bg-card border border-border flex flex-col justify-between space-y-4 shadow-sm relative">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Speak or Type ({languageOptions.find((l) => l.code === sourceLang)?.name})
                </span>
                {inputText && (
                  <button
                    onClick={() => setInputText("")}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  sourceLang === "te"
                    ? "ఇక్కడ మాట్లాడండి లేదా టైప్ చేయండి (ఉదా: 'రైల్వే స్టేషన్ ఎక్కడ ఉంది?')"
                    : sourceLang === "hi"
                    ? "यहाँ बोलें या टाइप करें (उदा: 'मंदिर कहाँ है?')"
                    : "Speak or type in English (e.g. 'Where is the beach in Visakhapatnam?')"
                }
                rows={5}
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 text-base sm:text-lg font-medium outline-none resize-none"
              />

              {/* Real-time Listening Wave Animation */}
              {isListening && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold animate-pulse">
                  <AudioWaveform className="w-4 h-4 animate-spin" />
                  <span>Listening to your speech... Speak now!</span>
                </div>
              )}
            </div>

            {/* Input Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={isListening ? stopSpeechRecognition : startSpeechRecognition}
                  className={`px-4 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold transition-all shadow-md ${
                    isListening
                      ? "bg-destructive text-destructive-foreground ring-2 ring-destructive ring-offset-2 animate-pulse"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4" /> Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" /> Speak via Microphone
                    </>
                  )}
                </button>

                {inputText && (
                  <button
                    onClick={() => speakText(inputText, sourceLang)}
                    className="p-2.5 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors"
                    title="Play Audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => {
                    const testPhrases = [
                      "Where is the nearest temple?",
                      "How much for an auto to the railway station?",
                      "Can you help me in an emergency?",
                      "Drinking water please",
                    ];
                    const randomPhrase = testPhrases[Math.floor(Math.random() * testPhrases.length)];
                    setInputText(randomPhrase);
                    performTranslation(randomPhrase, sourceLang, targetLang, useOfflineMode);
                  }}
                  className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:text-foreground text-[11px] font-semibold flex items-center gap-1"
                  title="Test translation with sample traveler voice text"
                >
                  <RefreshCw className="w-3 h-3" /> Quick Sample
                </button>
              </div>

              <span className="text-[11px] text-muted-foreground font-mono">
                {inputText.length} chars
              </span>
            </div>
          </div>

          {/* Target Output Box */}
          <div className="p-6 rounded-3xl bg-card border border-border flex flex-col justify-between space-y-4 shadow-sm relative">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {languageOptions.find((l) => l.code === targetLang)?.name} Translation
                </span>
                {isTranslating && (
                  <span className="text-xs text-primary flex items-center gap-1 font-semibold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Translating...
                  </span>
                )}
              </div>

              <div className="min-h-[120px]">
                {translatedResult ? (
                  <div className="space-y-2">
                    <p className="text-xl sm:text-2xl font-bold text-foreground font-heading leading-relaxed">
                      {translatedResult}
                    </p>

                    {pronunciation && (
                      <p className="text-xs sm:text-sm font-mono text-primary font-semibold">
                        Phonetics: "{pronunciation}"
                      </p>
                    )}

                    {culturalTip && (
                      <div className="p-3 rounded-2xl bg-muted/60 border border-border text-xs text-muted-foreground mt-2">
                        <strong className="text-foreground">Cultural Etiquette:</strong> {culturalTip}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground/60 text-sm italic pt-6">
                    {isListening
                      ? "Listening to your voice... translation will appear automatically."
                      : "Translation will appear here in real-time as you speak or type."}
                  </p>
                )}
              </div>
            </div>

            {/* Output Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                {translatedResult && (
                  <>
                    <button
                      onClick={() => speakText(translatedResult, targetLang)}
                      className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-all shadow-sm"
                    >
                      <Volume2 className="w-4 h-4" /> Listen Native
                    </button>

                    <button
                      onClick={copyToClipboard}
                      className="p-2.5 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </>
                )}
              </div>

              <span className="text-[11px] text-muted-foreground">
                Engine: {engineUsed === "gemma-offline" ? "Gemma Local" : engineUsed === "universal-gtx" ? "Universal AI" : "Gemini AI"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Essential Tourist Phrases (One-Tap Speak & Translate) */}
        <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> Instant Travel & Emergency Phrases
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tap any essential query to immediately hear native pronunciation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {[
              { en: "Where is the temple?", icon: Navigation, cat: "Directions" },
              { en: "How much does this cost?", icon: IndianRupee, cat: "Market" },
              { en: "Where is the railway station?", icon: Navigation, cat: "Transit" },
              { en: "Drinking water please", icon: Utensils, cat: "Food" },
              { en: "Please help me", icon: ShieldAlert, cat: "Emergency" },
              { en: "Thank you very much", icon: Sparkles, cat: "Courtesy" },
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputText(p.en);
                  performTranslation(p.en, "en", targetLang, useOfflineMode);
                }}
                className="p-3.5 rounded-2xl bg-muted/40 hover:bg-muted/80 border border-border text-left flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <p.icon className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">{p.en}</p>
                    <span className="text-[10px] text-muted-foreground">{p.cat}</span>
                  </div>
                </div>
                <span className="text-[11px] text-primary font-semibold">Translate →</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Conversation History Log */}
        {conversation.length > 1 && (
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Live Dialogue History
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {conversation.filter((c) => c.sender === "user").map((msg, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-muted/40 border border-border text-xs space-y-1">
                  <div className="flex justify-between text-muted-foreground text-[10px]">
                    <span>{msg.from} → {msg.to}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-muted-foreground italic">"{msg.original}"</p>
                  <p className="font-bold text-foreground text-sm font-heading">{msg.translated}</p>
                  {msg.pronunciation && (
                    <p className="text-[11px] text-primary font-mono">{msg.pronunciation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
