import { motion, AnimatePresence } from "motion/react";
import { Activity, ShieldAlert, Cpu, Orbit, Clock } from "lucide-react";
import { UserPhase } from "../types";

interface HeroHeaderProps {
  engineState: UserPhase;
  onOverride: (phase: number | null) => void;
}

export default function HeroHeader({ engineState, onOverride }: HeroHeaderProps) {
  const getPhaseName = (id: number) => {
    switch (id) {
      case 1:
        return "PHASE 1: FOUNDATION";
      case 2:
        return "PHASE 2: ACTIVE RECALL";
      case 3:
        return "PHASE 3: PAST PAPER MARATHON";
      default:
        return "UNKNOWN STRATEGY PHASE";
    }
  };

  const getPhaseDetail = (id: number) => {
    switch (id) {
      case 1:
        return "Apr 1 – Jun 1 (Introduction, Textbook Drills, Topical Terminology Practice)";
      case 2:
        return "Jun 1 – Oct 1 (5-Day Study Rotation, Interactive Flashcard Sweeps)";
      case 3:
        return "Oct 1 – Jan 15 (270 Past Papers, Strict 105-Day Rotation, Time Attacks)";
      default:
        return "";
    }
  };

  return (
    <header className="relative w-full border border-white/10 bg-[#12121A]/60 backdrop-blur-md p-6 rounded-lg overflow-hidden select-none shadow-2xl mb-6">
      {/* Scanline Visual Grid effect */}
      <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-40" />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent animate-scanline pointer-events-none" />

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00F0FF]/60" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00F0FF]/60" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00F0FF]/60" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00F0FF]/60" />

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 z-10">
        <div>
          {/* Main system header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00FF66]"></span>
            </div>
            
            <h1 
              className="text-2xl md:text-3xl font-mono font-black tracking-widest text-slate-100 glitch-text"
              data-text="CORE ACADEMIC ENGINE"
            >
              CORE ACADEMIC ENGINE
            </h1>
            
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase border border-[#00FF66]/30 bg-[#00FF66]/10 px-2 py-0.5 rounded text-[#00FF66] tracking-widest">
              SYSTEM ONLINE // APLET ACTIVE
            </span>
          </div>
          
          <p className="font-mono text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
            ACTIVE PORTFOLIO & HISTORICAL TESTING CONTROLLER. CALCULATING REAL-TIME COMPILER PHASES AND EXAM COMPILATION INTERVALS FOR THE 2026 COHORT.
          </p>
        </div>

        {/* Real-time calculated status or indicators */}
        <div className="flex items-center gap-4 bg-[#0A0A0F]/80 border border-white/5 p-3 rounded-md min-w-[200px] font-mono text-xs">
          <Activity className="text-[#00F0FF] shrink-0 animate-pulse" size={18} />
          <div>
            <div className="text-slate-500 uppercase tracking-widest text-[9px]">Calculated Local Epoch</div>
            <div className="text-slate-300 font-bold flex items-center gap-1">
              <Clock size={12} className="text-[#FFEA00]" />
              2026-05-20 AM
            </div>
          </div>
        </div>
      </div>

      {/* Visual Phase Dashboard Segment */}
      <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center z-10 relative">
        
        {/* SVG Neon Ring Pulser */}
        <div className="lg:col-span-3 flex justify-center py-4">
          <div className="relative flex items-center justify-center w-36 h-36">
            {/* Pulsing svg neon loops */}
            <svg className="w-full h-full transform -rotate-90">
              {/* External Ring */}
              <circle 
                cx="72" cy="72" r="66" 
                stroke="rgba(255,255,255,0.03)" 
                strokeWidth="2" 
                fill="transparent" 
              />
              {/* Dynamic glowing loops depending on current phase status */}
              <circle 
                cx="72" cy="72" r="60" 
                stroke={engineState.activePhaseId === 1 ? "#00F0FF" : engineState.activePhaseId === 2 ? "#9D00FF" : "#FF0055"} 
                strokeWidth="4" 
                className="transition-all duration-700"
                strokeDasharray="377"
                strokeDashoffset={engineState.activePhaseId === 1 ? "251" : engineState.activePhaseId === 2 ? "126" : "0"}
                fill="transparent" 
              />
              <circle 
                cx="72" cy="72" r="50" 
                stroke="white" 
                strokeWidth="1" 
                strokeDasharray="10 15"
                className="opacity-20 animate-spin"
                style={{ animationDuration: '24s' }}
                fill="transparent" 
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <Orbit className={`animate-spin text-slate-500`} style={{ animationDuration: '12s' }} size={20} />
              <span className="text-2xl font-mono font-extrabold text-[#E2E8F0] mt-1">P.{engineState.activePhaseId}</span>
              <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider">ACTIVE STRAT</span>
            </div>
          </div>
        </div>

        {/* Phase textual details */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono text-slate-500 tracking-widest">Active State Protocol:</span>
            {engineState.currentOverrideState !== null && (
              <span className="font-mono text-[9px] border border-[#FFEA00]/30 bg-[#FFEA00]/10 px-1.5 rounded text-[#FFEA00] uppercase animate-pulse">
                OVERRIDE ACTIVE
              </span>
            )}
          </div>
          
          <h2 className="text-xl font-mono font-bold text-slate-100 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${engineState.activePhaseId === 1 ? "bg-[#00F0FF]" : engineState.activePhaseId === 2 ? "bg-[#9D00FF]" : "bg-[#FF0055]"}`} />
            {getPhaseName(engineState.activePhaseId)}
          </h2>
          
          <p className="text-sm font-mono text-slate-300 mt-2 leading-relaxed bg-[#0A0A0F]/60 p-3 rounded border border-white/5">
            {getPhaseDetail(engineState.activePhaseId)}
          </p>

          <p className="text-[11px] font-mono text-[#00FF66] mt-2 flex items-center gap-1">
            <ShieldAlert size={12} />
            Calculated auto-state based on Epoch: <strong className="underline">Phase {engineState.systemCalculatedPhase}</strong>.
          </p>
        </div>

        {/* Override controls */}
        <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
          <span className="text-xs font-mono text-slate-400 tracking-widest uppercase text-left">Manual Override Core State:</span>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-2">
            <button
              id="btn-phase-1"
              onClick={() => onOverride(1)}
              className={`p-2 rounded font-mono text-xs uppercase tracking-wider border transition-all ${
                engineState.activePhaseId === 1 
                  ? "bg-[#00F0FF]/15 border-[#00F0FF] text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.2)] font-bold"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              PHASE 1
            </button>
            <button
              id="btn-phase-2"
              onClick={() => onOverride(2)}
              className={`p-2 rounded font-mono text-xs uppercase tracking-wider border transition-all ${
                engineState.activePhaseId === 2 
                  ? "bg-[#9D00FF]/15 border-[#9D00FF] text-[#9D00FF] shadow-[0_0_10px_rgba(157,0,255,0.2)] font-bold"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              PHASE 2
            </button>
            <button
              id="btn-phase-3"
              onClick={() => onOverride(3)}
              className={`p-2 rounded font-mono text-xs uppercase tracking-wider border transition-all ${
                engineState.activePhaseId === 3 
                  ? "bg-[#FF0055]/15 border-[#FF0055] text-[#FF0055] shadow-[0_0_10px_rgba(255,0,85,0.2)] font-bold"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              PHASE 3
            </button>
            <button
              id="btn-phase-auto"
              onClick={() => onOverride(null)}
              className={`p-2 rounded font-mono text-xs uppercase tracking-wider border transition-all ${
                engineState.currentOverrideState === null 
                  ? "bg-[#00FF66]/15 border-[#00FF66] text-[#00FF66] shadow-[0_0_10px_rgba(0,255,102,0.2)] font-bold"
                  : "bg-slate-900 border-white/5 text-slate-500 hover:bg-white/5 hover:text-slate-300"
              }`}
            >
              AUTO REAL-TIME
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
