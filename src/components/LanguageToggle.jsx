import React, { useState } from "react";
import { Globe, Sparkles, Check, ChevronDown, RefreshCw } from "lucide-react";
import { INDIAN_REGIONAL_LANGUAGES } from "@/components/lib/aiTranslationService";

export default function LanguageToggle({
  selectedLang = "en",
  onSelectLang,
  isTranslating = false,
  variant = "pill", // 'pill' | 'dropdown' | 'bar'
  showSparkle = true,
  className = "",
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentLang = INDIAN_REGIONAL_LANGUAGES.find((l) => l.code === selectedLang) || INDIAN_REGIONAL_LANGUAGES[0];

  const handleSelect = (code) => {
    onSelectLang(code);
    setDropdownOpen(false);
  };

  if (variant === "bar") {
    return (
      <div className={`flex items-center gap-1.5 overflow-x-auto py-1.5 scrollbar-none ${className}`}>
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 shrink-0 mr-1">
          <Globe className="w-3.5 h-3.5 text-primary" /> Translate with AI:
        </span>
        {INDIAN_REGIONAL_LANGUAGES.map((lang) => {
          const isSelected = selectedLang === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              disabled={isTranslating}
              className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all shrink-0 flex items-center gap-1 ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold scale-105"
                  : "bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
              }`}
            >
              <span>{lang.nativeName}</span>
              {isSelected && <Check className="w-3 h-3" />}
            </button>
          );
        })}
      </div>
    );
  }

  // Default compact pill / dropdown
  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        disabled={isTranslating}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
          selectedLang !== "en"
            ? "bg-primary/10 border-primary/30 text-primary font-semibold"
            : "bg-muted/60 border-border text-foreground hover:bg-muted"
        }`}
        title="Switch regional language with AI translation"
      >
        {isTranslating ? (
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
        ) : showSparkle ? (
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        ) : (
          <Globe className="w-3.5 h-3.5 text-muted-foreground" />
        )}
        <span>{currentLang.nativeName}</span>
        <span className="text-[10px] opacity-70">({currentLang.name})</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
      </button>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 w-56 rounded-2xl bg-popover text-popover-foreground shadow-xl border border-border py-2 z-50 animate-fadeIn max-h-72 overflow-y-auto">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/60 flex items-center justify-between">
              <span>Indian Regional Languages</span>
              <span className="text-[10px] text-amber-500 font-bold">AI Translated</span>
            </div>
            {INDIAN_REGIONAL_LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-muted/80 transition-colors ${
                    isSelected ? "text-primary font-semibold bg-primary/10" : "text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag}</span>
                    <div>
                      <div className="font-medium">{lang.nativeName}</div>
                      <div className="text-[10px] text-muted-foreground">{lang.name} · {lang.script}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
