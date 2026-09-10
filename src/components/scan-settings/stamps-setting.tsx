import { fileOpen } from "browser-fs-access";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardPanel } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useScannerStore } from "@/lib/scanner-store";
import { defaultStamp } from "@/utils/scan-renderer/config.types";
import type { Stamp } from "@/utils/scan-renderer/config.types";

export function StampsSettingsCard() {
  const stamps = useScannerStore((s) => s.config.stamps);
  const setConfig = useScannerStore((s) => s.setConfig);

  const addStamp = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      stamps: [...prev.stamps, { ...defaultStamp, text: "" }],
    }));
  }, [setConfig]);

  return (
    <Card className="p-0">
      <CardPanel className="flex flex-col gap-4">
        {stamps.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Belum ada tanda tangan atau cap. Tambahkan satu untuk menandai hasil
            scan.
          </p>
        ) : null}
        {stamps.map((stamp, index) => (
          <StampEditor index={index} key={stamp.id} stamp={stamp} />
        ))}
        <Button className="w-full" onClick={addStamp} variant="outline">
          <Plus aria-hidden="true" />
          Tambah tanda tangan atau cap
        </Button>
      </CardPanel>
    </Card>
  );
}

interface StampEditorProps {
  index: number;
  stamp: Stamp;
}

