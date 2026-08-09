import React, { useState, useEffect, useRef } from "react";
import { Music, Play, Square } from "lucide-react";

export default function StudyBeatsPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);

  const startSynth = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    
    // Resume context if suspended
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    
    // Synth-wave ambient drone chord (A minor 9)
    const frequencies = [220, 329.63, 392, 493.88]; // A3, E4, G4, B4
    
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.1; // Low volume
    
    // Create a lowpass filter
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800; // Muffled lo-fi sound
    filter.Q.value = 2;
    
    masterGain.connect(filter);
    filter.connect(ctx.destination);

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      
      // Slight detune for thickness
      osc.detune.value = (Math.random() - 0.5) * 10;
      
      // LFO for volume pulsing
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.1 + (Math.random() * 0.1); // very slow
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.5;
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      
      osc.start();
      lfo.start();
      
      oscillatorsRef.current.push(osc, lfo);
      gainNodesRef.current.push(oscGain, lfoGain);
    });
  };

  const stopSynth = () => {
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch (e) {}
    });
    gainNodesRef.current.forEach(gain => {
      try { gain.disconnect(); } catch (e) {}
    });
    oscillatorsRef.current = [];
    gainNodesRef.current = [];
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSynth();
      setIsPlaying(false);
    } else {
      startSynth();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => stopSynth();
  }, []);

  return (
    <button
      type="button"
      onClick={togglePlay}
      className={`px-3 py-1.5 rounded-lg border text-[9.5px] uppercase font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
        isPlaying 
          ? "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-500/10 hover:bg-amber-500/30" 
          : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-slate-300"
      }`}
      title="Toggle Lo-Fi Ambient Synth Beats"
    >
      <Music size={13} className={isPlaying ? "animate-pulse text-amber-400" : ""} />
      <span className="hidden sm:inline">LO-FI SYNTH</span>
      {isPlaying ? <Square size={10} className="fill-current" /> : <Play size={10} className="fill-current" />}
    </button>
  );
}
