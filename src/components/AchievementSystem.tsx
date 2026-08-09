import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Award, Zap, Flame, Clock, Target, CheckCircle, Shield, BrainCircuit } from "lucide-react";
import { TestAnalytics, FocusSession, SubjectConfig } from "../types";

interface AchievementSystemProps {
  tests: TestAnalytics[];
  focusSessions: FocusSession[];
  userSubjects: SubjectConfig[];
}

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  color: string;
}

export default function AchievementSystem({ tests, focusSessions, userSubjects }: AchievementSystemProps) {
  // Calculate Achievements
  const badges = useMemo(() => {
    // 1. First Step: First test logged
    const hasFirstTest = tests.length > 0;
    
    // 2. Perfect Score: Got 100% on any test
    const hasPerfectScore = tests.some(t => t.percentage === 100);
    
    // 3. Deep Worker: Has a focus session >= 50m
    const hasDeepWork = focusSessions.some(f => f.durationMinutes >= 50);

    // 4. Persistence: Completed more than 5 focus sessions
    const hasPersistence = focusSessions.length >= 5;

    // 5. Syllabus Initiated: Completed at least one topic across any subject
    const topicsCompleted = userSubjects.reduce((acc, sub) => acc + (sub.completedTopics?.length || 0), 0);
    const hasTopicsCompleted = topicsCompleted > 0;

    // 6. Hyper-Focus Master: 3+ hours total focus time
    const totalFocusMinutes = focusSessions.reduce((acc, f) => acc + f.durationMinutes, 0);
    const hasHyperFocus = totalFocusMinutes >= 180;

    // 7. Streak Master: 3 days streak
    const hasStreak = (() => {
      if (focusSessions.length === 0) return false;
      const sorted = [...focusSessions].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
      
      let longestStreak = 0;
      let currentStreak = 0;
      let prevTs: number | null = null;
      
      sorted.forEach(session => {
        const d = new Date(session.completedAt);
        const y = d.getFullYear();
        const m = d.getMonth();
        const date = d.getDate();
        const ts = new Date(y, m - 1, date).getTime();
        
        if (prevTs === null) {
          currentStreak = 1;
        } else {
          const diffDays = Math.round((prevTs - ts) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            currentStreak++;
          } else if (diffDays > 1) {
            currentStreak = 1;
          }
        }
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
        prevTs = ts;
      });
      return longestStreak >= 3;
    })();

    const list: Badge[] = [
      {
        id: "first-step",
        title: "FIRST BLOOD",
        description: "Logged your first test score.",
        icon: Target,
        unlocked: hasFirstTest,
        color: "text-blue-400 border-blue-400/50 bg-blue-500/10"
      },
      {
        id: "perfect-score",
        title: "FLAWLESS EXECUTION",
        description: "Achieved a perfect 100% on a test.",
        icon: Award,
        unlocked: hasPerfectScore,
        color: "text-amber-400 border-amber-400/50 bg-amber-500/10"
      },
      {
        id: "deep-work",
        title: "NEURAL DIVE",
        description: "Completed a focus session of 50m or more.",
        icon: BrainCircuit,
        unlocked: hasDeepWork,
        color: "text-purple-400 border-purple-400/50 bg-purple-500/10"
      },
      {
        id: "persistence",
        title: "PERSISTENCE",
        description: "Completed 5+ focus sessions.",
        icon: Shield,
        unlocked: hasPersistence,
        color: "text-emerald-400 border-emerald-400/50 bg-emerald-500/10"
      },
      {
        id: "hyper-focus",
        title: "TIME LORD",
        description: "Accumulated 3+ hours of deep focus.",
        icon: Clock,
        unlocked: hasHyperFocus,
        color: "text-cyan-400 border-cyan-400/50 bg-cyan-500/10"
      },
      {
        id: "syllabus-init",
        title: "IGNITION",
        description: "Completed your first syllabus topic.",
        icon: Zap,
        unlocked: hasTopicsCompleted,
        color: "text-[#00FF66] border-[#00FF66]/50 bg-[#00FF66]/10"
      },
      {
        id: "streak",
        title: "MOMENTUM",
        description: "Maintained a 3-day focus streak.",
        icon: Flame,
        unlocked: hasStreak,
        color: "text-red-500 border-red-500/50 bg-red-500/10"
      }
    ];

    return list;
  }, [tests, focusSessions, userSubjects]);

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="border border-white/5 bg-[#12121A]/80 p-5 rounded-xl text-slate-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 py-1 px-2.5 bg-indigo-500/15 border-l border-b border-indigo-500/20 text-indigo-400 font-black text-[9px] uppercase tracking-widest rounded-bl">
        ACHIEVEMENT MATRIX OVERRIDE
      </div>
      
      <div className="flex items-center justify-between mb-4 mt-2">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide">
          <Award className="text-indigo-400" size={16} />
          SYSTEM MILESTONES
        </h3>
        <div className="text-[10px] font-mono text-indigo-300 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
          UNLOCKED: {unlockedCount} / {badges.length}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {badges.map((badge, idx) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`relative p-3 rounded-xl border flex items-start gap-3 \${
              badge.unlocked 
                ? \`\${badge.color} shadow-lg\` 
                : "border-white/5 bg-[#0A0A0F] text-slate-600 opacity-60"
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 \${badge.unlocked ? "bg-[#0A0A0F]/50" : "bg-white/5"}`}>
              <badge.icon size={18} className={badge.unlocked ? "" : "text-slate-600"} />
            </div>
            <div>
              <h4 className={`text-[10px] font-black uppercase tracking-wider mb-0.5 \${badge.unlocked ? "text-slate-100" : "text-slate-500"}`}>
                {badge.title}
              </h4>
              <p className="text-[9px] leading-tight font-sans">
                {badge.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
