import { useCallback } from "react";

import { Card, CardPanel } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useScannerStore } from "@/lib/scanner-store";
import { fontFamilies } from "@/utils/scan-renderer/config.types";
import type { FontFamily, Watermark } from "@/utils/scan-renderer/config.types";

const FONT_LABELS: Record<FontFamily, string> = {
  cursive: "Kursif",
  monospace: "Monospace",
  "sans-serif": "Sans-serif",
  serif: "Serif",
};

export function WatermarkSettingsCard() {
  const watermark = useScannerStore((s) => s.config.watermark);
  const setConfig = useScannerStore((s) => s.setConfig);

  const updateWatermark = useCallback(
    (patch: Partial<Watermark>) => {
      setConfig((prev) => ({
        ...prev,
        watermark: { ...prev.watermark, ...patch },
      }));
    },
    [setConfig]
  );

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      updateWatermark({ text: event.currentTarget.value }),
    [updateWatermark]
  );

  const handleFontChange = useCallback(
    (value: unknown) => {
      if (typeof value === "string") {
        updateWatermark({ font_family: value as FontFamily });
      }
    },
    [updateWatermark]
  );

  const handleRepeatChange = useCallback(
    (checked: boolean) => updateWatermark({ repeat: checked }),
    [updateWatermark]
  );

  const handleOpacityChange = useCallback(
    (value: number) => updateWatermark({ opacity: value }),
    [updateWatermark]
  );

  const handleScaleChange = useCallback(
    (value: number) => updateWatermark({ scale: value }),
    [updateWatermark]
  );

  const handleRotateChange = useCallback(
    (value: number) => updateWatermark({ rotate: value }),
    [updateWatermark]
  );

  const handleYSpacingChange = useCallback(
    (value: number) => updateWatermark({ y_spacing: value }),
    [updateWatermark]
  );

  const handleXOffsetChange = useCallback(
    (value: number) => updateWatermark({ x_offset: value }),
    [updateWatermark]
  );

  const handleColorChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      updateWatermark({ color: event.currentTarget.value }),
    [updateWatermark]
  );

  return (
    <Card className="p-0">
      <CardPanel className="flex flex-col gap-4">
        <Field>
          <FieldLabel>Teks watermark</FieldLabel>
          <FieldDescription>
            Kosongkan untuk menonaktifkan watermark.
          </FieldDescription>
          <Input
            aria-label="Teks watermark"
            onChange={handleTextChange}
            placeholder="Mis. CONFIDENTIAL"
            value={watermark.text}
          />
        </Field>
        <Field>
          <FieldLabel>Font</FieldLabel>
          <FieldDescription>
            Font yang dipakai untuk menampilkan watermark.
          </FieldDescription>
          <Select
            onValueChange={handleFontChange}
            value={watermark.font_family}
          >
            <SelectTrigger aria-label="Font watermark">
              <SelectValue>
                {(value: string) => FONT_LABELS[value as FontFamily] ?? value}
              </SelectValue>
            </SelectTrigger>
            <SelectPopup>
              {fontFamilies.map((family) => (
                <SelectItem key={family} value={family}>
                  {FONT_LABELS[family]}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </Field>
        <Field>
          <div className="flex w-full items-center justify-between gap-2">
            <FieldLabel>Pengulangan</FieldLabel>
            <Switch
              aria-label="Pengulangan watermark"
              checked={watermark.repeat}
              onCheckedChange={handleRepeatChange}
            />
          </div>
          <FieldDescription>
            Tampilkan watermark secara berulang di seluruh halaman.
          </FieldDescription>
        </Field>
        <OpacityField
          label="Opasitas"
          max={1}
          min={0}
          onChange={handleOpacityChange}
          step={0.05}
          value={watermark.opacity}
        />
        <SliderField
          label="Skala"
          max={2}
          min={0.1}
          onChange={handleScaleChange}
          step={0.1}
          value={watermark.scale}
        />
        <SliderField
          label="Rotasi"
          max={90}
          min={-90}
          onChange={handleRotateChange}
          step={1}
          value={watermark.rotate}
        />
        <SliderField
          label="Spasi vertikal"
          max={3}
          min={0.5}
          onChange={handleYSpacingChange}
          step={0.1}
          value={watermark.y_spacing}
        />
        <SliderField
          label="Ofset horizontal"
          max={2}
          min={-2}
          onChange={handleXOffsetChange}
          step={0.1}
          value={watermark.x_offset}
        />
        <Field>
          <FieldLabel>Warna teks</FieldLabel>
          <input
            aria-label="Warna watermark"
            className="border-input bg-background h-9 w-16 cursor-pointer rounded border p-0"
            onChange={handleColorChange}
            type="color"
            value={watermark.color}
          />
        </Field>
      </CardPanel>
    </Card>
  );
}

interface SliderFieldProps {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
}

function SliderField({
  label,
  max,
  min,
  onChange,
  step,
  value,
}: SliderFieldProps) {
  const handleValueChange = useCallback(
    (nextValue: number | readonly number[]) => {
      if (typeof nextValue === "number") {
        onChange(nextValue);
      }
    },
    [onChange]
  );
  return (
    <Field>
      <div className="flex w-full items-center justify-between gap-2">
        <FieldLabel>{label}</FieldLabel>
        <span className="text-muted-foreground text-sm tabular-nums">
          {value.toFixed(2)}
        </span>
      </div>
      <Slider
        aria-label={label}
        max={max}
        min={min}
        onValueChange={handleValueChange}
        step={step}
        value={value}
      />
    </Field>
  );
}

interface OpacityFieldProps {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
}

function OpacityField({
  label,
  max,
  min,
  onChange,
  step,
  value,
}: OpacityFieldProps) {
  const handleValueChange = useCallback(
    (nextValue: number | readonly number[]) => {
      if (typeof nextValue === "number") {
        onChange(nextValue);
      }
    },
    [onChange]
  );
  return (
    <Field>
      <div className="flex w-full items-center justify-between gap-2">
        <FieldLabel>{label}</FieldLabel>
        <span className="text-muted-foreground text-sm tabular-nums">
          {Math.round(value * 100)}%
        </span>
      </div>
      <Slider
        aria-label={label}
        max={max}
        min={min}
        onValueChange={handleValueChange}
        step={step}
        value={value}
      />
    </Field>
  );
}
