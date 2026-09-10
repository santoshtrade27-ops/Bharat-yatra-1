import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, AlertCircle, Sparkles, Check, X } from "lucide-react";

/**
 * Universal Voice-to-Text Input Component
 * Provides real-time speech transcription, visual audio waves, and error recovery.
 *
 * @param {Object} props
 * @param {Function} props.onTranscript - Callback when speech is recognized (text: string)
 * @param {string} [props.placeholder] - Placeholder or prompt instruction text
 * @param {string} [props.value] - Current text value if controlled
 * @param {Function} [props.onChange] - Text change handler if controlled
 * @param {boolean} [props.autoSubmit] - Whether to trigger onTranscript immediately on speech completion
 * @param {string} [props.language] - Recognition language (default 'en-IN')
 * @param {string} [props.className] - Container CSS classes
 * @param {string} [props.variant] - 'inline' | 'compact' | 'card'
 */
export default function VoiceToTextInput({
  onTranscript,
  placeholder = "Speak into your microphone...",
  value = "",
  onChange,
  autoSubmit = false,
  language = "en-IN",
  className = "",
  variant = "inline",
}) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage("Speech Recognition is not supported by your browser. Please type your query.");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    setErrorMessage("");
    setInterimText("");

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = "";
        let currentInterim = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (currentInterim) {
          setInterimText(currentInterim);
        }

        if (finalTranscript) {
          const cleanText = finalTranscript.trim();
          setInterimText("");
          if (onChange) {
            onChange(cleanText);
          }
          if (onTranscript) {
            onTranscript(cleanText);
          }
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setInterimText("");
        if (event.error === "not-allowed") {
          setErrorMessage("Microphone permission was denied. Please allow microphone access in browser settings.");
        } else if (event.error === "no-speech") {
          setErrorMessage("No voice detected. Please try speaking closer to your microphone.");
        } else {
          setErrorMessage(`Voice recognition note: ${event.error || "Please try again"}`);
        }
        setTimeout(() => setErrorMessage(""), 4500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      setErrorMessage("Could not initialize microphone. Please check permissions.");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  }

  function stopListening() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  }

  if (variant === "compact") {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <button
          type="button"
          onClick={startListening}
          className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
            isListening
              ? "bg-red-500 text-white border-red-600 shadow-md animate-pulse ring-2 ring-red-400/40"
              : "bg-muted text-muted-foreground hover:text-primary hover:bg-muted/80 border-border"
          }`}
          title={isListening ? "Listening... click to stop" : "Speak with microphone (Voice-to-Text)"}
          aria-label={isListening ? "Stop voice listening" : "Start voice listening"}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Floating status pill when active */}
        {isListening && (
          <div className="absolute top-full mt-2 left-0 z-30 px-3 py-1.5 rounded-lg bg-card/95 border border-primary/30 shadow-xl backdrop-blur-md flex items-center gap-2 whitespace-nowrap text-xs">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-semibold text-foreground">
              {interimText ? `"${interimText}..."` : "Listening... speak now"}
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="absolute top-full mt-2 left-0 z-30 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs shadow-lg flex items-center gap-1.5 whitespace-nowrap">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Listening Banner when active */}
      {isListening && (
        <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="w-1.5 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "450ms" }} />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-primary flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" /> Recording speech in real time...
              </div>
              <p className="text-xs text-foreground/80 font-medium truncate">
                {interimText ? `"${interimText}"` : "Describe your ideal trip, days, or monuments..."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={stopListening}
            className="px-3 py-1 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shrink-0 hover:opacity-90"
          >
            Done
          </button>
        </div>
      )}

      {/* Input container with embedded Mic trigger */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={isListening ? "Listening to your voice..." : placeholder}
          className="w-full pl-4 pr-12 py-3 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-xs"
        />

        <button
          type="button"
          onClick={startListening}
          className={`absolute right-2 p-2 rounded-xl border transition-all ${
            isListening
              ? "bg-red-500 text-white border-red-600 shadow-sm animate-pulse"
              : "bg-muted text-muted-foreground hover:text-primary hover:bg-muted/80 border-border"
          }`}
          title={isListening ? "Stop listening" : "Use device microphone (Voice-to-Text)"}
          aria-label={isListening ? "Stop voice listening" : "Speak using microphone"}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>

      {/* Error notification if any */}
      {errorMessage && (
        <div className="text-xs text-destructive flex items-center gap-1.5 px-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
