import { filesize } from "filesize";
import { FileText, HardDrive } from "lucide-react";

import { Card, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import { useScannerStore } from "@/lib/scanner-store";

export function PDFInfo() {
  const pdf = useScannerStore((s) => s.pdf);
  if (!pdf) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle
          render={<h2 aria-label="PDF yang dipilih">PDF yang dipilih</h2>}
        >
          PDF yang dipilih
        </CardTitle>
      </CardHeader>
      <CardPanel>
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <FileText
              aria-hidden="true"
              className="text-muted-foreground size-4 shrink-0"
            />
            <dt className="sr-only">Nama file</dt>
            <dd className="break-all" title={pdf.name}>
              {pdf.name}
            </dd>
          </div>
          <div className="text-muted-foreground flex items-center gap-2">
            <HardDrive aria-hidden="true" className="size-4 shrink-0" />
            <dt className="sr-only">Ukuran file</dt>
            <dd>{String(filesize(pdf.size))}</dd>
          </div>
        </dl>
      </CardPanel>
    </Card>
  );
}
