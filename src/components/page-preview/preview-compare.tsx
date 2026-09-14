import { CircleAlert } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useScannerStore } from "@/lib/scanner-store";
import { PDF } from "@/utils/pdf-renderer/pdf";
import type { PDFPageInfo } from "@/utils/pdf-renderer/types";
import { CanvasScanner } from "@/utils/scan-renderer/canvas-scan/scanner";
import { ScanCacher } from "@/utils/scan-renderer/scan-cacher";

import { ImagePreview } from "./image-preview";
import { PagePagination } from "./page-pagination";
import { SideBySidePreview } from "./side-by-side-preview";

// Renderer errors come from PDF.js and the worker boundary and are narrowed here.
// oxlint-disable anti-slop/no-unknown-parameters

function getPreviewStatus(
  hasPdf: boolean,
  loading: boolean,
  scanning: boolean
): string {
  if (!hasPdf) {
    return "Pilih PDF untuk melihat pratinjau.";
  }
  if (loading) {
    return "Memuat pratinjau PDF…";
  }
  if (scanning) {
    return "Menerapkan efek scan…";
  }
  return "Pratinjau scan siap.";
}

function isAbortError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message === "Aborted" || error.name === "AbortError")
  );
}

interface RenderPreviewPageOptions {
  page: number;
  renderer: PDF;
  scale: number;
  scanner: ScanCacher;
  setNumPages: (numPages: number) => void;
  setPage: (page: number) => void;
  setPageInfo: (pageInfo: PDFPageInfo) => void;
  setScanBlob: (scanBlob: Blob) => void;
  setScanning: (scanning: boolean) => void;
  signal: AbortSignal;
}

async function renderPreviewPage({
  page,
  renderer,
  scale,
  scanner,
  setNumPages,
  setPage,
  setPageInfo,
  setScanBlob,
  setScanning,
  signal,
}: RenderPreviewPageOptions): Promise<void> {
  const numPages = await renderer.getNumPages();
  if (signal.aborted) {
    return;
  }

  const pageToRender = Math.max(1, Math.min(page, numPages));
  setNumPages(numPages);
  if (pageToRender !== page) {
    setPage(pageToRender);
    return;
  }

  const pageInfo = await renderer.renderPage(pageToRender, scale);
  if (signal.aborted) {
    return;
  }

  setPageInfo(pageInfo);
  setScanning(true);
  const { blob } = await scanner.renderPage(pageInfo.blob, { signal });
  if (!signal.aborted) {
    setScanBlob(blob);
  }
}

export function PreviewCompare() {
  const pdf = useScannerStore((s) => s.pdf);
  const config = useScannerStore((s) => s.config);
  const { scale } = config;

  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [pageInfo, setPageInfo] = useState<PDFPageInfo | undefined>();
  const [scanBlob, setScanBlob] = useState<Blob | undefined>();
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string>();
  const abortRef = useRef<AbortController | null>(null);

  const pdfRendererRef = useRef<PDF | null>(null);
  const scanner = useMemo(
    () => new ScanCacher(new CanvasScanner(config)),
    [config]
  );

  // Recreate the PDF renderer and reset the selected page when the PDF changes.
  useEffect(() => {
    // These states mirror the external PDF renderer lifecycle.
    // oxlint-disable-next-line react/set-state-in-effect
    setPage(1);
    setNumPages(1);
    setPageInfo(undefined);
    setScanBlob(undefined);
    setScanning(false);
    setPreviewError(undefined);
    setLoading(Boolean(pdf));

    if (!pdf) {
      pdfRendererRef.current = null;
      return;
    }

    try {
      pdfRendererRef.current = new PDF(pdf);
    } catch {
      pdfRendererRef.current = null;
      setLoading(false);
      setPreviewError(
        "Pratinjau PDF gagal dimuat. Pilih file PDF lain atau coba lagi."
      );
    }
  }, [pdf]);

  // Render page + scan
  useEffect(() => {
    if (!pdf) {
      // These states mirror the external renderer lifecycle.
      // oxlint-disable-next-line react/set-state-in-effect
      setNumPages(1);
      setPageInfo(undefined);
      setScanBlob(undefined);
      setScanning(false);
      setLoading(false);
      return;
    }
    const renderer: PDF | null = pdfRendererRef.current;
    if (renderer === null) {
      setLoading(false);
      setPreviewError(
        "Pratinjau PDF gagal dimuat. Pilih file PDF lain atau coba lagi."
      );
      return;
    }
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    setPreviewError(undefined);
    setLoading(true);
    setScanning(false);

    const renderPage = async (): Promise<void> => {
      try {
        await renderPreviewPage({
          page,
          renderer,
          scale,
          scanner,
          setNumPages,
          setPage,
          setPageInfo,
          setScanBlob,
          setScanning,
          signal: controller.signal,
        });
      } catch (error: unknown) {
        if (!(controller.signal.aborted || isAbortError(error))) {
          setPreviewError(
            "Pratinjau PDF gagal dimuat. Pilih file PDF lain atau coba lagi."
          );
        }
      }
      if (!controller.signal.aborted) {
        setLoading(false);
        setScanning(false);
      }
    };

    void renderPage();

    return () => {
      controller.abort();
    };
  }, [pdf, page, scale, scanner]);

  const statusMessage = getPreviewStatus(Boolean(pdf), loading, scanning);

  return (
    <div aria-busy={loading || scanning} className="flex flex-col gap-4">
      {previewError ? (
        <Alert aria-live="assertive" variant="error">
          <CircleAlert />
          <AlertTitle>Pratinjau tidak tersedia</AlertTitle>
          <AlertDescription>{previewError}</AlertDescription>
        </Alert>
      ) : (
        <output aria-live="polite" className="text-muted-foreground text-sm">
          {statusMessage}
        </output>
      )}
      <SideBySidePreview
        original={
          <ImagePreview
            alt="Halaman PDF asli"
            height={pageInfo?.height}
            image={pageInfo?.blob}
            width={pageInfo?.width}
          />
        }
        scanned={
          <ImagePreview
            alt="Halaman hasil scan"
            className={scanning ? "opacity-50" : undefined}
            height={pageInfo?.height}
            image={scanBlob}
            width={pageInfo?.width}
          />
        }
      />
      {numPages >= 2 && (
        <PagePagination
          numPages={numPages}
          onPageChange={setPage}
          page={page}
        />
      )}
    </div>
  );
}
