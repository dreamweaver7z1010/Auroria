import React from "react";
import { ThemeId } from "../lib/theme";
import { Sparkles, Zap, Shield, Moon, Target, Star, Skull, Award, Tv, Cloud, Hexagon, Triangle, Square, Circle } from "lucide-react";
import ThemeGallery from "./ThemeGallery";

interface ThemeOverlayProps {
  theme: ThemeId;
}

export default function ThemeOverlay({ theme }: ThemeOverlayProps) {
  // Deterministic array for particles
  const particles = Array.from({ length: 24 });

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <ThemeGallery theme={theme} />
      
      {/* Grid Overlay for Readability */}
      <div 
        className="absolute inset-0 z-[-1] opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      />
      <div 
        className="absolute inset-0 opacity-80 z-[-1]" 
        style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }} 
      />

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(110vh) rotate(0deg) scale(0.8); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-10vh) rotate(360deg) scale(1.2); opacity: 0; }
        }
        @keyframes fall-down {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes fall-fast {
          0% { transform: translateY(-10vh) rotate(15deg); opacity: 0.5; }
          100% { transform: translateY(110vh) rotate(15deg); opacity: 0; }
        }
        @keyframes drift {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(40px); }
        }
        @keyframes drift-slow {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(100px); }
        }
        @keyframes speed-lines {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100vw); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>

      {/* ⚔️ THEME 1: TAISHO NICHIRIN (Demon Slayer) */}
      {theme === "taisho-nichirin" && (
        <>
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#FF2A85_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#FF2A85]/15 via-emerald-900/20 to-transparent rounded-full blur-3xl" />
          
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[repeat-x] bg-[length:24px_100%]" style={{
            backgroundImage: "linear-gradient(90deg, #0B2B1B 0% 25%, #000000 25% 50%, #0B2B1B 50% 75%, #000000 75% 100%)"
          }} />

          {/* Falling Sakura Petals */}
          {particles.map((_, i) => (
             <div 
               key={i} 
               className="absolute bg-[#FF2A85]"
               style={{
                 left: `\${(i * 17) % 100}%`,
                 width: `\${(i % 5) + 6}px`,
                 height: `\${(i % 5) + 6}px`,
                 borderRadius: '10px 0px 10px 0px',
                 opacity: 0.6,
                 animation: `fall-down \${(i % 10) + 8}s linear infinite, drift \${(i % 5) + 3}s ease-in-out infinite`,
                 animationDelay: `-\${i % 15}s, -\${i % 5}s`
               }}
             />
          ))}

          <div className="absolute -bottom-10 -right-10 w-96 h-96 opacity-10 flex items-center justify-center text-[#FF2A85]">
            <svg viewBox="0 0 200 200" className="w-full h-full fill-current">
              <path d="M10,100 Q50,20 190,10 Q120,80 100,190 Q60,120 10,100 Z" />
              <circle cx="150" cy="50" r="25" className="fill-[#FFF0F5]" />
            </svg>
          </div>
          
          <div className="absolute top-24 left-6 hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF2A85]/10 border border-[#FF2A85]/30 text-[#FF2A85] text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(255,42,133,0.3)] backdrop-blur">
            <span>⚔️ BREATHING STYLE: TOTAL CONCENTRATION</span>
          </div>
        </>
      )}

      {/* 🦇 THEME 2: GOTHAM NOIR (Batman) */}
      {theme === "gotham-noir" && (
        <>
          <div className="absolute top-0 right-1/4 w-[600px] h-[700px] bg-gradient-to-b from-[#FFD700]/10 via-[#FFD700]/5 to-transparent clip-path-polygon opacity-60" style={{
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)"
          }} />
          
          {/* Tactical Rain */}
          {particles.map((_, i) => (
             <div 
               key={i} 
               className="absolute bg-[#F8FAFC]"
               style={{
                 left: `\${(i * 23) % 100}%`,
                 width: '1px',
                 height: `\${(i % 10) * 10 + 20}px`,
                 opacity: 0.1,
                 animation: `fall-fast \${(i % 2) + 0.5}s linear infinite`,
                 animationDelay: `-\${(i % 5) * 0.2}s`
               }}
             />
          ))}

          <div className="absolute top-12 right-12 w-64 h-64 opacity-15 text-[#FFD700]">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <path d="M50 20 C55 28 65 30 75 25 C70 35 85 35 95 30 C90 45 75 55 50 80 C25 55 10 45 5 30 C15 35 30 35 25 25 C35 30 45 28 50 20 Z" />
            </svg>
          </div>

          <div className="absolute top-24 left-6 hidden xl:flex items-center gap-2 px-3 py-1 bg-[#FFD700]/10 border border-[#FFD700]/40 text-[#FFD700] text-[10px] font-black font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(255,215,0,0.2)]">
            <Target size={12} className="animate-spin" style={{ animationDuration: '3s' }} /> GOTHAM TACTICAL HUD // BAT-COMPUTER ACTIVE
          </div>
        </>
      )}

      {/* 🕷️ THEME 5: BROOKLYN GRAFFITI (Spider-Verse) */}
      {theme === "brooklyn-graffiti" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(#FF007F_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-10" />

          {/* Halftone / Graffiti splatters */}
          {particles.map((_, i) => (
             <div 
               key={i} 
               className={`absolute rounded-full \${(i % 2 === 0) ? 'bg-[#FF007F]' : 'bg-[#00F0FF]'}`}
               style={{
                 left: `\${(i * 31) % 100}%`,
                 top: `\${(i * 17) % 100}%`,
                 width: `\${(i % 15) + 5}px`,
                 height: `\${(i % 15) + 5}px`,
                 opacity: 0.2,
                 animation: `twinkle \${(i % 3) + 2}s ease-in-out infinite`,
                 animationDelay: `-\${i % 3}s`
               }}
             />
          ))}

          <div className="absolute bottom-12 right-12 opacity-20 text-[#00F0FF] transform rotate-6">
            <svg viewBox="0 0 200 200" className="w-80 h-80 fill-current">
              <path d="M100 20 L120 70 L170 40 L140 90 L190 120 L130 130 L150 180 L100 140 L50 180 L70 130 L10 120 L60 90 L30 40 L80 70 Z" />
            </svg>
          </div>

          <div className="absolute top-24 left-6 hidden xl:flex items-center gap-2 px-3 py-1 bg-[#FF007F] text-black font-black text-[11px] tracking-wider uppercase transform -rotate-2 shadow-[4px_4px_0px_#00F0FF]">
            <span>🕷️ BROOKLYN STREET ART ZINE</span>
          </div>
        </>
      )}

      {/* 🔮 THEME 6: CURSED ENERGY (Jujutsu Kaisen) */}
      {theme === "cursed-energy" && (
        <>
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#00D2FF]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-[#FF0033]/10 rounded-full blur-[100px]" />

          {/* Cursed Energy Aura Particles */}
          {particles.map((_, i) => (
             <div 
               key={i} 
               className={`absolute \${(i % 3 === 0) ? 'bg-[#FF0033]' : 'bg-[#00D2FF]'}`}
               style={{
                 left: `\${(i * 29) % 100}%`,
                 width: `\${(i % 8) + 3}px`,
                 height: `\${(i % 15) + 5}px`,
                 borderRadius: '50%',
                 filter: 'blur(2px)',
                 opacity: 0.5,
                 animation: `float-up \${(i % 10) + 10}s ease-in infinite, drift \${(i % 4) + 2}s ease-in-out infinite`,
                 animationDelay: `-\${i % 10}s, -\${i % 4}s`
               }}
             />
          ))}

          <div className="absolute top-1/4 right-10 opacity-10 text-[#00D2FF] animate-spin" style={{ animationDuration: '60s' }}>
            <svg viewBox="0 0 100 100" className="w-96 h-96 stroke-current fill-none stroke-2">
              <circle cx="50" cy="50" r="45" />
              <circle cx="50" cy="50" r="30" />
              <polygon points="50,10 90,90 10,90" />
              <polygon points="50,90 90,10 10,10" />
            </svg>
          </div>

          <div className="absolute top-24 left-6 hidden xl:flex items-center gap-2 px-3 py-1 rounded bg-[#00D2FF]/15 border border-[#00D2FF]/40 text-[#00D2FF] text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(0,210,255,0.3)] backdrop-blur">
            <Zap size={12} className="animate-pulse" /> DOMAIN EXPANSION // CURSED AURA UNLOCKED
          </div>
        </>
      )}

      {/* 💜 THEME 7: BORAHAE GALAXY (BTS) */}
      {theme === "borahae-galaxy" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(#C084FC_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />
          <div className="absolute top-10 right-10 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl" />

          {/* Twinkling Stars */}
          {particles.map((_, i) => (
             <div 
               key={i} 
               className="absolute"
               style={{
                 left: `\${(i * 37) % 100}%`,
                 top: `\${(i * 23) % 100}%`,
                 color: i % 2 === 0 ? '#C084FC' : '#E9D5FF',
                 animation: `twinkle \${(i % 4) + 2}s ease-in-out infinite`,
                 animationDelay: `-\${i % 4}s`
               }}
             >
               <Star size={(i % 10) + 5} fill="currentColor" opacity={0.6} />
             </div>
          ))}

          <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-tr from-[#C084FC]/20 to-purple-500/10 border border-[#C084FC]/30 shadow-[0_0_50px_rgba(192,132,252,0.3)] flex items-center justify-center opacity-40">
            <Star size={80} className="text-[#C084FC]" style={{ animation: 'pulse-glow 4s ease-in-out infinite' }} />
          </div>

          <div className="absolute top-24 left-6 hidden xl:flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-900/40 border border-[#C084FC]/40 text-[#C084FC] text-[10px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(192,132,252,0.2)] backdrop-blur">
            <Sparkles size={12} /> BORAHAE GALAXY // I PURPLE YOU 💜
          </div>
        </>
      )}

      {/* 🖤 THEME 8: PINK VENOM (BLACKPINK) */}
      {theme === "pink-venom" && (
        <>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF1493] via-[#D4AF37] to-[#FF1493]" />
          
          {/* Glass Shards / Diamonds */}
          {particles.map((_, i) => (
             <div 
               key={i} 
               className="absolute border border-[#FF1493]"
               style={{
                 left: `\${(i * 41) % 100}%`,
                 width: `\${(i % 15) + 10}px`,
                 height: `\${(i % 15) + 10}px`,
                 opacity: 0.3,
                 transform: `rotate(\${(i * 45) % 360}deg)`,
                 animation: `float-up \${(i % 20) + 20}s linear infinite`,
                 animationDelay: `-\${i % 20}s`
               }}
             />
          ))}

          <div className="absolute top-20 right-12 w-80 h-80 opacity-15 text-[#FF1493]">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <path d="M50 10 L60 35 L85 20 L70 50 L95 65 L65 70 L50 95 L35 70 L5 65 L30 50 L15 20 L40 35 Z" />
            </svg>
          </div>

          <div className="absolute top-24 left-6 hidden xl:flex items-center gap-2 px-3 py-1 bg-[#FF1493] text-black font-black text-[10px] tracking-widest uppercase shadow-[0_0_20px_rgba(255,20,147,0.5)]">
            <span>🖤 PINK VENOM // HIGH FASHION EDITORIAL</span>
          </div>
        </>
      )}

      {/* 🏎️ THEME 10: FEARLESS ANTI-FRAGILE (LE SSERAFIM) */}
      {theme === "fearless-anti-fragile" && (
        <>
          <div className="absolute top-0 right-0 bottom-0 w-3 bg-gradient-to-b from-[#FF5500] via-[#27272A] to-[#FF5500]" />
          
          {/* Horizontal Speed Lines */}
          {particles.slice(0, 10).map((_, i) => (
             <div 
               key={i} 
               className="absolute bg-[#FF5500]"
               style={{
                 top: `\${(i * 10) % 100}%`,
                 left: '0',
                 width: `\${(i % 5) * 50 + 100}px`,
                 height: '1px',
                 opacity: 0.2,
                 animation: `speed-lines \${(i % 2) + 0.5}s linear infinite`,
                 animationDelay: `-\${i % 2}s`
               }}
             />
          ))}

          <div className="absolute top-20 right-10 text-9xl font-black font-mono text-[#FF5500]/10 tracking-tighter select-none">
            350 KM/H
          </div>

          <div className="absolute top-24 left-6 hidden xl:flex items-center gap-2 px-3 py-1 bg-[#FF5500] text-black font-extrabold font-mono text-[10px] tracking-wider uppercase shadow-md">
            <span>🏎️ FEARLESS // ANTI-FRAGILE RUNWAY METRICS</span>
          </div>
        </>
      )}

      {/* 🛡️ THEME 13: ASSEMBLY INITIATIVE (Marvel Avengers) */}
      {theme === "assembly-initiative" && (
        <>
          {/* Floating Hexagons */}
          {particles.map((_, i) => (
             <div 
               key={i} 
               className="absolute text-[#00F0FF]"
               style={{
                 left: `\${(i * 53) % 100}%`,
                 opacity: 0.15,
                 animation: `float-up \${(i % 20) + 20}s linear infinite`,
                 animationDelay: `-\${i % 20}s`
               }}
             >
               <Hexagon size={(i % 15) + 15} />
             </div>
          ))}

          <div className="absolute top-16 right-16 w-80 h-80 rounded-full border-2 border-[#00F0FF]/30 shadow-[0_0_60px_rgba(0,240,255,0.2)] flex items-center justify-center opacity-30">
            <div className="w-40 h-40 rounded-full border border-[#00F0FF]/50 animate-spin" style={{ animationDuration: '20s' }} />
            <Shield size={60} className="text-[#00F0FF] absolute" />
          </div>

          <div className="absolute top-24 left-6 hidden xl:flex items-center gap-2 px-3 py-1 bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-[10px] font-black tracking-widest uppercase backdrop-blur shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Shield size={12} /> STARK INDUSTRIES // ASSEMBLY INITIATIVE
          </div>
        </>
      )}

      {/* 🟩 THEME 16: POWER YOUR DREAMS (Xbox) */}
      {theme === "power-your-dreams" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(#107C41_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-15" />

          {/* Matrix Digital Rain Lines */}
          {particles.map((_, i) => (
             <div 
               key={i} 
               className="absolute w-0.5 bg-gradient-to-b from-transparent via-[#107C41] to-white"
               style={{
                 left: `\${(i * 67) % 100}%`,
                 height: `\${(i % 20) * 10 + 50}px`,
                 opacity: 0.5,
                 animation: `fall-down \${(i % 5) + 3}s linear infinite`,
                 animationDelay: `-\${(i % 10) * 0.5}s`
               }}
             />
          ))}

          <div className="absolute top-16 right-16 w-64 h-64 rounded-full border-4 border-[#107C41]/40 shadow-[0_0_50px_rgba(16,124,65,0.4)] opacity-25 flex items-center justify-center">
            <div className="w-full h-2 bg-[#107C41] transform rotate-45" />
            <div className="w-full h-2 bg-[#107C41] transform -rotate-45 absolute" />
          </div>

          <div className="absolute top-24 left-6 hidden xl:flex items-center gap-2 px-3 py-1 bg-[#107C41] text-white font-extrabold font-mono text-[10px] tracking-widest uppercase shadow-[0_0_15px_rgba(16,124,65,0.5)]">
            <span>🟩 POWER YOUR DREAMS // XBOX MATRIX CORE</span>
          </div>
        </>
      )}
    </div>
  );
}
