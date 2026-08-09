import React, { useState, useRef, useEffect } from "react";
import { THEME_OPTIONS, ThemeId, applyTheme } from "../lib/theme";
import { Palette, Check, ChevronDown, Moon, Sun, Sparkles } from "lucide-react";

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  compact?: boolean;
}

export default function ThemeSelector({
  currentTheme,
  onThemeChange,
  compact = false
}: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedThemeObj = THEME_OPTIONS.find(t => t.id === currentTheme) || THEME_OPTIONS[0];

  const handleSelect = (id: ThemeId) => {
    applyTheme(id);
    onThemeChange(id);
    setIsOpen(false);
  };

  if (compact) {
    return (
      <div className="relative inline-block" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all cursor-pointer select-none"
          title="Change UI Theme"
        >
          <Palette size={14} className="text-[#00F0FF]" />
          <span className="hidden sm:inline font-mono uppercase text-[11px] text-slate-200">
            {selectedThemeObj.name}
          </span>
          <div
            className="w-3 h-3 rounded-full border border-white/20 shrink-0"
            style={{ backgroundColor: selectedThemeObj.previewAccent }}
          />
          <ChevronDown size={12} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
            <div className="sticky top-0 bg-[#0F172A]/95 backdrop-blur px-3 py-2 border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between z-10">
              <span>Select Theme ({THEME_OPTIONS.length})</span>
              <Sparkles size={12} className="text-amber-400" />
            </div>

            {THEME_OPTIONS.map((t) => {
              const isSelected = t.id === currentTheme;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t.id)}
                  className={`w-full text-left p-2 rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 font-bold"
                      : "hover:bg-slate-800 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-4 h-4 rounded-full border border-white/20 shrink-0 flex items-center justify-center text-[8px]"
                      style={{ backgroundColor: t.previewBg }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: t.previewAccent }}
                      />
                    </div>
                    <div>
                      <div className="font-sans font-semibold flex items-center gap-1 text-[11px]">
                        {t.name}
                        {t.category === "light" ? (
                          <Sun size={10} className="text-amber-500" />
                        ) : (
                          <Moon size={10} className="text-indigo-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check size={14} className="text-[#00F0FF]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Full Grid selector for Settings modal
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Palette size={16} className="text-[#00F0FF]" /> UI Color Themes & Aesthetics
        </label>
        <span className="text-[10px] text-slate-400 font-mono">{THEME_OPTIONS.length} Themes</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
        {THEME_OPTIONS.map((t) => {
          const isSelected = t.id === currentTheme;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleSelect(t.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "border-[#00F0FF] bg-[#00F0FF]/10 shadow-lg shadow-[#00F0FF]/10 ring-1 ring-[#00F0FF]"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center shadow"
                    style={{ backgroundColor: t.previewBg }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: t.previewAccent }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${isSelected ? "text-[#00F0FF]" : "text-slate-200"}`}>
                    {t.name}
                  </span>
                </div>
                {isSelected && (
                  <span className="p-1 rounded-full bg-[#00F0FF] text-black">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </div>

              <p className="text-[10.5px] text-slate-400 font-sans mt-2 leading-tight">
                {t.description}
              </p>

              {/* Color swatch bar */}
              <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/5">
                <div className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: t.previewBg }} />
                <div className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: t.previewCard }} />
                <div className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: t.previewAccent }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
