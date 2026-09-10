import { fileOpen } from "browser-fs-access";
import { CircleAlert, FolderOpen } from "lucide-react";
import { useCallback, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardPanel } from "@/components/ui/card";
import { useScannerStore } from "@/lib/scanner-store";

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

export function PDFUpload() {
  const setPdf = useScannerStore((s) => s.setPdf);
  const [error, setError] = useState<string>();

  const onSelect = useCallback(async () => {
    setError(undefined);
    try {
      const file = await fileOpen({
        description: "File PDF",
        extensions: [".pdf"],
        mimeTypes: ["application/pdf"],
      });
      if (file) {
        setPdf(file);
      }
    } catch (pickerError: unknown) {
      if (!isAbortError(pickerError)) {
        setError(
          "File PDF tidak dapat dipilih. Periksa izin browser, lalu coba lagi."
        );
      }
    }
  }, [setPdf]);

  return (
    <Card>
      <CardPanel className="flex flex-col gap-3">
        <Button
          className="w-full"
          onClick={onSelect}
          type="button"
          variant="outline"
        >
          <FolderOpen aria-hidden="true" className="size-4" />
          Pilih PDF
        </Button>
        {error ? (
          <Alert aria-live="assertive" variant="error">
            <CircleAlert />
            <AlertTitle>Gagal memilih file</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
      </CardPanel>
    </Card>
  );
}
