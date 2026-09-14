import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CircleAlert,
  Cog,
  FileText,
  Sliders,
  Stamp,
  Type,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { MainContainer } from "@/components/layout/main-container";
import { PreviewCompare } from "@/components/page-preview/preview-compare";
import { PDFInfo } from "@/components/pdf-upload/pdf-info";
import { PDFUpload } from "@/components/pdf-upload/pdf-upload";
import { SaveButtonCard } from "@/components/save-button/save-button-card";
import { MetadataSettingsCard } from "@/components/scan-settings/metadata-setting";
import { PaperSettingsCard } from "@/components/scan-settings/paper-setting";
import { ScanSettingsCard } from "@/components/scan-settings/scan-settings-card";
import { StampsSettingsCard } from "@/components/scan-settings/stamps-setting";
import { WatermarkSettingsCard } from "@/components/scan-settings/watermark-setting";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSaveScannedPDF } from "@/hooks/use-save-scanned-pdf";
import { useScannerStore } from "@/lib/scanner-store";

export const Route = createFileRoute("/scan")({
  component: ScanView,
  head: () => ({
    meta: [
      { title: "Pindai PDF — Look Scanned" },
      {
        content:
          "Buat PDF terlihat seperti hasil scan langsung di browser. Pilih file, atur efeknya, lalu unduh hasilnya tanpa mengunggah dokumen.",
        name: "description",
      },
    ],
  }),
});

const SCAN_STEPS = [
  {
    description:
      "Letakkan PDF, gambar, atau dokumen Office ke halaman ini. Dokumen dibaca langsung di browser tanpa dikirim ke server mana pun.",
    title: "Letakkan file Anda",
  },
  {
    description:
      "Atur efek scan, ukuran kertas, tanda tangan, cap, dan watermark. Bandingkan halaman asli dan hasil scan secara berdampingan.",
    title: "Sesuaikan efek dan kertas",
  },
  {
    description:
      "Pilih “Buat PDF hasil scan”. Halaman dirender satu per satu, lalu file langsung terunduh ke perangkat Anda.",
    title: "Buat PDF hasil scan",
  },
];

const SCAN_FORMATS = [{ description: ".pdf", title: "PDF" }];

const SCAN_FAQS = [
  {
    answer:
      "Tidak. Pemindaian standar berjalan sepenuhnya di browser, jadi file tidak pernah meninggalkan perangkat Anda.",
    question: "Apakah file saya diunggah ke server?",
  },
  {
    answer:
      "Pemindaian standar gratis dan tidak perlu akun. Anda cukup memilih file, menyesuaikan efek, dan mengunduh hasilnya.",
    question: "Apakah layanan ini gratis?",
  },
  {
    answer:
      "Saat ini pemindaian menerima file PDF. Pilih file dari perangkat Anda untuk mulai membuat hasil scan.",
    question: "Format file apa yang didukung?",
  },
  {
    answer:
      "Anda dapat mengubah mode warna, garis tepi, rotasi, variasi rotasi, kecerahan, kekuningan, kontras, keburaman, derau, dan resolusi.",
    question: "Efek apa saja yang bisa diatur?",
  },
  {
    answer:
      "Tingkatkan kekuningan, tambahkan derau dan keburaman, serta rotasi sedikit agar dokumen terlihat lebih lama dan tidak terlalu bersih.",
    question: "Bisakah hasil scan terlihat lebih tua?",
  },
  {
    answer:
      "Bisa. Tampilan dirancang agar tetap nyaman di ponsel, tablet, dan desktop modern.",
    question: "Apakah bisa digunakan di ponsel?",
  },
];

async function loadExamplePDF(): Promise<File> {
  const url = new URL("@/assets/examples/pdfs/test.pdf", import.meta.url).href;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Gagal memuat PDF contoh");
  }
  const blob = await response.blob();
  return new File([blob], "example.pdf", { type: "application/pdf" });
}

