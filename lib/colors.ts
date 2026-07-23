// LifeCharter Color System
// Business families with segment color variations

export const colorPalette = {
  // LifeCharter Core family - Purples/Plums
  lifecharterCore: {
    business: "#5E3B6C", // Royal Plum
    segments: {
      incubator: "#7B4F8C",      // Lighter plum
      circle: "#5E3B6C",         // Royal Plum (primary)
      selfDirected: "#4A2E55",   // Darker plum
      conversations: "#8B6B9C",  // Muted plum
    },
    light: "#CDBED6",  // Soft Lavender
    dark: "#1F315B",   // Deep Indigo
  },

  // Command Suite family - Blues/Teals
  commandSuite: {
    business: "#2E7C83", // Sacred Teal
    segments: {
      botBuilder: "#3A9CA5",    // Lighter teal
      dashboardTools: "#2E7C83", // Sacred Teal (primary)
      automation: "#256A70",    // Darker teal
    },
    light: "#B8D4D6",  // Light teal
    dark: "#1A4A4F",   // Dark teal
  },

  // AmiLynne Speaks family - Golds/Amber
  amiLynneSpeaks: {
    business: "#D4AF63", // Warm Gold
    segments: {
      keynotes: "#E4C473",   // Lighter gold
      workshops: "#D4AF63",  // Warm Gold (primary)
      retreats: "#C49F53",   // Darker gold
    },
    light: "#F5E6C8",  // Light gold
    dark: "#8B6914",   // Dark gold
  },

  // Business in a Bot family - Indigos
  businessInABot: {
    business: "#1F315B", // Deep Indigo
    segments: {
      aiConsulting: "#3A4F7A",    // Lighter indigo
      botDevelopment: "#1F315B",   // Deep Indigo (primary)
    },
    light: "#8B9DC3",  // Light indigo
    dark: "#0F1A2E",   // Dark indigo
  },

  // Carroll Media family - Greens/Sage
  carrollMedia: {
    business: "#ADB8A0", // Sage
    segments: {
      podcast: "#BDC8B0",      // Lighter sage
      content: "#ADB8A0",      // Sage (primary)
      video: "#9DA890",        // Darker sage
    },
    light: "#D5DDD0",  // Light sage
    dark: "#5A6B4A",   // Dark sage
  },
};

// Utility functions for color manipulation
export function getLighterColor(hexColor: string, percent: number = 15): string {
  const num = parseInt(hexColor.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

export function getDarkerColor(hexColor: string, percent: number = 15): string {
  const num = parseInt(hexColor.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

// Calculate luminance for accessibility
export function getLuminance(hexColor: string): number {
  const rgb = parseInt(hexColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

// Get accessible text color (black or white) based on background
export function getAccessibleTextColor(hexColor: string): string {
  const luminance = getLuminance(hexColor);
  return luminance > 0.5 ? "#1F315B" : "#F6F1E8"; // Deep Indigo or Ivory Light
}

// Get color with opacity
export function getColorWithOpacity(hexColor: string, opacity: number): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Business color mapping by slug
export const businessColors: Record<string, string> = {
  "lifecharter-core": colorPalette.lifecharterCore.business,
  "lifecharter-command-suite": colorPalette.commandSuite.business,
  "amilynne-speaks": colorPalette.amiLynneSpeaks.business,
  "business-in-a-bot": colorPalette.businessInABot.business,
  "carroll-media": colorPalette.carrollMedia.business,
};

// Segment color mapping by slug
export const segmentColors: Record<string, string> = {
  // LifeCharter Core
  "incubator": colorPalette.lifecharterCore.segments.incubator,
  "circle": colorPalette.lifecharterCore.segments.circle,
  "self-directed": colorPalette.lifecharterCore.segments.selfDirected,
  "conversations": colorPalette.lifecharterCore.segments.conversations,
  // Command Suite
  "bot-builder": colorPalette.commandSuite.segments.botBuilder,
  "dashboard-tools": colorPalette.commandSuite.segments.dashboardTools,
  "automation": colorPalette.commandSuite.segments.automation,
  // AmiLynne Speaks
  "keynotes": colorPalette.amiLynneSpeaks.segments.keynotes,
  "workshops": colorPalette.amiLynneSpeaks.segments.workshops,
  "retreats": colorPalette.amiLynneSpeaks.segments.retreats,
  // Business in a Bot
  "ai-consulting": colorPalette.businessInABot.segments.aiConsulting,
  "bot-development": colorPalette.businessInABot.segments.botDevelopment,
  // Carroll Media
  "podcast": colorPalette.carrollMedia.segments.podcast,
  "content": colorPalette.carrollMedia.segments.content,
  "video": colorPalette.carrollMedia.segments.video,
};

// Get color by business or segment slug
export function getColorBySlug(slug: string): string {
  return segmentColors[slug] || businessColors[slug] || "#B9A9A9"; // Default to Soft Taupe
}

// Get hover color (slightly lighter)
export function getHoverColor(hexColor: string): string {
  return getLighterColor(hexColor, 10);
}

// Get active/selected color (with gold border indicator)
export function getActiveColor(hexColor: string): { bg: string; border: string } {
  return {
    bg: getLighterColor(hexColor, 5),
    border: "#D4AF63", // Warm Gold
  };
}

// Health score color mapping
export function getHealthColor(score: number): string {
  if (score >= 80) return "#22C55E"; // Green
  if (score >= 60) return "#EAB308"; // Yellow
  return "#EF4444"; // Red
}

export function getHealthBgColor(score: number): string {
  if (score >= 80) return "#DCFCE7"; // Light green
  if (score >= 60) return "#FEF9C3"; // Light yellow
  return "#FEE2E2"; // Light red
}
