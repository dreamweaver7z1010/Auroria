import React from "react";
import { ThemeId } from "../lib/theme";

const getThemeImagePrompt = (theme: ThemeId) => {
  const prompts: Record<string, string> = {
    "taisho-nichirin": "anime japanese bamboo forest sakura petals katana blade dark aesthetic wallpaper",
    "gotham-noir": "dark gotham city rain noir aesthetic wallpaper batman style",
    "brooklyn-graffiti": "spiderverse brooklyn graffiti street art neon aesthetic wallpaper",
    "cursed-energy": "jujutsu kaisen cursed energy dark neon aura domain expansion aesthetic wallpaper",
    "borahae-galaxy": "bts army borahae purple galaxy stars nebula aesthetic wallpaper",
    "pink-venom": "blackpink pink venom high fashion dark luxury neon pink aesthetic wallpaper",
    "fearless-anti-fragile": "le sserafim fearless racing grunge dark aesthetic wallpaper orange",
    "assembly-initiative": "iron man arc reactor stark industries blue neon tech aesthetic wallpaper",
    "power-your-dreams": "xbox matrix green neon cyber gaming aesthetic wallpaper"
  };
  return prompts[theme] || "dark aesthetic abstract wallpaper";
};

const getThemeBlur = (theme: ThemeId) => {
  const heavilyBlurred = ["brooklyn-graffiti", "cursed-energy"];
  if (heavilyBlurred.includes(theme)) return "blur-[16px]";

  return "blur-[12px]";
};

interface ThemeGalleryProps {
  theme: ThemeId;
}

export default function ThemeGallery({ theme }: ThemeGalleryProps) {
  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
      <img 
        key={theme}
        src={`https://image.pollinations.ai/prompt/${encodeURIComponent(getThemeImagePrompt(theme))}?width=1920&height=1080&nologo=true`}
        alt={`${theme} aesthetic background`}
        className={`w-full h-full object-cover opacity-20 animate-in fade-in duration-1000 ${getThemeBlur(theme)} scale-105`}
        crossOrigin="anonymous"
      />
    </div>
  );
}
