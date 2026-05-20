import { SubjectId, SubjectAccentMeta } from "../types";

export const SUBJECT_THEME_MAP: Record<SubjectId, SubjectAccentMeta> = {
  "Chemistry": {
    color: "#00F0FF",
    glowClass: "shadow-[0_0_15px_rgba(0,240,255,0.25)] bg-[#00F0FF]/5 hover:bg-[#00F0FF]/10 border-[#00F0FF]/45",
    textClass: "text-[#00F0FF]",
    borderClass: "border-[#00F0FF]/40"
  },
  "Physics": {
    color: "#9D00FF",
    glowClass: "shadow-[0_0_15px_rgba(157,0,255,0.25)] bg-[#9D00FF]/5 hover:bg-[#9D00FF]/10 border-[#9D00FF]/45",
    textClass: "text-[#9D00FF]",
    borderClass: "border-[#9D00FF]/40"
  },
  "Math": {
    color: "#FFEA00",
    glowClass: "shadow-[0_0_15px_rgba(255,234,0,0.25)] bg-[#FFEA00]/5 hover:bg-[#FFEA00]/10 border-[#FFEA00]/45",
    textClass: "text-[#FFEA00]",
    borderClass: "border-[#FFEA00]/40"
  },
  "Computer Science": {
    color: "#00FF66",
    glowClass: "shadow-[0_0_15px_rgba(0,255,102,0.25)] bg-[#00FF66]/5 hover:bg-[#00FF66]/10 border-[#00FF66]/45",
    textClass: "text-[#00FF66]",
    borderClass: "border-[#00FF66]/40"
  },
  "English": {
    color: "#FF0055",
    glowClass: "shadow-[0_0_15px_rgba(255,0,85,0.25)] bg-[#FF0055]/5 hover:bg-[#FF0055]/10 border-[#FF0055]/45",
    textClass: "text-[#FF0055]",
    borderClass: "border-[#FF0055]/40"
  }
};

export function getSubjectAccent(subject: string): SubjectAccentMeta {
  const norm = subject.trim();
  // Match substrings or defaults
  if (norm.toLowerCase().includes("chem")) return SUBJECT_THEME_MAP["Chemistry"];
  if (norm.toLowerCase().includes("phys")) return SUBJECT_THEME_MAP["Physics"];
  if (norm.toLowerCase().includes("math") || norm.toLowerCase().includes("calc")) return SUBJECT_THEME_MAP["Math"];
  if (norm.toLowerCase().includes("computer") || norm.toLowerCase().includes("cs") || norm.toLowerCase().includes("algorithm")) return SUBJECT_THEME_MAP["Computer Science"];
  if (norm.toLowerCase().includes("eng") || norm.toLowerCase().includes("liter")) return SUBJECT_THEME_MAP["English"];
  
  // Default fallback is grey/slate neon border
  return {
    color: "#94A3B8",
    glowClass: "shadow-[0_0_15px_rgba(148,163,184,0.15)] bg-slate-900/50 border-slate-700",
    textClass: "text-slate-400",
    borderClass: "border-slate-700"
  };
}
