import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronDown, ChevronUp, Terminal, ShieldAlert, 
  Clock, Flame, HelpCircle, Dumbbell, Zap, RefreshCw, EyeOff 
} from "lucide-react";

export default function CollapsibleTerminals() {
  const [activeSession, setActiveSession] = useState<string | null>("exam-day");

  // Checklist items loaded state for Pre-Exam Checklist
  const [checklist, setChecklist] = useState([
    { id: "c1", label: "Inspect and sweep triple-variant Oct/Nov 2026 series variations.", checked: true },
    { id: "c2", label: "Perform rapid-fire active recall flashcard sweeps (250 questions/subject).", checked: false },
    { id: "c3", label: "Execute comprehensive text-material checklist sweep to certify zero missing definitions.", checked: false },
    { id: "c4", label: "Check off 10-year recurring formula tables for Mathematics and Physical Constants.", checked: true },
    { id: "c5", label: "Simulate final mock conditions under full noise isolation.", checked: false }
  ]);

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const toggleSection = (id: string) => {
    setActiveSession(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-4">
      
      {/* 1. [PRE-EXAM PHASE TERMINAL] */}
      <div className="border border-white/10 bg-[#0A0A0F] rounded overflow-hidden shadow-xl font-mono">
        <button
          onClick={() => toggleSection("pre-exam")}
          className="w-full flex items-center justify-between p-4 bg-[#12121A] hover:bg-[#12121A]/80 transition-colors text-left font-bold text-xs uppercase"
        >
          <div className="flex items-center gap-2 text-[#00F0FF]">
            <Terminal size={14} className="animate-pulse" />
            <span>[PRE-EXAM PHASE PROTOCOLS] // JAN 16 - JAN 31 & MAR 15 - APR 20</span>
          </div>
          {activeSession === "pre-exam" ? <ChevronUp size={16} className="text-[#00F0FF]" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>

        <AnimatePresence>
          {activeSession === "pre-exam" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 border-t border-white/5 space-y-4 text-xs leading-relaxed text-slate-300">
                <div className="bg-[#00F0FF]/5 p-3 rounded border border-[#00F0FF]/20 flex items-center gap-3">
                  <ShieldAlert className="text-[#00F0FF] shrink-0 animate-bounce" size={16} />
                  <span>
                    <strong>ALERT LEVEL BLUE:</strong> Final checklist sequence active. Certified papers and flashcard sweeps are mandatory before main lock-in days.
                  </span>
                </div>

                <div className="space-y-2 mt-4">
                  <span className="text-[10px] text-slate-500 uppercase block tracking-wider">Tactical Checkout Items:</span>
                  {checklist.map((item) => (
                    <label 
                      key={item.id} 
                      className={`flex items-start gap-3 p-2.5 rounded border transition-colors cursor-pointer select-none ${
                        item.checked 
                          ? "bg-slate-900/30 border-[#00F0FF]/15 text-slate-400" 
                          : "bg-white/2 border-white/5 text-slate-200 hover:bg-white/5"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={item.checked}
                        onChange={() => toggleCheck(item.id)}
                        className="mt-0.5 rounded border-white/20 bg-slate-900 text-[#00F0FF] focus:ring-0 focus:ring-offset-0 accent-[#00F0FF]"
                      />
                      <span className={item.checked ? "line-through" : ""}>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. [CRITICAL EXAM DAY STRATEGY] */}
      <div className="border border-white/10 bg-[#0A0A0F] rounded overflow-hidden shadow-xl font-mono">
        <button
          onClick={() => toggleSection("exam-day")}
          className="w-full flex items-center justify-between p-4 bg-[#12121A] hover:bg-[#12121A]/80 transition-colors text-left font-bold text-xs uppercase"
        >
          <div className="flex items-center gap-2 text-[#9D00FF]">
            <Flame size={14} className="animate-spin" style={{ animationDuration: '6s' }} />
            <span>[CRITICAL EXAM DAY STRATEGY] // LOCK-IN TIME ATTACK RULES</span>
          </div>
          {activeSession === "exam-day" ? <ChevronUp size={16} className="text-[#9D00FF]" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>

        <AnimatePresence>
          {activeSession === "exam-day" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 border-t border-white/5 space-y-6 text-xs leading-relaxed text-slate-350">
                
                {/* Visual vertical timeline */}
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block tracking-widest mb-3">Chronological Exam Timeline:</span>
                  
                  <div className="relative border-l border-white/10 pl-4 ml-2 space-y-4">
                    {/* Morning */}
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#9D00FF] shadow-[0_0_8px_rgba(157,0,255,0.6)]" />
                      <div className="font-bold text-slate-250 uppercase text-[11px] text-[#9D00FF]">07:00 – Morning Calibration</div>
                      <p className="text-slate-400 text-[10px] mt-0.5">Hydration sweep. Rapid-fire 10-minute mental warmups (no heavy calculations, formula index review only).</p>
                    </div>

                    {/* Afternoon */}
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                      <div className="font-bold text-slate-250 uppercase text-[11px] text-amber-500">12:30 – Mid-Day Maintenance</div>
                      <p className="text-slate-400 text-[10px] mt-0.5">High protein snack, mental blackout buffer zone (30-minute isolation from social clusters to maintain focus integrity).</p>
                    </div>

                    {/* Evening */}
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#00FF66] shadow-[0_0_8px_rgba(0,255,102,0.6)]" />
                      <div className="font-bold text-slate-250 uppercase text-[11px] text-[#00FF66]">18:00 – After-Action Strategy</div>
                      <p className="text-slate-400 text-[10px] mt-0.5">Apply post-exam isolation guardrails. Standardize log entry mistakes for later iteration loops.</p>
                    </div>
                  </div>
                </div>

                {/* Core Rules Block with Highlights */}
                <div className="space-y-3">
                  <span className="text-[10px] text-slate-500 uppercase block tracking-widest">TACTICAL DOCTRINES:</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="border border-white/5 bg-slate-950 p-3 rounded-md">
                      <div className="text-[#FFEA00] text-[10px] uppercase font-black mb-1">Rule 1: First Scan</div>
                      <p className="text-slate-450 text-[10px]">Spend first 2-3 mins mapping entire question layout. Identify top structures.</p>
                    </div>
                    <div className="border border-white/5 bg-slate-950 p-3 rounded-md">
                      <div className="text-[#FFEA00] text-[10px] uppercase font-black mb-1">Rule 2: Order of Attack</div>
                      <p className="text-slate-450 text-[10px]">Resolve [Easy ➔ Medium ➔ Hard]. Lock down easy baseline marks early.</p>
                    </div>
                    <div className="border border-white/5 bg-slate-950 p-3 rounded-md">
                      <div className="text-[#FFEA00] text-[10px] uppercase font-black mb-1">Rule 3: Golden Time</div>
                      <p className="text-slate-450 text-[10px]">Stuck for &gt; 2 mins with zero processing? Circle paper index &amp; MOVE.</p>
                    </div>
                  </div>
                </div>

                {/* Post-exam Protocol Panels */}
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase block tracking-widest mb-2">POST-EXAM COHORT PROTOCOL:</span>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 border border-rose-950/40 bg-rose-950/10 p-2.5 rounded flex items-center gap-3 text-slate-450 line-through text-[#FF0055]/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      DISCUSS ANSWERS IN CORRIDORS
                    </div>
                    <div className="flex-1 border border-rose-950/40 bg-rose-950/10 p-2.5 rounded flex items-center gap-3 text-slate-450 line-through text-[#FF0055]/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      OVERANALYZE MINOR FRACTION SHIFTS
                    </div>
                    <div className="flex-1 border border-green-950/40 bg-green-950/10 p-2.5 rounded flex items-center gap-3 text-[#00FF66] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
                      MOVE TO NEXT SUBJECT IMMEDIATELY
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. [GAP DAYS RECOVERY TIMELINE] */}
      <div className="border border-white/10 bg-[#0A0A0F] rounded overflow-hidden shadow-xl font-mono">
        <button
          onClick={() => toggleSection("gap-days")}
          className="w-full flex items-center justify-between p-4 bg-[#12121A] hover:bg-[#12121A]/80 transition-colors text-left font-bold text-xs uppercase"
        >
          <div className="flex items-center gap-2 text-[#FFEA00]">
            <Clock size={14} className="animate-pulse" />
            <span>[GAP DAYS RECOVERY TIMELINE] // CHRONO 3-DAY PROTOCOLS</span>
          </div>
          {activeSession === "gap-days" ? <ChevronUp size={16} className="text-[#FFEA00]" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>

        <AnimatePresence>
          {activeSession === "gap-days" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 border-t border-white/5 text-xs text-slate-350 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-white/5 bg-[#020205] p-3 rounded">
                    <span className="text-[#FFEA00] text-[10px] uppercase font-black block mb-2">INTERVAL DAY 1:</span>
                    <ul className="space-y-1.5 text-slate-400 text-[10.5px]">
                      <li>• Zero intense topic drilling allowed.</li>
                      <li>• Isolate previous mistake vault outputs.</li>
                      <li>• Perform 1-hour high-level thematic sweeps.</li>
                    </ul>
                  </div>

                  <div className="border border-white/5 bg-[#020205] p-3 rounded">
                    <span className="text-[#FFEA00] text-[10px] uppercase font-black block mb-2">INTERVAL DAY 2:</span>
                    <ul className="space-y-1.5 text-slate-400 text-[10.5px]">
                      <li>• Perform EXACT simulation under timer.</li>
                      <li>• Full 180-minute absolute isolation.</li>
                      <li>• Identify and log error traces to Mistake Vault.</li>
                    </ul>
                  </div>

                  <div className="border border-white/5 bg-[#020205] p-3 rounded">
                    <span className="text-[#FFEA00] text-[10px] uppercase font-black block mb-2">INTERVAL DAY 3:</span>
                    <ul className="space-y-1.5 text-slate-400 text-[10.5px]">
                      <li>• Micro-dose formulas and proof traces.</li>
                      <li>• Secure 8.5-hour deep sleep zone.</li>
                      <li>• Lock physical equipment buffers.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. [BIOMETRIC FUEL GUARDRAILS] */}
      <div className="border border-white/10 bg-[#0A0A0F] rounded overflow-hidden shadow-xl font-mono">
        <button
          onClick={() => toggleSection("biometric")}
          className="w-full flex items-center justify-between p-4 bg-[#12121A] hover:bg-[#12121A]/80 transition-colors text-left font-bold text-xs uppercase"
        >
          <div className="flex items-center gap-2 text-[#00FF66]">
            <Dumbbell size={14} />
            <span>[BIOMETRIC FUEL GUARDRAILS] // DIAGNOस्टिक CONTROL</span>
          </div>
          {activeSession === "biometric" ? <ChevronUp size={16} className="text-[#00FF66]" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>

        <AnimatePresence>
          {activeSession === "biometric" && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 border-t border-white/5 text-xs text-slate-350 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* sleep */}
                  <div className="border border-white/5 bg-slate-950 p-3 rounded-md flex items-start gap-3">
                    <Clock size={16} className="text-[#00FF66] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-200 uppercase font-black block text-[10px]">SLEEP BUFFER PROTOCOL</span>
                      <p className="text-slate-400 text-[10px] mt-1 leading-relaxed">
                        Secure a persistent 8.5-hour sleep interval. Non-REM cycles from 22:30 essential for memory trace consolidating.
                      </p>
                    </div>
                  </div>

                  {/* nutrition */}
                  <div className="border border-white/5 bg-slate-950 p-3 rounded-md flex items-start gap-3">
                    <Zap size={16} className="text-[#00FF66] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-200 uppercase font-black block text-[10px]">PRE-EXAM FUEL MATRIX</span>
                      <p className="text-slate-400 text-[10px] mt-1 leading-relaxed">
                        High protein intake. Suppress refined sugar clusters to prevent mid-simulation mental crash or dopamine instability.
                      </p>
                    </div>
                  </div>

                  {/* screen blackout */}
                  <div className="border border-white/5 bg-slate-950 p-3 rounded-md flex items-start gap-3">
                    <EyeOff size={16} className="text-[#00FF66] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-200 uppercase font-black block text-[10px]">ABSOLUTE DISPLAY BLACKOUT</span>
                      <p className="text-slate-400 text-[10px] mt-1 leading-relaxed">
                        Perform a strict screen blackout starting 21:00 before locks. Suppress light waveforms to protect natural sleep rhythms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
