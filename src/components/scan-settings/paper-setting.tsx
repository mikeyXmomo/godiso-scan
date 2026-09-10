import { useCallback } from "react";
import { Card, CardPanel } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScannerStore } from "@/lib/scanner-store";
import {
  type FitMode,
  fitModes,
  type Orientation,
  orientations,
  type PaperSize,
  paperSizes,
} from "@/utils/scan-renderer/config.types";

const PAPER_LABELS: Record<PaperSize, string> = {
  a3: "A3",
  a4: "A4",
  a5: "A5",
  auto: "Otomatis (ikuti halaman)",
  "business-card": "Kartu nama",
  legal: "Legal",
  letter: "Letter",
};

const FIT_LABELS: Record<FitMode, string> = {
  actual: "Ukuran asli",
  fill: "Penuhi",
  fit: "Paskan",
};

const ORIENTATION_LABELS: Record<Orientation, string> = {
  auto: "Otomatis",
  landscape: "Landscape",
  portrait: "Portrait",
};

export function PaperSettingsCard() {
  const paper = useScannerStore((s) => s.config.paper);
  const setConfig = useScannerStore((s) => s.setConfig);

  const setPaperSize = useCallback(
    (value: PaperSize) => {
      setConfig((prev) => ({ ...prev, paper: { ...prev.paper, size: value } }));
    },
    [setConfig]
  );

  const setFitMode = useCallback(
    (value: FitMode) => {
      setConfig((prev) => ({
        ...prev,
        paper: { ...prev.paper, fit_mode: value },
      }));
    },
    [setConfig]
  );

  const setOrientation = useCallback(
    (value: Orientation) => {
      setConfig((prev) => ({
        ...prev,
        paper: { ...prev.paper, orientation: value },
      }));
    },
    [setConfig]
  );

  const handlePaperSizeChange = useCallback(
    (value: unknown) => {
      if (typeof value === "string") {
        setPaperSize(value as PaperSize);
      }
    },
    [setPaperSize]
  );

  const handleFitModeChange = useCallback(
    (value: unknown) => {
      if (typeof value === "string") {
        setFitMode(value as FitMode);
      }
    },
    [setFitMode]
  );

  const handleOrientationChange = useCallback(
    (value: unknown) => {
      if (typeof value === "string") {
        setOrientation(value as Orientation);
      }
    },
    [setOrientation]
  );

  return (
    <Card className="p-0">
      <CardPanel className="flex flex-col gap-4">
        <Field>
          <FieldLabel>Ukuran kertas</FieldLabel>
          <FieldDescription>
            Setiap halaman akan mengikuti ukuran yang dipilih.
          </FieldDescription>
          <Select onValueChange={handlePaperSizeChange} value={paper.size}>
            <SelectTrigger aria-label="Ukuran kertas">
              <SelectValue>
                {(value: string) => PAPER_LABELS[value as PaperSize] ?? value}
              </SelectValue>
            </SelectTrigger>
            <SelectPopup>
              {paperSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {PAPER_LABELS[size]}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Orientasi</FieldLabel>
          <FieldDescription>
            Otomatis mengikuti orientasi asli halaman.
          </FieldDescription>
          <Select
            onValueChange={handleOrientationChange}
            value={paper.orientation}
          >
            <SelectTrigger aria-label="Orientasi kertas">
              <SelectValue>
                {(value: string) =>
                  ORIENTATION_LABELS[value as Orientation] ?? value
                }
              </SelectValue>
            </SelectTrigger>
            <SelectPopup>
              {orientations.map((orientation) => (
                <SelectItem key={orientation} value={orientation}>
                  {ORIENTATION_LABELS[orientation]}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Penempatan</FieldLabel>
          <FieldDescription>
            Tentukan cara konten ditempatkan pada kertas.
          </FieldDescription>
          <Select onValueChange={handleFitModeChange} value={paper.fit_mode}>
            <SelectTrigger aria-label="Penempatan konten">
              <SelectValue>
                {(value: string) => FIT_LABELS[value as FitMode] ?? value}
              </SelectValue>
            </SelectTrigger>
            <SelectPopup>
              {fitModes.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {FIT_LABELS[mode]}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </Field>
      </CardPanel>
    </Card>
  );
}
