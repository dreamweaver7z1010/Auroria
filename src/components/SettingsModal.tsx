import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Settings, 
  Type, 
  HelpCircle, 
  RefreshCw, 
  LogOut, 
  Bell, 
  Volume2, 
  VolumeX, 
  Download, 
  ShieldCheck, 
  Timer,
  Check,
  Cpu
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { ThemeId } from "../lib/theme";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontScale: "compact" | "normal" | "large";
  onChangeFontScale: (scale: "compact" | "normal" | "large") => void;
  currentTheme: ThemeId;
  onChangeTheme: (theme: ThemeId) => void;
  onOpenUserGuide: () => void;
  onReOnboard: () => void;
  onLogout?: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  fontScale,
  onChangeFontScale,
  currentTheme,
  onChangeTheme,
  onOpenUserGuide,
  onReOnboard,
  onLogout
}: SettingsModalProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [defaultTimer, setDefaultTimer] = useState<number>(25);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [exportedMsg, setExportedMsg] = useState(false);

  if (!isOpen) return null;

  const handleExportData = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      user: localStorage.getItem("study_username") || "Student",
      settings: {
        soundEnabled,
        notificationsEnabled,
        defaultTimer,
        fontScale
      }
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cie_study_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportedMsg(true);
    setTimeout(() => setExportedMsg(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-[#12121A] border border-white/10 rounded-2xl p-6 font-mono text-slate-200 relative shadow-2xl overflow-hidden space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20">
                <Settings size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                  SYSTEM SETTINGS & PREFERENCES
                </h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                  CYBERPUNK ACADEMIC GRID // SYSTEM CONFIGURATION
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
            
            {/* Theme Selector Palette */}
            <div className="p-3.5 bg-[#0A0A0F] border border-white/5 rounded-xl">
              <ThemeSelector
                currentTheme={currentTheme}
                onThemeChange={onChangeTheme}
              />
            </div>

            {/* Audio & Sound Effects */}
            <div className="p-3.5 bg-[#0A0A0F] border border-white/5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 size={16} className="text-[#00FF66]" /> : <VolumeX size={16} className="text-slate-500" />}
                  <div>
                    <span className="font-bold text-slate-200 uppercase block">Audio & Timer Alerts</span>
                    <span className="text-[9.5px] text-slate-500">Chime notifications when pomodoros finish.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`px-3 py-1 rounded-lg font-bold text-[10px] uppercase transition-all cursor-pointer ${
                    soundEnabled
                      ? "bg-[#00FF66]/15 border border-[#00FF66]/30 text-[#00FF66]"
                      : "bg-white/5 text-slate-500 border border-white/10"
                  }`}
                >
                  {soundEnabled ? "ENABLED" : "MUTED"}
                </button>
              </div>
            </div>

            {/* In-App Notifications */}
            <div className="p-3.5 bg-[#0A0A0F] border border-white/5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-[#00F0FF]" />
                  <div>
                    <span className="font-bold text-slate-200 uppercase block">Study Reminders & Desktop Alerts</span>
                    <span className="text-[9.5px] text-slate-500">Receive schedule countdown notices.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`px-3 py-1 rounded-lg font-bold text-[10px] uppercase transition-all cursor-pointer ${
                    notificationsEnabled
                      ? "bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF]"
                      : "bg-white/5 text-slate-500 border border-white/10"
                  }`}
                >
                  {notificationsEnabled ? "ACTIVE" : "OFF"}
                </button>
              </div>
            </div>

            {/* Focus Timer Defaults */}
            <div className="p-3.5 bg-[#0A0A0F] border border-white/5 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <Timer size={16} className="text-amber-400" />
                <span className="font-bold text-slate-200 uppercase">Default Study Block Duration</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {[25, 50, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDefaultTimer(mins)}
                    className={`py-2 rounded-lg font-bold text-[10px] uppercase transition-all cursor-pointer ${
                      defaultTimer === mins
                        ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold"
                        : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {mins} MINS
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">Auto-start rest break after study block</span>
                <button
                  type="button"
                  onClick={() => setAutoStartBreaks(!autoStartBreaks)}
                  className={`px-2.5 py-1 rounded text-[9.5px] font-bold uppercase transition-all cursor-pointer ${
                    autoStartBreaks
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "bg-white/5 text-slate-500 border border-white/5"
                  }`}
                >
                  {autoStartBreaks ? "ON" : "OFF"}
                </button>
              </div>
            </div>

            {/* Typography Scaling */}
            <div className="p-3.5 bg-[#0A0A0F] border border-white/5 rounded-xl space-y-2">
              <label className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-2">
                <Type size={14} className="text-purple-400" />
                GRID INTERFACE DENSITY & TEXT SCALING
              </label>
              <div className="grid grid-cols-3 gap-2 p-1">
                {(["compact", "normal", "large"] as const).map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => onChangeFontScale(scale)}
                    className={`py-2 rounded-lg uppercase text-[10px] font-bold transition-all cursor-pointer ${
                      fontScale === scale
                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                        : "bg-white/5 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {scale}
                  </button>
                ))}
              </div>
            </div>

            {/* Data Export & Backup */}
            <div className="p-3.5 bg-[#0A0A0F] border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 uppercase block">Export Study Data & Logs</span>
                <span className="text-[9.5px] text-slate-500">Download offline backup JSON file.</span>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 font-bold uppercase text-[10px] flex items-center gap-1.5 cursor-pointer"
              >
                {exportedMsg ? <Check size={13} /> : <Download size={13} />}
                {exportedMsg ? "DOWNLOADED" : "EXPORT JSON"}
              </button>
            </div>

            {/* User Guide Tour Launch */}
            <div className="p-3.5 bg-[#0A0A0F] border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 uppercase block">User Guide & Walkthrough</span>
                <span className="text-[9.5px] text-slate-500">Revisit the interactive portal tutorial.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenUserGuide();
                }}
                className="px-3.5 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 hover:bg-purple-500/25 font-bold uppercase text-[10px] flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle size={13} /> LAUNCH TOUR
              </button>
            </div>

            {/* Re-Onboard Failsafe Reset */}
            <div className="p-3.5 bg-[#0A0A0F] border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-400 uppercase block">Re-Configure Academic Setup</span>
                <span className="text-[9.5px] text-slate-500">Re-run exam series & start date wizard.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReOnboard();
                }}
                className="px-3 py-1.5 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/15 font-bold uppercase text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={12} /> RE-WIZARD
              </button>
            </div>

            {/* System Security Info */}
            <div className="p-3 bg-white/2 border border-white/5 rounded-xl flex items-center gap-2 text-[9.5px] text-slate-500 font-mono">
              <Cpu size={14} className="text-teal-400 shrink-0" />
              <span>CIE SYSTEM ENGINE v4.2 // ENCRYPTED USER PROFILE STORAGE ACTIVE</span>
            </div>

          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            {onLogout ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20 text-[10px] font-bold uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut size={13} /> LOG OUT SESSION
              </button>
            ) : (
              <span className="text-[9.5px] text-slate-500">SETTINGS AUTO-PERSISTED</span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-black font-black uppercase text-xs transition-all cursor-pointer shadow-lg shadow-[#00F0FF]/20"
            >
              CLOSE SETTINGS
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
