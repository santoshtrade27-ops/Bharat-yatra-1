import { useState, useRef } from "react";
import { Sparkles, X, Send, Mic, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Namaste! 🙏 Ask me about heritage sites, trip plans, food or crafts across India.",
    },
  ]);
  const recRef = useRef(null);

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput("");
    const next = [...messages, { role: "user", text: q }];
    setMessages(next);
    setBusy(true);
    try {
      let answer = "";
      try {
        const response = await fetch("/api/ai/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: q,
            messages: next.slice(-6),
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.response) {
            answer = data.response;
          }
        }
      } catch {
        // Continue to fallback
      }

      if (!answer) {
        const res = await base44.integrations.Core.InvokeLLM({
          prompt: `You are the Bharat Yatra guide. Answer simply like explaining to a 10-year-old child with clean punctuation and spacing, without raw asterisks: ${q}`,
        });
        answer = typeof res === "string" ? res : res?.response || JSON.stringify(res);
      }

      // Format cleanly: strip raw markdown stars and maintain clear spacing
      const cleanAnswer = String(answer || "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .trim();

      setMessages((m) => [...m, { role: "assistant", text: cleanAnswer }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Sorry, I couldn't connect right now. Please ask me again!" },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const [interimVoice, setInterimVoice] = useState("");
  const [voiceNotice, setVoiceNotice] = useState("");

  function toggleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setVoiceNotice("Speech Recognition is not supported in this browser.");
      setTimeout(() => setVoiceNotice(""), 3500);
      return;
    }

    if (listening) {
      if (recRef.current) {
        try {
          recRef.current.stop();
        } catch {}
      }
      setListening(false);
      setInterimVoice("");
      return;
    }

    setVoiceNotice("");
    setInterimVoice("");

    try {
      const rec = new SR();
      rec.lang = "en-IN";
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setListening(true);
      };

      rec.onresult = (e) => {
        let interim = "";
        let final = "";
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            final += e.results[i][0].transcript;
          } else {
            interim += e.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimVoice(interim);
        }

        if (final) {
          const clean = final.trim();
          setInterimVoice("");
          setInput(clean);
          setListening(false);
          send(clean);
        }
      };

      rec.onerror = (e) => {
        setListening(false);
        setInterimVoice("");
        if (e.error === "not-allowed") {
          setVoiceNotice("Microphone permission denied.");
        } else {
          setVoiceNotice(`Voice error: ${e.error || "Please try again"}`);
        }
        setTimeout(() => setVoiceNotice(""), 3500);
      };

      rec.onend = () => {
        setListening(false);
      };

      recRef.current = rec;
      rec.start();
    } catch {
      setListening(false);
      setVoiceNotice("Could not access microphone.");
      setTimeout(() => setVoiceNotice(""), 3500);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-20 md:bottom-6 right-5 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-xl hover:scale-105 transition-transform"
        aria-label="AI assistant"
      >
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-36 md:bottom-24 right-5 z-50 w-[92vw] max-w-sm glass rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Gemini Heritage Guide</span>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">Live Voice & AI</span>
          </div>
          <div className="h-72 overflow-y-auto p-3 space-y-2.5 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking…
              </div>
            )}
          </div>

          {/* Voice Waveform Live Indicator */}
          {listening && (
            <div className="px-3 py-2 bg-primary/10 border-t border-primary/30 flex items-center justify-between gap-2 text-xs text-primary font-medium animate-pulse">
              <div className="flex items-center gap-2 truncate">
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="truncate">{interimVoice ? `"${interimVoice}"` : "Listening... ask any heritage question"}</span>
              </div>
              <button
                onClick={toggleVoice}
                className="text-[10px] uppercase font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full hover:bg-destructive/20"
              >
                Stop
              </button>
            </div>
          )}

          {voiceNotice && (
            <div className="px-3 py-1.5 bg-destructive/10 border-t border-destructive/20 text-destructive text-[11px] flex items-center gap-1">
              <span>{voiceNotice}</span>
            </div>
          )}

          <div className="p-2.5 border-t border-border flex items-center gap-2 bg-card">
            <button
              onClick={toggleVoice}
              className={`w-9 h-9 grid place-items-center rounded-full shrink-0 transition-all ${
                listening ? "bg-red-500 text-white animate-pulse ring-2 ring-red-400" : "bg-muted text-foreground hover:text-primary"
              }`}
              title={listening ? "Listening... click to stop" : "Ask with microphone (Voice-to-Text)"}
              aria-label="Voice input"
            >
              <Mic className="w-4 h-4" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about temples, crafts, history…"
              className="flex-1 bg-transparent text-sm outline-none px-1 text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={() => send()}
              disabled={busy || (!input.trim() && !listening)}
              className="w-9 h-9 grid place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}