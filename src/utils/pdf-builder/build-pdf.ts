import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { PDFFont, PDFImage, PDFPage } from "pdf-lib";

import { PAPER_DIMENSIONS_PT } from "@/utils/scan-renderer/config.types";
import type {
  ScanConfig,
  Stamp,
  Watermark,
} from "@/utils/scan-renderer/config.types";

import type { ImageInfo } from "./types";

export interface BuildPDFOptions {
  metadata?: ScanConfig["metadata"];
  pages: ImageInfo[];
  paper: ScanConfig["paper"];
  stamp?: Stamp;
  watermark: ScanConfig["watermark"];
}

interface PageLayout {
  height: number;
  width: number;
}

const IMAGE_DATA_URL_PATTERN =
  /^data:(?<mime>image\/(?:png|jpeg|jpg));base64,(?<data>.+)$/u;

export async function buildPDF(options: BuildPDFOptions): Promise<Blob> {
  const { metadata, pages, paper, stamp, watermark } = options;
  const pdfDoc = await PDFDocument.create();

  const layouts = pages.map((image) => {
    const { width, height, ppi } = image;
    return {
      image,
      physicalHeightDots: (height / ppi) * 72,
      physicalWidthDots: (width / ppi) * 72,
    };
  });

  const embedded = await Promise.all(
    layouts.map(async ({ image }) => {
      const imageBytes = await image.blob.arrayBuffer();
      if (image.blob.type === "image/png") {
        return pdfDoc.embedPng(imageBytes);
      }
      if (image.blob.type === "image/jpeg") {
        return pdfDoc.embedJpg(imageBytes);
      }
      throw new Error("Unsupported image format");
    })
  );

  // Preload stamp assets and fonts once so per-page work is sync.
  const stampImage = stamp?.image
    ? await loadImageFromDataUrl(pdfDoc, stamp.image)
    : undefined;
  const hasWatermark = watermark.text.trim().length > 0;
  const hasStampText = Boolean(stamp?.text.trim());
  const hasStampImage = Boolean(stampImage);
  const watermarkFont = hasWatermark
    ? await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    : undefined;
  const stampFont = hasStampText
    ? await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    : undefined;

  for (const [index, pdfImage] of embedded.entries()) {
    const layout = layouts[index];
    if (!layout) {
      continue;
    }
    const { width: pageWidth, height: pageHeight } = resolvePageSize(
      layout,
      paper
    );
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    const imageBounds = computeImageBounds(
      layout.physicalWidthDots,
      layout.physicalHeightDots,
      pageWidth,
      pageHeight,
      paper
    );

    page.drawImage(pdfImage, imageBounds);

    if (watermarkFont) {
      drawWatermark(page, {
        font: watermarkFont,
        size: { height: pageHeight, width: pageWidth },
        watermark,
      });
    }

    if (stamp && stampFont) {
      const shouldDraw =
        stamp.all_pages || (stamp.page === index + 1 && !stamp.all_pages);
      if (shouldDraw) {
        drawStamp(page, {
          font: stampFont,
          hasImage: hasStampImage,
          image: stampImage,
          size: { height: pageHeight, width: pageWidth },
          stamp,
        });
      }
    }
  }

  if (metadata) {
    pdfDoc.setTitle(metadata.title);
    pdfDoc.setAuthor(metadata.author);
    pdfDoc.setSubject(metadata.subject);
    pdfDoc.setKeywords(parseKeywords(metadata.keywords));
    pdfDoc.setProducer(metadata.producer);
    pdfDoc.setCreator(metadata.creator);
  } else {
    pdfDoc.setProducer("Look Scanned");
    pdfDoc.setCreator("Look Scanned v1.0");
  }

  const pdfBytes = await pdfDoc.save();
  const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
  new Uint8Array(pdfBuffer).set(pdfBytes);
  return new Blob([pdfBuffer], { type: "application/pdf" });
}

function resolvePageSize(
  layout: { physicalHeightDots: number; physicalWidthDots: number },
  paper: ScanConfig["paper"]
): PageLayout {
  if (paper.size === "auto") {
    const width = layout.physicalWidthDots;
    const height = layout.physicalHeightDots;
    if (paper.orientation === "landscape") {
      return { height: width, width: height };
    }
    return { height, width };
  }
  const dims = PAPER_DIMENSIONS_PT[paper.size];
  return applyOrientation(dims, paper.orientation);
}

function applyOrientation(
  size: { height: number; width: number },
  orientation: ScanConfig["paper"]["orientation"]
): PageLayout {
  if (orientation === "landscape") {
    return { height: size.width, width: size.height };
  }
  return size;
}

