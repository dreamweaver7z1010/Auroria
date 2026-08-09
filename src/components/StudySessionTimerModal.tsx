import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Play, Pause, RotateCcw, CheckCircle, Volume2, VolumeX, 
  Sparkles, Timer as TimerIcon, Award, Zap, Bell, Target, ArrowRight,
  Flame, Clock, Check
} from "lucide-react";
import { SubjectConfig, FocusSession } from "../types";

interface StudySessionTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSubjects: SubjectConfig[];
  onLogSession: (session: Omit<FocusSession, "id" | "completedAt">) => Promise<void> | void;
  // External timer state sync so it can run in background
  timerState: {
    isRunning: boolean;
    isPaused: boolean;
    isCompleted: boolean;
    timeRemaining: number;
    totalSeconds: number;
    subject: string;
    preset: string;
    notes: string;
    hasLogged?: boolean;
  };
  setTimerState: React.Dispatch<React.SetStateAction<{
    isRunning: boolean;
    isPaused: boolean;
    isCompleted: boolean;
    timeRemaining: number;
    totalSeconds: number;
    subject: string;
    preset: string;
    notes: string;
    hasLogged?: boolean;
  }>>;
}

export default function StudySessionTimerModal({
  isOpen,
  onClose,
  userSubjects,
  onLogSession,
  timerState,
  setTimerState
}: StudySessionTimerModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<"25m" | "50m" | "15m" | "90m" | "custom">(
    (timerState.preset as any) || "25m"
  );
  const [customMinutes, setCustomMinutes] = useState<number>(30);
  const [selectedSubject, setSelectedSubject] = useState<string>(
    timerState.subject || userSubjects[0]?.name || "Mathematics"
  );
  const [notes, setNotes] = useState<string>(timerState.notes || "");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [autoLogged, setAutoLogged] = useState<boolean>(false);

  // Audio Context ref for synthesized chime
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synchronize initial subject if empty
  useEffect(() => {
    if (!selectedSubject && userSubjects.length > 0) {
      setSelectedSubject(userSubjects[0].name);
    }
  }, [userSubjects]);

  // Play synthesized completion chime using Web Audio API
  const playCompletionChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      
      const now = ctx.currentTime;
      // Multi-note ascending cyber chord (C5 -> E5 -> G5 -> C6)
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        
        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.85);
      });
    } catch (e) {
      console.warn("Audio Context init blocked by browser policy:", e);
    }
  };

  // Play subtle tick/click tone on button actions
  const playClickTone = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {
      // ignore
    }
  };

  // Duration in minutes helper
  const getPresetDurationMinutes = (preset: string): number => {
    if (preset === "25m") return 25;
    if (preset === "50m") return 50;
    if (preset === "15m") return 15;
    if (preset === "90m") return 90;
    if (preset === "custom") return Math.max(1, customMinutes);
    return 25;
  };

  // Handle Preset Selection
  const handleSelectPreset = (p: "25m" | "50m" | "15m" | "90m" | "custom") => {
    playClickTone();
    setSelectedPreset(p);
    if (!timerState.isRunning && !timerState.isPaused) {
      const mins = getPresetDurationMinutes(p);
      const totalSec = mins * 60;
      setTimerState(prev => ({
        ...prev,
        preset: p,
        totalSeconds: totalSec,
        timeRemaining: totalSec,
        isCompleted: false,
        isRunning: false,
        isPaused: false,
        hasLogged: false
      }));
    }
  };

  // Handle Start Timer
  const handleStart = () => {
    playClickTone();
    const mins = getPresetDurationMinutes(selectedPreset);
    const totalSec = timerState.timeRemaining > 0 ? timerState.timeRemaining : mins * 60;
    
    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      isCompleted: false,
      totalSeconds: prev.totalSeconds > 0 ? prev.totalSeconds : totalSec,
      timeRemaining: totalSec,
      subject: selectedSubject,
      preset: selectedPreset,
      notes,
      hasLogged: false
    }));
    setAutoLogged(false);
  };

  // Handle Pause Timer
  const handlePause = () => {
    playClickTone();
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: true
    }));
  };

  // Handle Reset Timer
  const handleReset = () => {
    playClickTone();
    const mins = getPresetDurationMinutes(selectedPreset);
    const totalSec = mins * 60;
    setTimerState({
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      timeRemaining: totalSec,
      totalSeconds: totalSec,
      subject: selectedSubject,
      preset: selectedPreset,
      notes: "",
      hasLogged: false
    });
    setAutoLogged(false);
  };

  // Manual Log Session
  const handleManualLog = async () => {
    playClickTone();
    const minutesFocused = Math.max(
      1,
      Math.round((timerState.totalSeconds - timerState.timeRemaining) / 60) ||
        getPresetDurationMinutes(selectedPreset)
    );

    await onLogSession({
      subject: selectedSubject,
      durationMinutes: minutesFocused,
      notes: notes.trim() || `Focused ${minutesFocused}m session on ${selectedSubject}`,
      preset: selectedPreset
    });

    setAutoLogged(true);
    setTimerState(prev => ({ ...prev, hasLogged: true }));
  };

  // Time remaining formatted string MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Calculate SVG stroke offset for circular progress bar
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = timerState.totalSeconds > 0 
    ? ((timerState.totalSeconds - timerState.timeRemaining) / timerState.totalSeconds)
    : 0;
  const strokeDashoffset = circumference - progressPercent * circumference;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl max-h-[95vh] flex flex-col bg-[#0A0A0F] border border-[#00F0FF]/30 rounded-2xl shadow-2xl shadow-[#00F0FF]/10 overflow-hidden text-slate-200"
        >
          {/* Header Banner */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#12121A]/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 animate-pulse">
                <TimerIcon size={18} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-wide text-slate-100 uppercase flex items-center gap-2">
                  FOCUS STUDY SESSION TIMER
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold border border-purple-500/30">
                    SABER CORE
                  </span>
                </h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Deep Work Engine // Precision Academic Time Block Tracker
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  soundEnabled
                    ? "bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/30"
                    : "bg-white/5 text-slate-500 border-white/10"
                }`}
                title={soundEnabled ? "Audio Cues Enabled" : "Audio Cues Muted"}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
            
            {/* Top Config Row: Presets & Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Preset Selector Buttons */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5">
                  <Clock size={12} className="text-[#00F0FF]" /> Select Session Block Preset
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: "25m", label: "25M", desc: "Pomodoro" },
                    { id: "50m", label: "50M", desc: "Deep Work" },
                    { id: "15m", label: "15M", desc: "Review" },
                    { id: "90m", label: "90M", desc: "Marathon" }
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPreset(p.id as any)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedPreset === p.id
                          ? "bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF] font-black shadow-lg shadow-[#00F0FF]/10 scale-[1.02]"
                          : "bg-[#12121A] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200 font-bold"
                      }`}
                    >
                      <div className="text-xs uppercase">{p.label}</div>
                      <div className="text-[8.5px] opacity-70 font-normal">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enrolled Subject Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5">
                  <Target size={12} className="text-purple-400" /> Target Enrolled Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setTimerState(prev => ({ ...prev, subject: e.target.value }));
                  }}
                  className="w-full bg-[#12121A] border border-white/10 rounded-xl p-2.5 text-xs text-slate-100 font-bold focus:border-[#00F0FF] focus:outline-none"
                >
                  {userSubjects.map(s => (
                    <option key={s.name} value={s.name}>
                      {s.name.toUpperCase()} (AS/A LEVEL)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Minutes Input if Custom Selected */}
            {selectedPreset === "custom" && (
              <div className="p-3 bg-[#12121A] border border-purple-500/30 rounded-xl flex items-center gap-3">
                <span className="text-xs font-bold text-purple-300 uppercase">Custom Minutes (1-180):</span>
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={customMinutes}
                  onChange={(e) => {
                    const v = Math.min(180, Math.max(1, parseInt(e.target.value) || 1));
                    setCustomMinutes(v);
                    const totalSec = v * 60;
                    setTimerState(prev => ({
                      ...prev,
                      totalSeconds: totalSec,
                      timeRemaining: totalSec
                    }));
                  }}
                  className="w-20 bg-black border border-purple-500/40 rounded-lg p-1.5 text-xs text-center text-purple-300 font-bold focus:outline-none"
                />
              </div>
            )}

            {/* Main Interactive Circular Timer Canvas */}
            <div className="flex flex-col items-center justify-center py-2 relative">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                
                {/* Outer Ambient Pulsing Ring */}
                <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
                  timerState.isRunning 
                    ? "border-[#00F0FF]/30 shadow-[0_0_30px_rgba(0,240,255,0.2)] animate-pulse" 
                    : timerState.isCompleted 
                    ? "border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)]" 
                    : "border-white/5"
                }`} />

                {/* SVG Progress Ring */}
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    className="stroke-white/10"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  {/* Dynamic Gradient Progress Track */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke="url(#timerGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-linear"
                  />
                  <defs>
                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00F0FF" />
                      <stop offset="50%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#00FF66" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center Digital Display Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  
                  {/* Status Tag */}
                  <div className="mb-1">
                    {timerState.isCompleted ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 animate-bounce">
                        <Check size={11} /> DRILL COMPLETED!
                      </span>
                    ) : timerState.isRunning ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
                        FOCUSING ACTIVE
                      </span>
                    ) : timerState.isPaused ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-black uppercase tracking-widest">
                        PAUSED
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-400 border border-white/10 text-[9px] font-black uppercase tracking-widest">
                        READY TO DRILL
                      </span>
                    )}
                  </div>

                  {/* Main Glowing Digital Timer MM:SS */}
                  <div className={`text-3xl sm:text-4xl font-black tracking-tight font-mono transition-all ${
                    timerState.isCompleted 
                      ? "text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                      : timerState.isRunning 
                      ? "text-[#00F0FF] drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]" 
                      : "text-slate-100"
                  }`}>
                    {formatTime(timerState.timeRemaining)}
                  </div>

                  {/* Target Subject Tag */}
                  <div className="mt-2 text-[10px] text-purple-300 font-extrabold uppercase bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
                    {selectedSubject}
                  </div>

                  {/* Percentage Completed */}
                  <div className="mt-1 text-[9px] text-slate-500 font-bold uppercase">
                    {Math.round(progressPercent * 100)}% ELAPSED
                  </div>
                </div>
              </div>
            </div>

            {/* Focus Goal & Notes Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#00F0FF]" /> Focus Target / Objective Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Calculus Integration P1 topical questions, Organic Mechanisms review"
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setTimerState(prev => ({ ...prev, notes: e.target.value }));
                }}
                className="w-full bg-[#12121A] border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-[#00F0FF] focus:outline-none"
              />
            </div>

            {/* Main Action Buttons Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              {!timerState.isRunning ? (
                <button
                  onClick={handleStart}
                  className="flex-1 max-w-xs py-3 rounded-xl bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#00F0FF]/20 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <Play size={16} fill="black" /> {timerState.isPaused ? "RESUME FOCUS" : "START FOCUS SESSION"}
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="flex-1 max-w-xs py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <Pause size={16} fill="black" /> PAUSE SESSION
                </button>
              )}

              <button
                onClick={handleReset}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-slate-200 cursor-pointer transition-all"
                title="Reset Timer"
              >
                <RotateCcw size={16} />
              </button>

              <button
                onClick={handleManualLog}
                disabled={autoLogged || timerState.hasLogged}
                className={`px-4 py-3 rounded-xl border text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer transition-all ${
                  (autoLogged || timerState.hasLogged)
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-500/40"
                }`}
              >
                <CheckCircle size={15} /> {(autoLogged || timerState.hasLogged) ? "LOGGED!" : "LOG SESSION"}
              </button>
            </div>

            {/* Quick Tip Footer */}
            <div className="p-3 rounded-xl bg-[#12121A] border border-white/5 text-[10px] text-slate-400 flex items-center gap-2">
              <Zap size={14} className="text-[#00F0FF] shrink-0" />
              <span>
                <strong>PRO TIP:</strong> You can close this modal while the timer is running! A live focus tracker pill will stay active in the top portal header bar.
              </span>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
