import { useCallback, useState } from "react";

import { buildPDF } from "@/utils/pdf-builder/build-pdf";
import type { ImageInfo } from "@/utils/pdf-builder/types";
import { PDF } from "@/utils/pdf-renderer/pdf";
import { CanvasScanner } from "@/utils/scan-renderer/canvas-scan/scanner";
import type { ScanConfig } from "@/utils/scan-renderer/config.types";
import { ScanCacher } from "@/utils/scan-renderer/scan-cacher";

const PDF_EXTENSION_PATTERN = /\.[^/.]+$/u;

export function useSaveScannedPDF() {
  const [saving, setSaving] = useState(false);
  const [finishedPages, setFinishedPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [scannedPDF, setScannedPDF] = useState<File | undefined>();

  const progress = totalPages === 0 ? 0 : finishedPages / totalPages;

  const save = useCallback(
    async (pdf: File, config: ScanConfig): Promise<File> => {
      setFinishedPages(0);
      setTotalPages(0);
      setScannedPDF(undefined);
      setSaving(true);
      try {
        const renderer = new PDF(pdf);
        const scanRenderer = new ScanCacher(new CanvasScanner(config));
        const numPages = await renderer.getNumPages();
        setTotalPages(numPages);

        const pages = Array.from({ length: numPages }, (_, i) => i + 1);
        const images: ImageInfo[] = await Promise.all(
          pages.map(async (page) => {
            const {
              blob: pdfPage,
              width,
              height,
            } = await renderer.renderPage(page, config.scale);
            const { blob: scanPage } = await scanRenderer.renderPage(pdfPage);
            setFinishedPages((n) => n + 1);
            return { blob: scanPage, height, ppi: config.scale * 72, width };
          })
        );

        const stamp = config.stamps.length > 0 ? config.stamps[0] : undefined;
        const pdfBlob = await buildPDF({
          metadata: config.metadata,
          pages: images,
          paper: config.paper,
          stamp,
          watermark: config.watermark,
        });
        const filename = `${pdf.name.replace(PDF_EXTENSION_PATTERN, "")}-scan.pdf`;
        const file = new File([pdfBlob], filename, { type: "application/pdf" });
        setSaving(false);
        setScannedPDF(file);
        return file;
      } catch (error: unknown) {
        setSaving(false);
        throw error;
      }
    },
    []
  );

  return {
    finishedPages,
    progress,
    save,
    saving,
    scannedPDF,
    totalPages,
  };
}
