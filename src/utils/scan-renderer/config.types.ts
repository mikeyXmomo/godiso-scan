export const colorspaces = ["gray", "sRGB"] as const;

export type Colorspace = (typeof colorspaces)[number];

export const paperSizes = [
  "auto",
  "a4",
  "a3",
  "a5",
  "letter",
  "legal",
  "business-card",
] as const;

export type PaperSize = (typeof paperSizes)[number];

export const fitModes = ["fit", "fill", "actual"] as const;
export type FitMode = (typeof fitModes)[number];

export const orientations = ["auto", "portrait", "landscape"] as const;
export type Orientation = (typeof orientations)[number];

export const fontFamilies = [
  "sans-serif",
  "serif",
  "monospace",
  "cursive",
] as const;

export type FontFamily = (typeof fontFamilies)[number];

export interface PaperSettings {
  fit_mode: FitMode;
  orientation: Orientation;
  size: PaperSize;
}

export interface Watermark {
  color: string;
  font_family: FontFamily;
  opacity: number;
  repeat: boolean;
  rotate: number;
  scale: number;
  text: string;
  x_offset: number;
  y_spacing: number;
}

export interface Stamp {
  all_pages: boolean;
  id: string;
  image: string;
  opacity: number;
  page: number;
  rotate: number;
  scale: number;
  text: string;
  text_only: boolean;
  x: number;
  y: number;
}

export interface PDFMetadata {
  author: string;
  creator: string;
  keywords: string;
  producer: string;
  subject: string;
  title: string;
}

export interface ScanConfig {
  blur: number;
  border: boolean;
  brightness: number;
  colorspace: Colorspace;
  contrast: number;
  metadata: PDFMetadata;
  noise: number;
  orientation: Orientation;
  output_format: "image/png" | "image/jpeg";
  paper: PaperSettings;
  rotate: number;
  rotate_var: number;
  scale: number;
  stamps: Stamp[];
  watermark: Watermark;
  yellowish: number;
}

export const defaultPaperSettings: PaperSettings = {
  fit_mode: "fit",
  orientation: "auto",
  size: "auto",
};

export const defaultWatermark: Watermark = {
  color: "#888888",
  font_family: "sans-serif",
  opacity: 0.15,
  repeat: true,
  rotate: -30,
  scale: 0.6,
  text: "",
  x_offset: 0,
  y_spacing: 1.4,
};

export function createDefaultStamp(): Stamp {
  return {
    all_pages: true,
    id: cryptoRandomId(),
    image: "",
    opacity: 0.6,
    page: 1,
    rotate: 0,
    scale: 0.3,
    text: "",
    text_only: true,
    x: 0.5,
    y: 0.9,
  };
}

export const defaultStamp: Stamp = {
  all_pages: true,
  id: cryptoRandomId(),
  image: "",
  opacity: 0.6,
  page: 1,
  rotate: 0,
  scale: 0.3,
  text: "",
  text_only: true,
  x: 0.5,
  y: 0.9,
};

function cryptoRandomId(): string {
  if (globalThis.crypto !== undefined && globalThis.crypto.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `stamp-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

export const defaultMetadata: PDFMetadata = {
  author: "",
  creator: "Look Scanned",
  keywords: "",
  producer: "Look Scanned",
  subject: "",
  title: "",
};

export type ScanPresetId = "standard" | "old-paper" | "faded-copy";

export interface ScanPreset {
  description: string;
  id: ScanPresetId;
  label: string;
  values: Pick<
    ScanConfig,
    | "blur"
    | "border"
    | "brightness"
    | "colorspace"
    | "contrast"
    | "noise"
    | "rotate"
    | "rotate_var"
    | "yellowish"
  >;
}

export const SCAN_PRESETS: readonly ScanPreset[] = [
  {
    description: "Pengaturan dasar untuk hasil scan bersih",
    id: "standard",
    label: "Standar",
    values: {
      blur: 0.3,
      border: false,
      brightness: 1,
      colorspace: "gray",
      contrast: 1,
      noise: 0.1,
      rotate: 1,
      rotate_var: 0.5,
      yellowish: 0,
    },
  },
  {
    description: "Tampilan dokumen lama yang menguning",
    id: "old-paper",
    label: "Kertas Tua",
    values: {
      blur: 0.4,
      border: false,
      brightness: 1.05,
      colorspace: "gray",
      contrast: 0.95,
      noise: 0.25,
      rotate: 1.5,
      rotate_var: 0.6,
      yellowish: 0.45,
    },
  },
  {
    description: "Efek fotokopi yang sudah pudar",
    id: "faded-copy",
    label: "Fotokopi Pudar",
    values: {
      blur: 0.5,
      border: true,
      brightness: 1.15,
      colorspace: "gray",
      contrast: 0.85,
      noise: 0.35,
      rotate: 2,
      rotate_var: 0.8,
      yellowish: 0.25,
    },
  },
] as const;

export const defaultConfig: ScanConfig = {
  blur: 0.3,
  border: false,
  brightness: 1,
  colorspace: "gray",
  contrast: 1,
  metadata: { ...defaultMetadata },
  noise: 0.1,
  orientation: "auto",
  output_format: "image/jpeg",
  paper: { ...defaultPaperSettings },
  rotate: 1,
  rotate_var: 0.5,
  scale: 2,
  stamps: [],
  watermark: { ...defaultWatermark },
  yellowish: 0,
};

export const PAPER_DIMENSIONS_MM: Record<
  Exclude<PaperSize, "auto">,
  { height: number; width: number }
> = {
  a3: { height: 297, width: 420 },
  a4: { height: 210, width: 297 },
  a5: { height: 148, width: 210 },
  "business-card": { height: 53.98, width: 85.6 },
  legal: { height: 215.9, width: 355.6 },
  letter: { height: 215.9, width: 279.4 },
};

// SAFETY: Object.fromEntries preserves every non-auto paper key from PAPER_DIMENSIONS_MM.
export const PAPER_DIMENSIONS_PT: Record<
  Exclude<PaperSize, "auto">,
  { height: number; width: number }
> = Object.fromEntries(
  Object.entries(PAPER_DIMENSIONS_MM).map(([key, value]) => [
    key,
    { height: (value.height / 25.4) * 72, width: (value.width / 25.4) * 72 },
  ])
) as Record<Exclude<PaperSize, "auto">, { height: number; width: number }>;