function ScanView() {
  const pdf = useScannerStore((s) => s.pdf);
  const setPdf = useScannerStore((s) => s.setPdf);
  const config = useScannerStore((s) => s.config);
  const { finishedPages, progress, save, saving, scannedPDF, totalPages } =
    useSaveScannedPDF();
  const [exampleLoading, setExampleLoading] = useState(!pdf);
  const [exampleError, setExampleError] = useState<string>();
  const [generateError, setGenerateError] = useState<string>();

  useEffect(() => {
    if (pdf) {
      // Loading state mirrors the example PDF lifecycle.
      // oxlint-disable-next-line react/set-state-in-effect
      setExampleLoading(false);
      setExampleError(undefined);
      setGenerateError(undefined);
      return;
    }

    let cancelled = false;
    setExampleLoading(true);

    const loadExample = async () => {
      try {
        const file = await loadExamplePDF();
        if (!cancelled) {
          setPdf(file);
        }
      } catch {
        if (!cancelled) {
          setExampleError(
            "PDF contoh gagal dimuat. Pilih file PDF secara manual untuk melanjutkan."
          );
        }
      }
      if (!cancelled) {
        setExampleLoading(false);
      }
    };

    loadExample();

    return () => {
      cancelled = true;
    };
  }, [pdf, setPdf]);

  const handleGenerate = useCallback(async () => {
    if (!pdf || saving) {
      return;
    }

    setGenerateError(undefined);
    try {
      await save(pdf, config);
    } catch {
      setGenerateError(
        "PDF hasil scan gagal dibuat. Periksa file dan pengaturan, lalu coba lagi."
      );
    }
  }, [config, pdf, save, saving]);

  return (
    <MainContainer className="pb-32">
      <div className="flex flex-col gap-3 py-4">
        <Button render={<Link to="/" />} size="sm" variant="ghost">
          <ArrowLeft aria-hidden="true" />
          Kembali
        </Button>
        {exampleLoading ? (
          <output aria-live="polite" className="text-muted-foreground text-sm">
            Memuat PDF contoh…
          </output>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-[clamp(20rem,24vw,24rem)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <UploadCard exampleError={exampleError} />
          {pdf ? <PDFInfo /> : null}
          <SettingsSection
            defaultOpen
            icon={<Sliders aria-hidden="true" className="size-4" />}
            title="Pengaturan scan"
          >
            <ScanSettingsCard />
          </SettingsSection>
          <SettingsSection
            description="Mengatur ukuran kertas pada PDF hasil scan."
            icon={<FileText aria-hidden="true" className="size-4" />}
            title="Pengaturan kertas"
          >
            <PaperSettingsCard />
          </SettingsSection>
          <SettingsSection
            description="Tambahkan tanda tangan atau cap pada hasil scan untuk menandai dokumen Anda."
            icon={<Stamp aria-hidden="true" className="size-4" />}
            title="Tanda tangan dan cap"
          >
            <StampsSettingsCard />
          </SettingsSection>
          <SettingsSection
            description="Beri watermark teks pada hasil scan untuk menandai status dokumen."
            icon={<Type aria-hidden="true" className="size-4" />}
            title="Watermark"
          >
            <WatermarkSettingsCard />
          </SettingsSection>
          <SettingsSection
            description="Atur judul, penulis, subjek, kata kunci, dan metadata lain pada PDF hasil scan."
            icon={<Cog aria-hidden="true" className="size-4" />}
            title="Metadata PDF"
          >
            <MetadataSettingsCard />
          </SettingsSection>
          <div
            aria-live="polite"
            className="border-border/70 bg-background/95 supports-[backdrop-filter]:bg-background/80 static -mx-4 border-t px-4 pt-3 pb-4 backdrop-blur md:sticky md:bottom-0 md:z-20 md:mx-0 md:border-t-0 md:bg-transparent md:p-0 md:backdrop-blur-none"
          >
            {generateError ? (
              <Alert aria-live="assertive" className="mb-3" variant="error">
                <CircleAlert />
                <AlertTitle>Gagal membuat PDF</AlertTitle>
                <AlertDescription>{generateError}</AlertDescription>
              </Alert>
            ) : null}
            <SaveButtonCard
              canGenerate={Boolean(pdf)}
              finishedPages={finishedPages}
              onGenerate={handleGenerate}
              pdf={scannedPDF}
              progress={progress}
              saving={saving}
              totalPages={totalPages}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <PreviewCompare />
        </div>
      </div>

      <ScanPageGuide />
    </MainContainer>
  );
}

function UploadCard({ exampleError }: { exampleError?: string }) {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <PDFUpload />
      {exampleError ? (
        <Alert aria-live="assertive" variant="error">
          <CircleAlert />
          <AlertTitle>PDF contoh tidak tersedia</AlertTitle>
          <AlertDescription>{exampleError}</AlertDescription>
        </Alert>
      ) : null}
      <p className="text-muted-foreground text-xs">
        <span className="text-foreground font-medium">
          Diproses secara lokal
        </span>
        {" — "}file tidak pernah diunggah ke server.
      </p>
    </Card>
  );
}

interface SettingsSectionProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  description?: string;
  icon: React.ReactNode;
  title: string;
}

function SettingsSection({
  children,
  defaultOpen = false,
  description,
  icon,
  title,
}: SettingsSectionProps) {
  return (
    <div className="bg-card text-card-foreground overflow-hidden rounded-2xl border shadow-xs/5 not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]">
      <Accordion>
        <AccordionItem
          className="border-b-0"
          value={title}
          {...(defaultOpen ? { defaultOpen: true } : {})}
        >
          <AccordionTrigger className="px-5 py-4">
            <span className="flex min-w-0 items-center gap-2">
              <span aria-hidden="true" className="text-muted-foreground">
                {icon}
              </span>
              <span className="truncate text-sm font-medium">{title}</span>
            </span>
          </AccordionTrigger>
          <AccordionPanel className="px-5 pb-5">
            {description ? (
              <p className="text-muted-foreground mb-3 text-xs leading-relaxed">
                {description}
              </p>
            ) : null}
            {children}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function ScanPageGuide() {
  return (
    <div className="mx-auto mt-16 w-full max-w-[1088px] space-y-12 pb-12 lg:space-y-16 lg:pb-16">
      <section aria-labelledby="scan-steps-title">
        <h2
          className="mb-5 text-xl font-semibold tracking-tight lg:mb-6 lg:text-2xl"
          id="scan-steps-title"
        >
          Tiga langkah menuju PDF hasil scan
        </h2>
        <ol className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {SCAN_STEPS.map((step, index) => (
            <li
              className="border-border/70 flex flex-col gap-1.5 border-t pt-3"
              key={step.title}
            >
              <span
                aria-hidden="true"
                className="text-muted-foreground font-mono text-xs"
              >
                0{index + 1}
              </span>
              <span className="text-muted-foreground text-sm leading-6 text-pretty">
                {step.description}
              </span>
              <span className="text-sm font-medium">{step.title}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="scan-formats-title">
        <h2
          className="mb-2 text-xl font-semibold tracking-tight lg:mb-3 lg:text-2xl"
          id="scan-formats-title"
        >
          Format yang didukung
        </h2>
        <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
          Saat ini hanya format PDF yang didukung.
        </p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SCAN_FORMATS.map((format) => (
            <li
              className="border-border/70 bg-card/60 flex h-11 items-center gap-2.5 rounded-lg border px-3"
              key={format.title}
            >
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="text-[13px] font-medium">{format.title}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {format.description}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="scan-faq-title">
        <h2
          className="mb-5 text-xl font-semibold tracking-tight lg:mb-6 lg:text-2xl"
          id="scan-faq-title"
        >
          Pertanyaan yang sering diajukan
        </h2>
        <Accordion className="bg-card h-fit rounded-2xl border">
          {SCAN_FAQS.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index + 1}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionPanel>{item.answer}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
