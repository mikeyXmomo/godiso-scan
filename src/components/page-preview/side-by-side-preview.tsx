import type { ReactNode } from "react";
import { Card, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";

interface SideBySidePreviewProps {
  original: ReactNode;
  scanned: ReactNode;
}

export function SideBySidePreview({
  original,
  scanned,
}: SideBySidePreviewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle render={<h2 aria-label="Asli" />}>Asli</CardTitle>
        </CardHeader>
        <CardPanel>{original}</CardPanel>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle render={<h2 aria-label="Hasil scan" />}>
            Hasil scan
          </CardTitle>
        </CardHeader>
        <CardPanel>{scanned}</CardPanel>
      </Card>
    </div>
  );
}
