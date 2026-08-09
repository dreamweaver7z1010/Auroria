import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface GlobalExamCountdownProps {
  targetDate: string;
}

export default function GlobalExamCountdown({ targetDate }: GlobalExamCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Assume targetDate is something like "2026-11-20"
      const target = new Date(targetDate + "T00:00:00Z"); 
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);

      setTimeLeft({ days, hours, minutes });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FF0055]/10 border border-[#FF0055]/20 text-[#FF0055] font-black text-[10px] tracking-widest shadow-[0_0_10px_rgba(255,0,85,0.15)]">
      <Clock size={13} className="animate-pulse" />
      <span className="hidden sm:inline">EXAM COUNTDOWN:</span>
      <div className="flex items-baseline gap-1">
        <span>{String(timeLeft.days).padStart(2, '0')}D</span>
        <span className="text-[#FF0055]/50">:</span>
        <span>{String(timeLeft.hours).padStart(2, '0')}H</span>
        <span className="text-[#FF0055]/50">:</span>
        <span>{String(timeLeft.minutes).padStart(2, '0')}M</span>
      </div>
    </div>
  );
}
