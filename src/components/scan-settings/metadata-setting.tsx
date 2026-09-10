import { useCallback } from "react";
import { Card, CardPanel } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useScannerStore } from "@/lib/scanner-store";
import type { PDFMetadata } from "@/utils/scan-renderer/config.types";

const METADATA_FIELDS: Array<{
  description: string;
  field: keyof PDFMetadata;
  label: string;
  placeholder: string;
}> = [
  {
    description: "Judul yang ditampilkan di pembaca PDF.",
    field: "title",
    label: "Judul",
    placeholder: "Mis. Laporan Bulanan",
  },
  {
    description: "Pembuat dokumen.",
    field: "author",
    label: "Penulis",
    placeholder: "Nama penulis",
  },
  {
    description: "Subjek singkat tentang isi dokumen.",
    field: "subject",
    label: "Subjek",
    placeholder: "Mis. Laporan keuangan",
  },
  {
    description: "Kata kunci pencarian (pisahkan dengan koma).",
    field: "keywords",
    label: "Kata kunci",
    placeholder: "pdf, scan, laporan",
  },
  {
    description: "Aplikasi yang menghasilkan file PDF.",
    field: "producer",
    label: "Produsen",
    placeholder: "Look Scanned",
  },
  {
    description: "Aplikasi yang membuat dokumen asli.",
    field: "creator",
    label: "Pembuat",
    placeholder: "Mis. Microsoft Word",
  },
];

export function MetadataSettingsCard() {
  const metadata = useScannerStore((s) => s.config.metadata);
  const setConfig = useScannerStore((s) => s.setConfig);

  const updateMetadata = useCallback(
    (patch: Partial<PDFMetadata>) => {
      setConfig((prev) => ({
        ...prev,
        metadata: { ...prev.metadata, ...patch },
      }));
    },
    [setConfig]
  );

  const handleFieldChange = useCallback(
    (field: keyof PDFMetadata) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        updateMetadata({ [field]: event.currentTarget.value });
      },
    [updateMetadata]
  );

  return (
    <Card className="p-0">
      <CardPanel className="flex flex-col gap-4">
        {METADATA_FIELDS.map((item) => (
          <Field key={item.field}>
            <FieldLabel>{item.label}</FieldLabel>
            <FieldDescription>{item.description}</FieldDescription>
            <Input
              aria-label={item.label}
              onChange={handleFieldChange(item.field)}
              placeholder={item.placeholder}
              value={metadata[item.field]}
            />
          </Field>
        ))}
      </CardPanel>
    </Card>
  );
}
