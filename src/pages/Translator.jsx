import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Languages, Volume2, Wifi, WifiOff, Loader2, Mic, MicOff, ArrowLeftRight, 
  Copy, Check, Sparkles, MessageSquare, BookOpen, ExternalLink, AlertCircle, 
  AudioWaveform, Download, CheckCircle2, Search
} from "lucide-react";
import { 
  languageOptions, 
  comprehensivePhrasebook, 
  languageLearningBooks, 
  translateOfflineQuery, 
  downloadLanguageBook 
} from "@/components/lib/languageLearningData";

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
  const [phraseCategory, setPhraseCategory] = useState("All");
  const [phraseSearch, setPhraseSearch] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState("");

  const [conversation, setConversation] = useState([
    {
      sender: "system",
      text: "Real-time bilingual translator & offline phrasebook active. Select your target language to instantly translate text, listen to native phonetics, or download local language guidebooks.",
      time: "Now",
    }
  ]);

  const recognitionRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Initialize Speech Recognition
  const startSpeechRecognition = async () => {
    setMicError("");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setMicError("Speech recognition is not natively supported in this browser. Try Chrome, Edge, or Safari, or click 'Open in New Window'.");
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (permErr) {
          console.warn("Media device permission warning:", permErr);
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
          setMicError("Microphone access was blocked by the browser. If viewing inside an iframe, click 'Open in New Window' for full direct mic access, or pick from the phrasebook below.");
        } else if (event.error === "no-speech") {
          setMicError("No speech detected. Please speak clearly into your microphone.");
        } else {
          setMicError(`Voice notice (${event.error}). You can type directly or pick quick phrases.`);
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

    const targetInfo = languageOptions.find((l) => l.code === tLang) || languageOptions[0];
    const sourceInfo = languageOptions.find((l) => l.code === sLang) || languageOptions[0];

    // Check Offline Phrasebook / Lexicon First if in Offline Mode
    if (offlinePreference) {
      const offlineResult = translateOfflineQuery(queryText, tLang, sLang);
      if (offlineResult) {
        setTranslatedResult(offlineResult.translatedText);
        setPronunciation(offlineResult.pronunciation);
        setCulturalTip(offlineResult.culturalNote);
        setEngineUsed("offline-lexicon");
        return;
      }
    }

    setIsTranslating(true);

    try {
      // Call server-side API
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
          setCulturalTip(data.culturalNote || `Cultural note: Speak with warmth and join palms in greeting.`);
          setEngineUsed(data.engine || "cloud");

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
      // Robust Offline Fallback Engine
      const offlineFallback = translateOfflineQuery(queryText, tLang, sLang);
      if (offlineFallback) {
        setTranslatedResult(offlineFallback.translatedText);
        setPronunciation(offlineFallback.pronunciation);
        setCulturalTip(offlineFallback.culturalNote);
        setEngineUsed(offlineFallback.engine);
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
    }, 400);

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
      const cleanText = textToSpeak.replace(/\[.*?\]/g, "").replace(/\(.*?\)/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = langObj?.speechLang || "hi-IN";
      utterance.rate = 0.85;

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

  const handleDownloadBook = (bookId, title) => {
    downloadLanguageBook(bookId);
    setDownloadSuccess(`Generated printable guide for ${title}! Check your browser downloads or print preview.`);
    setTimeout(() => setDownloadSuccess(""), 4500);
  };

  const categories = ["All", "Greetings & Politeness", "Directions & Transport", "Shopping & Handloom", "Food & Dining", "Emergency & Safety"];

  const filteredPhrases = comprehensivePhrasebook.filter((p) => {
    const matchCat = phraseCategory === "All" || p.category === phraseCategory;
    const matchSearch = !phraseSearch || p.en.toLowerCase().includes(phraseSearch.toLowerCase()) ||
      p.translations[targetLang]?.script?.toLowerCase().includes(phraseSearch.toLowerCase()) ||
      p.translations[targetLang]?.pron?.toLowerCase().includes(phraseSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const currentTargetLangObj = languageOptions.find((l) => l.code === targetLang) || languageOptions[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
                  Offline & Online Voice Matrix
                </span>
                <span className="text-xs text-muted-foreground">· 10 Regional Languages</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-foreground mt-1.5">
                <Languages className="w-6 sm:w-7 h-6 sm:h-7 text-primary" /> Cultural Voice Translator & Phrasebook
              </h1>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                Translate with authentic native scripts, phonetic guides, offline phrasebooks and downloadable language learning eBooks.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={window.location.href}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-2xl bg-muted border border-border text-foreground hover:bg-muted/80 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                title="Opens app in a full browser tab for unrestricted microphone and speech access"
              >
                <ExternalLink className="w-3.5 h-3.5 text-primary" />
                <span>Open in Full Tab</span>
              </a>

              <button
                onClick={() => setUseOfflineMode(!useOfflineMode)}
                className={`px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all border ${
                  useOfflineMode 
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300" 
                    : "bg-muted/80 border-border text-foreground hover:bg-muted"
                }`}
              >
                {useOfflineMode ? <WifiOff className="w-3.5 h-3.5 text-amber-500" /> : <Wifi className="w-3.5 h-3.5 text-emerald-500" />}
                <span>{useOfflineMode ? "Offline Pack (Active)" : "Online AI (Active)"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Download Notice */}
        {downloadSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Mic Permission Banner */}
        {micError && (
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Microphone Note</p>
                <p className="mt-0.5 leading-relaxed">{micError}</p>
              </div>
            </div>
            <button
              onClick={() => setMicError("")}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Language Selection Bar */}
        <div className="p-4 rounded-3xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          {/* Source Lang */}
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">From:</span>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {languageOptions.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            onClick={swapLanguages}
            className="p-2.5 rounded-full bg-muted text-foreground hover:bg-muted/80 border border-border mx-auto transition-transform active:scale-95 cursor-pointer"
            title="Swap Source & Target Languages"
          >
            <ArrowLeftRight className="w-4 h-4 text-primary" />
          </button>

          {/* Target Lang */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">To (Target Script):</span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {languageOptions.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.script})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input and Output Translation Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Source Input Box */}
          <div className="p-6 rounded-3xl bg-card border border-border flex flex-col justify-between space-y-4 shadow-xs relative">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Speak or Type ({languageOptions.find((l) => l.code === sourceLang)?.name})
                </span>
                {inputText && (
                  <button
                    onClick={() => setInputText("")}
                    className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
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
                    : "Speak or type in English (e.g. 'How much does this cost?', 'Where is the temple?')"
                }
                rows={5}
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 text-base sm:text-lg font-medium outline-none resize-none"
              />

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
                  className={`px-4 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold transition-all shadow-xs cursor-pointer ${
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
                      <Mic className="w-4 h-4" /> Speak via Mic
                    </>
                  )}
                </button>

                {inputText && (
                  <button
                    onClick={() => speakText(inputText, sourceLang)}
                    className="p-2.5 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                    title="Play Audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <span className="text-[11px] text-muted-foreground font-mono">
                {inputText.length} chars
              </span>
            </div>
          </div>

          {/* Target Output Box */}
          <div className="p-6 rounded-3xl bg-card border border-border flex flex-col justify-between space-y-4 shadow-xs relative">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentTargetLangObj.name} Script & Meaning
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
                        Phonetic Guide: "{pronunciation}"
                      </p>
                    )}

                    {culturalTip && (
                      <div className="p-3 rounded-2xl bg-muted/60 border border-border text-xs text-muted-foreground mt-2">
                        <strong className="text-foreground">Cultural Nuance:</strong> {culturalTip}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground/60 text-sm italic pt-6">
                    {isListening
                      ? "Listening to voice input... translation will appear automatically."
                      : "Translation in authentic native script & phonetics will appear here in real-time."}
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
                      className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-all shadow-xs cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" /> Listen Native
                    </button>

                    <button
                      onClick={copyToClipboard}
                      className="p-2.5 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </>
                )}
              </div>

              <span className="text-[11px] text-muted-foreground">
                Engine: {engineUsed.includes("offline") ? "Offline Regional Pack" : "Gemini Multilingual AI"}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: INTERACTIVE CATEGORIZED PHRASEBOOK WITH SCRIPT & STATEMENT */}
        <div className="p-6 rounded-3xl bg-card border border-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase">
                  Statement & Native Script Phrasebook
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground mt-1 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Instant {currentTargetLangObj.name} Phrasebook ({currentTargetLangObj.script})
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Each phrase below displays the English statement, target native script, phonetic pronunciation, and audio speech.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={phraseSearch}
                onChange={(e) => setPhraseSearch(e.target.value)}
                placeholder="Search statement or words..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-xs outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setPhraseCategory(cat)}
                className={`px-3.5 py-2 rounded-2xl transition-all shrink-0 font-semibold cursor-pointer ${
                  phraseCategory === cat
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Phrases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPhrases.map((phrase) => {
              const trans = phrase.translations[targetLang] || phrase.translations["te"] || phrase.translations["hi"];
              return (
                <div
                  key={phrase.id}
                  className="p-5 rounded-3xl bg-muted/40 border border-border space-y-3 hover:border-primary/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                        {phrase.category}
                      </span>
                      <button
                        onClick={() => speakText(trans?.script || "", targetLang)}
                        className="p-2 rounded-full bg-card hover:bg-muted border border-border text-foreground transition-colors cursor-pointer"
                        title="Listen to native voice pronunciation"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-primary" />
                      </button>
                    </div>

                    {/* Statement in English */}
                    <div>
                      <span className="text-[11px] text-muted-foreground block font-medium">English Statement:</span>
                      <h4 className="text-sm sm:text-base font-bold text-foreground">"{phrase.en}"</h4>
                    </div>

                    {/* Translated Native Script */}
                    <div className="p-3 rounded-2xl bg-card border border-border space-y-1">
                      <span className="text-[10px] font-bold text-primary uppercase">
                        {currentTargetLangObj.name} Script:
                      </span>
                      <p className="text-lg sm:text-xl font-bold text-foreground font-heading leading-relaxed">
                        {trans?.script}
                      </p>
                      <p className="text-xs font-mono text-primary font-semibold">
                        Pronunciation: "{trans?.pron}"
                      </p>
                    </div>

                    {/* Etiquette Tip */}
                    {trans?.tip && (
                      <p className="text-[11px] text-muted-foreground italic">
                        <strong>Tip:</strong> {trans.tip}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                    <button
                      onClick={() => {
                        setInputText(phrase.en);
                        performTranslation(phrase.en, "en", targetLang, useOfflineMode);
                      }}
                      className="text-primary font-bold hover:underline cursor-pointer"
                    >
                      Use in Voice Translator →
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${trans?.script} (${trans?.pron})`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer text-[11px]"
                    >
                      <Copy className="w-3 h-3" /> Copy Script
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: DOWNLOAD LOCAL LANGUAGE LEARNING BOOKS & EBOOKS */}
        <div className="p-6 rounded-3xl bg-card border border-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase">
                  Downloadable eBooks & Guides
                </span>
                <span className="text-xs text-muted-foreground">· 8 Regional Editions</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground mt-1 flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" /> Local Language Learning Books (Printable Guides & eBooks)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Download verified language learning pocketbooks with alphabet charts, numbers 1-1,000, and travel conversations for offline study.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {languageLearningBooks.map((book) => (
              <div
                key={book.id}
                className="p-6 rounded-3xl bg-muted/40 border border-border flex flex-col justify-between space-y-5 hover:border-primary/50 transition-all shadow-xs"
              >
                <div className="space-y-3">
                  {/* Book Cover Banner */}
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${book.coverColor} text-white space-y-1 shadow-sm`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-md inline-block">
                      {book.badge}
                    </span>
                    <h3 className="font-bold text-base sm:text-lg leading-tight mt-1">{book.title}</h3>
                    <p className="text-[11px] text-white/90">{book.subtitle}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                    <span>{book.pages}</span>
                    <span>{book.size}</span>
                  </div>

                  {/* Core Chapters */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block mb-1">
                      Included Chapters:
                    </span>
                    {book.chapters.slice(0, 4).map((ch, idx) => (
                      <p key={idx} className="text-muted-foreground leading-relaxed flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span className="truncate">{ch}</span>
                      </p>
                    ))}
                    {book.chapters.length > 4 && (
                      <p className="text-[11px] text-primary font-semibold">
                        + {book.chapters.length - 4} more chapters & alphabet charts
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => handleDownloadBook(book.id, book.title)}
                    className="w-full py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:opacity-90 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Printable Guidebook
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: RECENT CONVERSATION HISTORY */}
        {conversation.length > 1 && (
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Live Translation Transcript
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
