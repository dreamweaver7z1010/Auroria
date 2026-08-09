export type ThemeId =
  | "taisho-nichirin"
  | "gotham-noir"
  | "brooklyn-graffiti"
  | "cursed-energy"
  | "borahae-galaxy"
  | "pink-venom"
  | "fearless-anti-fragile"
  | "assembly-initiative"
  | "power-your-dreams";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  category: "dark" | "light";
  description: string;
  previewBg: string;
  previewCard: string;
  previewAccent: string;
  previewText: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "taisho-nichirin",
    name: "⚔️ Taisho Nichirin",
    category: "dark",
    description: "Taisho-era bamboo green & haori darks with elemental breathing neon pink accents.",
    previewBg: "#0B2B1B",
    previewCard: "#11181C",
    previewAccent: "#FF2A85",
    previewText: "#FFF0F5"
  },
  {
    id: "gotham-noir",
    name: "🦇 Gotham Noir",
    category: "dark",
    description: "Gritty tactical matte black, dark steel blue, and sharp glowing radar yellow.",
    previewBg: "#0B0C0E",
    previewCard: "#161A1D",
    previewAccent: "#FFD700",
    previewText: "#F8FAFC"
  },
  {
    id: "brooklyn-graffiti",
    name: "🕷️ Brooklyn Graffiti",
    category: "dark",
    description: "High-energy comic halftone black with spray-paint pink, electric cyan, and warning yellow.",
    previewBg: "#0A0A0F",
    previewCard: "#12121D",
    previewAccent: "#FF007F",
    previewText: "#FAFAFA"
  },
  {
    id: "cursed-energy",
    name: "🔮 Cursed Energy",
    category: "dark",
    description: "Sleek Japanese urban occultism in pitch midnight blue, toxic neon blue, and blood crimson.",
    previewBg: "#040914",
    previewCard: "#0A0D14",
    previewAccent: "#00D2FF",
    previewText: "#F8FAFC"
  },
  {
    id: "borahae-galaxy",
    name: "💜 Borahae Galaxy",
    category: "dark",
    description: "Astronomical cosmic velvet purple, starlight indigo, and glowing platinum violet.",
    previewBg: "#170B2C",
    previewCard: "#231242",
    previewAccent: "#C084FC",
    previewText: "#FAF5FF"
  },
  {
    id: "pink-venom",
    name: "🖤 Pink Venom",
    category: "dark",
    description: "High-fashion luxury pitch black with electric neon pink and metallic gold.",
    previewBg: "#000000",
    previewCard: "#0D0D0D",
    previewAccent: "#FF1493",
    previewText: "#FFFFFF"
  },
  {
    id: "fearless-anti-fragile",
    name: "🏎️ Fearless Anti-Fragile",
    category: "dark",
    description: "High-octane athletic matte graphite, burning steel blue, concrete, and safety orange.",
    previewBg: "#18181B",
    previewCard: "#27272A",
    previewAccent: "#FF5500",
    previewText: "#FAFAFA"
  },
  {
    id: "assembly-initiative",
    name: "🛡️ Assembly Initiative",
    category: "dark",
    description: "Tactical space navy, arc-reactor cyan, vibranium silver, and tactical metallic red.",
    previewBg: "#0B132B",
    previewCard: "#1C2541",
    previewAccent: "#00F0FF",
    previewText: "#F1F5F9"
  },
  {
    id: "power-your-dreams",
    name: "🟩 Power Your Dreams",
    category: "dark",
    description: "Industrial matte black, ventilation charcoal, and signature high-performance Xbox green matrix.",
    previewBg: "#050505",
    previewCard: "#121212",
    previewAccent: "#107C41",
    previewText: "#FAFAFA"
  }
];

export function applyTheme(themeId: ThemeId) {
  document.documentElement.setAttribute("data-theme", themeId);
  localStorage.setItem("EngineCore_Theme", themeId);
}

export function getInitialTheme(): ThemeId {
  const saved = localStorage.getItem("EngineCore_Theme") as ThemeId;
  if (saved && THEME_OPTIONS.some(t => t.id === saved)) {
    return saved;
  }
  return "brooklyn-graffiti";
}
