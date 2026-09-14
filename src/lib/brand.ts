/**
 * Brand-level color tokens for landing-page atmosphere. These complement the
 * existing COSS semantic tokens (bg-card, text-muted-foreground, etc.) with
 * accents that carry a "paper / scan" mood. They are intentionally tuned to
 * stay within WCAG AA on the page background.
 *
 * Light mode leans on a warm, low-chroma "paper" hue for accents; dark mode
 * shifts to a slightly desaturated "ink" glow. Saturation is kept low so the
 * palette remains restrained rather than category-default.
 */

// Warm paper.
export const BRAND_ACCENT_LIGHT = "oklch(0.72 0.13 65)";
export const BRAND_ACCENT_DARK = "oklch(0.78 0.12 75)";

// Deep ink for headings.
export const BRAND_INK_LIGHT = "oklch(0.34 0.04 240)";
export const BRAND_INK_DARK = "oklch(0.92 0.02 80)";

export const BRAND_GLOW_LIGHT =
  "radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in oklch, oklch(0.78 0.12 70) 18%, transparent) 0%, transparent 70%)";
export const BRAND_GLOW_DARK =
  "radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in oklch, oklch(0.78 0.12 70) 24%, transparent) 0%, transparent 70%)";

/** Stroke color used for the scan-line beam in the hero preview. */
export const SCAN_BEAM_LIGHT = "oklch(0.7 0.16 60 / 0.65)";
export const SCAN_BEAM_DARK = "oklch(0.8 0.18 70 / 0.75)";

/** Surface tint for the hero paper. */
export const HERO_PAPER_LIGHT = "oklch(0.985 0.012 90)";
export const HERO_PAPER_DARK = "oklch(0.22 0.015 260)";