function computeImageBounds(
  imageWidth: number,
  imageHeight: number,
  pageWidth: number,
  pageHeight: number,
  paper: ScanConfig["paper"]
) {
  const mode = paper.fit_mode;
  if (mode === "actual") {
    return {
      height: imageHeight,
      width: imageWidth,
      x: (pageWidth - imageWidth) / 2,
      y: (pageHeight - imageHeight) / 2,
    };
  }
  const scale =
    mode === "fill"
      ? Math.max(pageWidth / imageWidth, pageHeight / imageHeight)
      : Math.min(pageWidth / imageWidth, pageHeight / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return {
    height,
    width,
    x: (pageWidth - width) / 2,
    y: (pageHeight - height) / 2,
  };
}

interface WatermarkDrawArgs {
  font: PDFFont;
  size: { height: number; width: number };
  watermark: Watermark;
}

function drawWatermark(page: PDFPage, args: WatermarkDrawArgs) {
  const { font, size, watermark } = args;
  const baseFontSize = Math.max(24, size.width * 0.05 * watermark.scale);
  const lineHeight = baseFontSize * watermark.y_spacing;
  const angle = degrees(watermark.rotate);
  const color = parseColor(watermark.color);
  const opacity = Math.min(1, Math.max(0, watermark.opacity));

  for (let y = lineHeight / 2; y < size.height + lineHeight; y += lineHeight) {
    for (let x = lineHeight / 2; x < size.width + lineHeight; x += lineHeight) {
      const drawX = x + watermark.x_offset * lineHeight;
      page.drawText(watermark.text, {
        color,
        font,
        opacity,
        rotate: angle,
        size: baseFontSize,
        x: drawX,
        y,
      });
    }
  }
}

interface StampDrawArgs {
  font: PDFFont;
  hasImage: boolean;
  image?: PDFImage;
  size: { height: number; width: number };
  stamp: Stamp;
}

function drawStamp(page: PDFPage, args: StampDrawArgs) {
  const { font, hasImage, image, size, stamp } = args;
  const color = rgb(0.1, 0.1, 0.4);
  const opacity = Math.min(1, Math.max(0, stamp.opacity));
  const text = stamp.text.trim();

  const baseWidth = Math.max(40, size.width * 0.3 * stamp.scale);
  const baseHeight = hasImage ? baseWidth * 0.4 : baseWidth * 0.25;

  const x = size.width * stamp.x - baseWidth / 2;
  const y = size.height * stamp.y - baseHeight / 2;

  if (image) {
    const scale = Math.min(baseWidth / image.width, baseHeight / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    page.drawImage(image, {
      height: drawHeight,
      opacity,
      rotate: degrees(stamp.rotate),
      width: drawWidth,
      x: x + (baseWidth - drawWidth) / 2,
      y: y + (baseHeight - drawHeight) / 2,
    });
  }

  if (text) {
    const fontSize = Math.max(10, baseWidth * 0.12);
    page.drawText(text, {
      color,
      font,
      opacity,
      rotate: degrees(stamp.rotate),
      size: fontSize,
      x: x + baseWidth / 2 - (text.length * fontSize) / 4,
      y: y + baseHeight / 2 - fontSize / 2,
    });
  }
}

function parseColor(value: string) {
  if (!value) {
    return rgb(0.5, 0.5, 0.5);
  }
  const trimmed = value.trim();
  if (!trimmed.startsWith("#")) {
    return rgb(0.5, 0.5, 0.5);
  }
  const hex = trimmed.slice(1);
  const normalized =
    hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
  if (normalized.length !== 6 && normalized.length !== 8) {
    return rgb(0.5, 0.5, 0.5);
  }
  const r = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const g = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const b = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  return rgb(
    Number.isFinite(r) ? r : 0,
    Number.isFinite(g) ? g : 0,
    Number.isFinite(b) ? b : 0
  );
}

async function loadImageFromDataUrl(
  pdfDoc: PDFDocument,
  dataUrl: string
): Promise<PDFImage | undefined> {
  const match = IMAGE_DATA_URL_PATTERN.exec(dataUrl);
  if (!match) {
    return undefined;
  }
  const mimeValue = match.groups?.mime;
  const mime = mimeValue === "image/jpg" ? "image/jpeg" : mimeValue;
  const bytes = base64ToBytes(match.groups?.data ?? "");
  try {
    if (mime === "image/png") {
      return await pdfDoc.embedPng(bytes);
    }
    return await pdfDoc.embedJpg(bytes);
  } catch {
    return undefined;
  }
}

function base64ToBytes(data: string): Uint8Array {
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.codePointAt(i) ?? 0;
  }
  return bytes;
}

function parseKeywords(keywords: string): string[] {
  return keywords
    .split(",")
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0);
}
