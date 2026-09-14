import { fileSave } from "browser-fs-access";
import { CircleAlert, Download, ScanLine } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardPanel } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// File-save errors come from a browser API and are narrowed before use.
// oxlint-disable anti-slop/no-unknown-parameters, anti-slop/no-runtime-typeof

interface SaveButtonCardProps {
  canGenerate: boolean;
  finishedPages?: number;
  onGenerate: () => void;
  pdf?: File;
  progress?: number;
  saving?: boolean;
  totalPages?: number;
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

export function SaveButtonCard({
  canGenerate,
  finishedPages = 0,
  onGenerate,
  pdf,
  progress = 0,
  saving = false,
  totalPages = 0,
}: SaveButtonCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string>();
  const hasFinishedPdf = Boolean(pdf);
  const isCompact = !(hasFinishedPdf || downloadError);
  const progressValue = Math.min(100, Math.max(0, progress * 100));

  useEffect(() => {
    if (pdf) {
      // Reset the browser-save error when the generated PDF changes.
      // oxlint-disable-next-line react/set-state-in-effect
      setDownloadError(undefined);
    }
  }, [pdf]);

  const onDownload = useCallback(async () => {
    if (!pdf || downloading) {
      return;
    }

    setDownloadError(undefined);
    setDownloading(true);
    try {
      await fileSave(pdf, {
        description: "File PDF",
        extensions: [".pdf"],
        fileName: pdf.name,
        id: "lookscanned",
        mimeTypes: ["application/pdf"],
        startIn: "downloads",
      });
    } catch (error: unknown) {
      if (!isAbortError(error)) {
        setDownloadError(
          "PDF hasil scan tidak dapat disimpan. Periksa izin browser, lalu coba lagi."
        );
      }
    }
    setDownloading(false);
  }, [downloading, pdf]);

  const handleGenerate = useCallback(() => {
    onGenerate();
  }, [onGenerate]);

  let compactStatus: string;
  if (saving) {
    compactStatus =
      totalPages > 0
        ? `Memproses halaman ${finishedPages} dari ${totalPages}`
        : "Menyiapkan PDF…";
  } else {
    compactStatus = "Pilih PDF untuk membuat hasil scan.";
  }

  if (isCompact) {
    return (
      <div className="flex flex-col gap-2">
        <Button
          className="w-full"
          disabled={!(canGenerate || saving)}
          loading={saving}
          onClick={handleGenerate}
          size="sm"
          type="button"
          variant="outline"
        >
          <ScanLine aria-hidden="true" className="size-4" />
          {saving ? "Membuat PDF hasil scan…" : "Buat PDF hasil scan"}
        </Button>
        {saving ? (
          <Progress
            aria-label="Kemajuan pembuatan PDF hasil scan"
            value={progressValue}
          />
        ) : null}
        <output aria-live="polite" className="text-muted-foreground text-sm">
          {compactStatus}
        </output>
      </div>
    );
  }

  return (
    <Card>
      <CardPanel className="flex flex-col gap-3">
        <Button
          className="w-full"
          loading={downloading}
          onClick={onDownload}
          size="lg"
          type="button"
        >
          <Download aria-hidden="true" className="size-4" />
          Unduh PDF hasil scan
        </Button>
        <output
          aria-live="polite"
          className="text-muted-foreground text-center text-sm"
        >
          {downloading
            ? "Menyimpan PDF hasil scan…"
            : "PDF hasil scan siap diunduh."}
        </output>
        {downloadError ? (
          <Alert aria-live="assertive" variant="error">
            <CircleAlert />
            <AlertTitle>Gagal mengunduh PDF</AlertTitle>
            <AlertDescription>{downloadError}</AlertDescription>
          </Alert>
        ) : null}
      </CardPanel>
    </Card>
  );
}
