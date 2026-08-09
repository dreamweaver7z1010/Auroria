import React from "react";

interface ProgressRingProps {
  percentage: number; // 0 to 100
  size?: number; // SVG size in pixels
  strokeWidth?: number; // Ring thickness
  color?: string; // Progress ring color (hex or rgb)
  trackColor?: string; // Background circle color
  showText?: boolean; // Whether to render text inside ring
  fontSize?: string; // Text font size
  className?: string;
}

export default function ProgressRing({
  percentage,
  size = 22,
  strokeWidth = 2.5,
  color = "#00F0FF",
  trackColor = "rgba(255, 255, 255, 0.12)",
  showText = false,
  fontSize = "7.5px",
  className = ""
}: ProgressRingProps) {
  const clampedPct = Math.min(100, Math.max(0, Math.round(percentage || 0)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          className="fill-none"
        />
        {/* Foreground progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="fill-none transition-all duration-500 ease-out"
        />
      </svg>
      {showText && (
        <span 
          className="absolute font-black font-mono tracking-tighter leading-none"
          style={{ color, fontSize }}
        >
          {clampedPct}%
        </span>
      )}
    </div>
  );
}
