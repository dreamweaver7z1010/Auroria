import React, { useMemo } from "react";
import { FocusSession } from "../types";

interface StudyStreakCalendarProps {
  focusSessions: FocusSession[];
}

export default function StudyStreakCalendar({ focusSessions }: StudyStreakCalendarProps) {
  const { dateSet, todayStr } = useMemo(() => {
    const set = new Set<string>();
    
    const toLocalDateStr = (dateInput: string | number | Date) => {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return null;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    focusSessions.forEach(s => {
      if (s.completedAt) {
        const dStr = toLocalDateStr(s.completedAt);
        if (dStr) set.add(dStr);
      }
    });

    return {
      dateSet: set,
      todayStr: toLocalDateStr(new Date())!
    };
  }, [focusSessions]);

  // Generate trailing 35 days (5 weeks)
  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    // Set to midnight to avoid timezone shift issues
    today.setHours(0, 0, 0, 0);

    for (let i = 34; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const dayStr = String(d.getDate()).padStart(2, "0");
      const localStr = `${year}-${month}-${dayStr}`;

      days.push({
        dateStr: localStr,
        dayNum: d.getDate(),
        monthName: d.toLocaleString('default', { month: 'short' }),
        isActive: dateSet.has(localStr),
        isToday: localStr === todayStr
      });
    }
    return days;
  }, [dateSet, todayStr]);

  return (
    <div className="bg-[#0A0A0F] border border-white/5 rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Study Streak Calendar</h3>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold">
          <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded bg-white/5 border border-white/10" /> Inactive</span>
          <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded bg-[#00F0FF]/20 border border-[#00F0FF]/50 shadow-[0_0_8px_rgba(0,240,255,0.6)]" /> Active</span>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1.5 mt-auto">
        {/* Day of week labels */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={`dow-${i}`} className="text-center text-[9px] font-bold text-slate-600 mb-1">{day}</div>
        ))}
        
        {/* Fill leading empty cells if needed to align the last day to the correct weekday */}
        {(() => {
           // Find out what day of the week 35 days ago was
           const today = new Date();
           const startDay = new Date(today);
           startDay.setDate(today.getDate() - 34);
           const startDow = startDay.getDay();
           
           return Array.from({ length: startDow }).map((_, i) => (
             <div key={`empty-${i}`} className="aspect-square opacity-0" />
           ));
        })()}

        {calendarDays.map((day, i) => (
          <div
            key={day.dateStr}
            title={`${day.monthName} ${day.dayNum}: ${day.isActive ? 'Active' : 'Inactive'}`}
            className={`
              aspect-square rounded flex items-center justify-center text-[9px] font-bold transition-all
              ${day.isActive 
                ? "bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.5)] z-10" 
                : "bg-white/5 border border-white/10 text-slate-600"}
              ${day.isToday && !day.isActive ? "border-amber-500/50 text-amber-500/70" : ""}
            `}
          >
            {day.dayNum}
          </div>
        ))}
      </div>
    </div>
  );
}