function StampEditor({ index, stamp }: StampEditorProps) {
  const setConfig = useScannerStore((s) => s.setConfig);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const updateStamp = useCallback(
    (patch: Partial<Stamp>) => {
      setConfig((prev) => ({
        ...prev,
        stamps: prev.stamps.map((item, i) =>
          i === index ? { ...item, ...patch } : item
        ),
      }));
    },
    [index, setConfig]
  );

  const removeStamp = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      stamps: prev.stamps.filter((_, i) => i !== index),
    }));
  }, [index, setConfig]);

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      updateStamp({ text: event.currentTarget.value }),
    [updateStamp]
  );

  const handleImage = useCallback(
    (dataUrl: string) => updateStamp({ image: dataUrl }),
    [updateStamp]
  );

  const pickImage = useCallback(async () => {
    try {
      const file = await fileOpen({
        description: "Gambar tanda tangan atau cap",
        extensions: [".png", ".jpg", ".jpeg"],
        mimeTypes: ["image/png", "image/jpeg"],
      });
      const dataUrl = await readAsDataUrl(file);
      handleImage(dataUrl);
    } catch {
      // user cancelled the picker; do nothing
    }
  }, [handleImage]);

  const handleFileInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0];
      if (file) {
        readAsDataUrl(file).then(handleImage, () => {});
      }
      event.currentTarget.value = "";
    },
    [handleImage]
  );

  const clearImage = useCallback(
    () => updateStamp({ image: "" }),
    [updateStamp]
  );

  const handlePickClick = useCallback(() => {
    pickImage().catch(() => {});
  }, [pickImage]);

  const handleAllPagesChange = useCallback(
    (checked: boolean) => updateStamp({ all_pages: checked }),
    [updateStamp]
  );

  const handlePageNumber = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.currentTarget.value, 10);
      updateStamp({ page: Number.isFinite(value) && value > 0 ? value : 1 });
    },
    [updateStamp]
  );

  const handleTextOnlyChange = useCallback(
    (checked: boolean) => updateStamp({ text_only: checked }),
    [updateStamp]
  );

  const handleScaleChange = useCallback(
    (value: number) => updateStamp({ scale: value }),
    [updateStamp]
  );
  const handleRotateChange = useCallback(
    (value: number) => updateStamp({ rotate: value }),
    [updateStamp]
  );
  const handleXChange = useCallback(
    (value: number) => updateStamp({ x: value }),
    [updateStamp]
  );
  const handleYChange = useCallback(
    (value: number) => updateStamp({ y: value }),
    [updateStamp]
  );
  const handleOpacityChange = useCallback(
    (value: number) => updateStamp({ opacity: value }),
    [updateStamp]
  );

  return (
    <div className="border-border/60 flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">
          Tanda tangan atau cap #{index + 1}
        </span>
        <Button
          aria-label={`Hapus tanda tangan ${index + 1}`}
          onClick={removeStamp}
          size="icon-sm"
          variant="ghost"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </div>
      <Field>
        <FieldLabel>Teks</FieldLabel>
        <FieldDescription>
          Teks yang ditampilkan bersama gambar (opsional).
        </FieldDescription>
        <Input
          aria-label={`Teks tanda tangan ${index + 1}`}
          onChange={handleTextChange}
          placeholder="Mis. Ditandatangani"
          value={stamp.text}
        />
      </Field>
      <Field
        aria-disabled={stamp.text_only}
        className={
          stamp.text_only ? "pointer-events-none opacity-50" : undefined
        }
      >
        <FieldLabel>Gambar</FieldLabel>
        <FieldDescription>
          Gambar PNG atau JPG untuk tanda tangan atau cap.
        </FieldDescription>
        <div className="flex items-center gap-3">
          <input
            accept="image/png,image/jpeg"
            aria-label={`Unggah gambar tanda tangan ${index + 1}`}
            className="hidden"
            onChange={handleFileInput}
            ref={inputRef}
            type="file"
          />
          <Button onClick={handlePickClick} size="sm" variant="outline">
            Pilih gambar
          </Button>
          {stamp.image ? (
            <div className="flex items-center gap-2">
              <img
                alt={`Pratinjau tanda tangan ${index + 1}`}
                className="border-border/60 bg-card h-10 w-auto max-w-24 rounded border object-contain"
                height={40}
                src={stamp.image}
                width={96}
              />
              <Button onClick={clearImage} size="sm" variant="ghost">
                Hapus
              </Button>
            </div>
          ) : null}
        </div>
      </Field>
      <Field>
        <div className="flex w-full items-center justify-between gap-2">
          <FieldLabel>Terapkan ke semua halaman</FieldLabel>
          <Switch
            aria-label={`Terapkan ke semua halaman ${index + 1}`}
            checked={stamp.all_pages}
            onCheckedChange={handleAllPagesChange}
          />
        </div>
        <FieldDescription>
          Jika nonaktif, stempel hanya muncul di halaman yang dipilih.
        </FieldDescription>
      </Field>
      {stamp.all_pages ? null : (
        <Field>
          <FieldLabel>Nomor halaman</FieldLabel>
          <Input
            aria-label={`Halaman untuk tanda tangan ${index + 1}`}
            min={1}
            onChange={handlePageNumber}
            type="number"
            value={stamp.page}
          />
        </Field>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <SliderField
          label="Skala"
          max={1}
          min={0.05}
          onChange={handleScaleChange}
          step={0.05}
          value={stamp.scale}
        />
        <SliderField
          label="Rotasi"
          max={180}
          min={-180}
          onChange={handleRotateChange}
          step={1}
          value={stamp.rotate}
        />
        <SliderField
          label="Posisi X"
          max={1}
          min={0}
          onChange={handleXChange}
          step={0.01}
          value={stamp.x}
        />
        <SliderField
          label="Posisi Y"
          max={1}
          min={0}
          onChange={handleYChange}
          step={0.01}
          value={stamp.y}
        />
        <OpacityField
          label="Opasitas"
          onChange={handleOpacityChange}
          value={stamp.opacity}
        />
        <Field>
          <div className="flex w-full items-center justify-between gap-2">
            <FieldLabel>Teks saja</FieldLabel>
            <Switch
              aria-label={`Teks saja ${index + 1}`}
              checked={stamp.text_only}
              onCheckedChange={handleTextOnlyChange}
            />
          </div>
          <FieldDescription>
            Abaikan gambar dan gunakan hanya teks di atas.
          </FieldDescription>
        </Field>
      </div>
    </div>
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
  onChange: (value: number) => void;
  value: number;
}

function OpacityField({ label, onChange, value }: OpacityFieldProps) {
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
        max={1}
        min={0}
        onValueChange={handleValueChange}
        step={0.05}
        value={value}
      />
    </Field>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Gagal membaca file"));
      }
    };
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}
