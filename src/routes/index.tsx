import { createFileRoute, Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Check,
  CircleCheck,
  CloudOff,
  Code2,
  FileOutput,
  FileText,
  Gauge,
  Laptop,
  Layers3,
  LockKeyhole,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";

import { MainContainer } from "@/components/layout/main-container";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { Reveal } from "@/lib/motion";

interface Feature {
  description: string;
  icon: LucideIcon;
  title: string;
}

interface ScanMode {
  description: string;
  external?: boolean;
  href: string;
  icon: LucideIcon;
  label: string;
  title: string;
}

const steps = [
  {
    description: "Pilih file PDF dari perangkat Anda untuk mulai memindai.",
    icon: Upload,
    title: "Pilih file",
  },
  {
    description:
      "Atur blur, noise, warna, kemiringan, dan efek lain sampai terlihat pas.",
    icon: Sparkles,
    title: "Atur efek scan",
  },
  {
    description:
      "Unduh PDF baru yang terlihat seperti baru saja keluar dari scanner.",
    icon: FileOutput,
    title: "Ekspor PDF",
  },
];

const features: Feature[] = [
  {
    description: "Proses cepat langsung di browser tanpa menunggu upload.",
    icon: Zap,
    title: "Konversi cepat",
  },
  {
    description:
      "Atur blur, noise, warna, kemiringan, skala, dan efek lain dengan mudah.",
    icon: Sparkles,
    title: "Efek scan lengkap",
  },
  {
    description: "Pilih PDF dari perangkat dan kerjakan semuanya di browser.",
    icon: FileText,
    title: "PDF di browser",
  },
  {
    description: "Antarmuka nyaman digunakan di laptop, tablet, maupun ponsel.",
    icon: Smartphone,
    title: "Ramah ponsel",
  },
  {
    description: "File diproses lokal tanpa perlu dikirim ke server.",
    icon: ShieldCheck,
    title: "Tanpa upload",
  },
  {
    description: "Lihat perubahan efek pada halaman sebelum membuat PDF akhir.",
    icon: Gauge,
    title: "Pratinjau real-time",
  },
  {
    description:
      "Kontrol visual yang cukup untuk memberi karakter pada hasil scan.",
    icon: Layers3,
    title: "Kontrol visual",
  },
  {
    description: "Simpan hasil pemindaian sebagai PDF baru ke perangkat Anda.",
    icon: FileOutput,
    title: "Ekspor PDF",
  },
  {
    description:
      "Kode sumber tersedia terbuka untuk dipelajari dan dikembangkan.",
    icon: Code2,
    title: "Open source",
  },
];

const scanModes: ScanMode[] = [
  {
    description:
      "Pilih satu PDF, atur efeknya, lalu simpan hasilnya tanpa meninggalkan browser.",
    href: "/scan",
    icon: ScanLine,
    label: "Pribadi",
    title: "Pemindaian lokal",
  },
  {
    description:
      "Sesuaikan tampilan sambil melihat perubahan pada halaman secara langsung.",
    href: "/scan",
    icon: Gauge,
    label: "Interaktif",
    title: "Pratinjau real-time",
  },
  {
    description:
      "Pelajari implementasinya, gunakan sebagai inspirasi, atau ikut berkontribusi.",
    external: true,
    href: "https://github.com/rwv/lookscanned.io",
    icon: Code2,
    label: "Terbuka",
    title: "Proyek open source",
  },
];

const faqItems = [
  {
    answer:
      "Tidak. Pemindaian standar diproses langsung di browser Anda. File tidak diunggah ke cloud dan tidak disimpan di server kami.",
    question: "Apakah file saya diunggah?",
  },
  {
    answer:
      "Saat ini pemindaian standar menerima file PDF. Pilih file dari perangkat Anda, lalu lihat hasilnya sebelum mengunduh.",
    question: "Format file apa yang didukung?",
  },
  {
    answer:
      "Anda dapat mengatur ruang warna, border, rotasi, variasi rotasi, kecerahan, kekuningan, kontras, blur, noise, dan skala.",
    question: "Efek apa saja yang bisa diatur?",
  },
  {
    answer:
      "Tidak perlu akun. Buka aplikasi, pilih PDF, atur efek yang diinginkan, lalu simpan hasilnya.",
    question: "Apakah saya perlu membuat akun?",
  },
  {
    answer:
      "Bisa. Tampilan responsif dan kontrolnya dirancang untuk bekerja di ponsel, tablet, dan desktop modern.",
    question: "Apakah bisa digunakan di ponsel?",
  },
  {
    answer:
      "Look Scanned meniru karakter visual dokumen hasil scan—seperti tekstur, noise, warna, dan sedikit ketidaksempurnaan—tanpa memerlukan scanner fisik.",
    question: "Apa bedanya dengan scanner sungguhan?",
  },
];

export const Route = createFileRoute("/")({
  component: IndexView,
  head: () => ({
    meta: [
      { title: "Look Scanned — PDF Seperti Hasil Scan" },
      {
        content:
          "Ubah PDF menjadi dokumen seperti hasil scan langsung di browser. Gratis dan file tetap di perangkat Anda.",
        name: "description",
      },
      { content: "Look Scanned", property: "og:site_name" },
      {
        content: "Look Scanned — PDF Seperti Hasil Scan",
        property: "og:title",
      },
      {
        content:
          "Buat PDF terlihat seperti hasil scan tanpa printer atau scanner. Semua diproses lokal di browser Anda.",
        property: "og:description",
      },
    ],
  }),
});

function IndexView() {
  return (
    <>
      <a
        className="bg-primary text-primary-foreground focus-visible:ring-ring focus-visible:ring-offset-background sr-only fixed top-2 left-2 z-50 rounded-md px-4 py-3 focus:not-sr-only focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        href="#konten-utama"
      >
        Lewati ke konten utama
      </a>
      <LandingHeader />
      <MainContainer className="pt-0 pb-0">
        <div className="overflow-hidden" id="konten-utama" tabIndex={-1}>
          <HeroSection />
          <StepsSection />
          <PrivacySection />
          <FeaturesSection />
          <ScanModesSection />
          <FaqSection />
          <FinalCta />
        </div>
      </MainContainer>
      <LandingFooter />
    </>
  );
}

function LandingHeader() {
  const linkClassName =
    "inline-flex min-h-11 items-center rounded-md px-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <div className="mx-auto w-full max-w-285 px-4">
      <header className="border-border/70 relative z-10 border-b py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            aria-label="Look Scanned — kembali ke beranda"
            className="focus-visible:ring-ring focus-visible:ring-offset-background inline-flex min-h-11 items-center gap-2.5 rounded-lg font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            to="/"
          >
            <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl shadow-sm">
              <ScanLine aria-hidden="true" className="size-5" />
            </span>
            <span>Look Scanned</span>
          </Link>

          <nav
            aria-label="Navigasi utama"
            className="hidden items-center gap-2 text-sm md:flex"
          >
            <a className={linkClassName} href="#cara-kerja">
              Cara kerja
            </a>
            <a className={linkClassName} href="#privasi">
              Privasi
            </a>
            <a className={linkClassName} href="#fitur">
              Fitur
            </a>
            <a className={linkClassName} href="#faq">
              FAQ
            </a>
          </nav>

          <Button render={<Link to="/scan" />} size="sm">
            Mulai scan
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>

        <nav
          aria-label="Navigasi cepat"
          className="flex gap-1 overflow-x-auto pt-2 md:hidden"
        >
          <a className={`${linkClassName} shrink-0`} href="#cara-kerja">
            Cara kerja
          </a>
          <a className={`${linkClassName} shrink-0`} href="#privasi">
            Privasi
          </a>
          <a className={`${linkClassName} shrink-0`} href="#fitur">
            Fitur
          </a>
          <a className={`${linkClassName} shrink-0`} href="#faq">
            FAQ
          </a>
        </nav>
      </header>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--brand-glow)]"
      />
      <div className="relative grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="flex flex-col items-start">
          <Reveal delay={0} offsetY={16}>
            <h1 className="max-w-2xl text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Buat PDF terlihat{" "}
              <span className="text-[var(--brand-ink)]">
                seperti hasil scan
              </span>
            </h1>
          </Reveal>
          <Reveal delay={80} offsetY={16}>
            <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-8">
              Atur tampilan PDF agar terasa seperti baru dipindai, langsung dari
              browser Anda. Tanpa printer atau scanner.
            </p>
          </Reveal>
          <Reveal delay={160} offsetY={12}>
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                className="rounded-full px-6"
                render={<Link to="/scan" />}
                size="xl"
              >
                <ScanLine aria-hidden="true" />
                Ubah ke PDF hasil scan
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                className="rounded-full px-6"
                render={<a aria-label="Lihat cara kerja" href="#cara-kerja" />}
                size="xl"
                variant="outline"
              >
                Lihat cara kerja
              </Button>
            </div>
          </Reveal>
          <Reveal delay={240} offsetY={12}>
            <div className="text-muted-foreground mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm">
              <TrustItem>Gratis</TrustItem>
              <TrustItem>Tanpa daftar</TrustItem>
              <TrustItem>File tetap di perangkat Anda</TrustItem>
            </div>
          </Reveal>
        </div>
        <ScanPreview />
      </div>
    </section>
  );
}

function TrustItem({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Check aria-hidden="true" className="size-4 text-[var(--brand-accent)]" />
      {children}
    </span>
  );
}

function ScanPreview() {
  const previewControls = [
    { label: "Blur", value: "12%", width: "w-1/3" },
    { label: "Noise", value: "24%", width: "w-1/2" },
    { label: "Kekuningan", value: "18%", width: "w-2/5" },
    { label: "Kontras", value: "+8", width: "w-3/5" },
  ];

  return (
    <Card className="border-primary/12 shadow-primary/8 overflow-hidden rounded-3xl bg-[var(--hero-paper)] shadow-xl">
      <div className="border-border/70 flex items-center justify-between border-b px-4 py-3">
        <div aria-hidden="true" className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-red-400/80" />
          <span className="size-2 rounded-full bg-amber-400/80" />
          <span className="size-2 rounded-full bg-emerald-400/80" />
        </div>
        <span className="bg-muted text-muted-foreground rounded-md px-3 py-1 font-mono text-[10px]">
          lookscanned.io/scan
        </span>
        <span aria-hidden="true" className="size-5" />
      </div>

      <div className="grid sm:grid-cols-[minmax(170px,0.72fr)_1.28fr]">
        <aside
          aria-label="Contoh pengaturan scan"
          className="border-border/70 bg-muted/35 border-b p-4 sm:border-r sm:border-b-0"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Pengaturan scan</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Pratinjau langsung
              </p>
            </div>
            <SlidersIcon />
          </div>

          <div className="mb-5 space-y-2">
            <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
              Ruang warna
            </p>
            <div className="bg-background grid grid-cols-2 gap-1 rounded-lg p-1 text-[11px]">
              <span className="bg-primary text-primary-foreground rounded-md px-2 py-1.5 text-center shadow-sm">
                Hitam putih
              </span>
              <span className="text-muted-foreground rounded-md px-2 py-1.5 text-center">
                Berwarna
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {previewControls.map((control) => (
              <div key={control.label}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{control.label}</span>
                  <span className="font-mono text-[10px]">{control.value}</span>
                </div>
                <div className="bg-input h-1.5 rounded-full">
                  <div
                    className={`bg-primary h-full rounded-full ${control.width}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-border/60 mt-5 flex items-center justify-between border-t pt-4">
            <span className="text-muted-foreground text-xs">
              Efek scan aktif
            </span>
            <span
              aria-hidden="true"
              className="bg-primary relative h-4 w-7 rounded-full"
            >
              <span className="bg-primary-foreground absolute top-0.5 right-0.5 size-3 rounded-full" />
            </span>
          </div>
        </aside>

        <div className="bg-secondary/25 relative flex min-h-[330px] items-center justify-center overflow-hidden p-6 sm:min-h-[390px]">
          <figure
            aria-hidden="true"
            className="from-primary/4 to-primary/8 absolute inset-0 bg-linear-to-br via-transparent"
          />
          <div aria-hidden="true" className="scan-beam" />
          <figure
            aria-label="Pratinjau dokumen yang telah diberi efek scan"
            className="relative aspect-[4/5] w-full max-w-[245px] -rotate-2 rounded-xl bg-white p-5 text-neutral-900 shadow-2xl shadow-neutral-950/20 sm:max-w-[275px]"
          >
            <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
              <div>
                <div className="mb-1 h-2 w-20 rounded-full bg-neutral-900" />
                <p className="font-mono text-[8px] text-neutral-400">
                  DOKUMEN-2025-0042
                </p>
              </div>
              <FileText
                aria-hidden="true"
                className="size-5 text-neutral-300"
              />
            </div>
            <div className="mt-7 space-y-3">
              <div className="h-2.5 w-4/5 rounded-full bg-neutral-200" />
              <div className="h-2 w-full rounded-full bg-neutral-100" />
              <div className="h-2 w-11/12 rounded-full bg-neutral-100" />
              <div className="h-2 w-3/4 rounded-full bg-neutral-100" />
            </div>
            <div className="mt-9 grid grid-cols-2 gap-3">
              <div className="h-16 rounded-lg bg-neutral-100" />
              <div className="space-y-2 pt-1">
                <div className="h-2 w-full rounded-full bg-neutral-200" />
                <div className="h-2 w-4/5 rounded-full bg-neutral-100" />
                <div className="h-2 w-3/5 rounded-full bg-neutral-100" />
              </div>
            </div>
            <div className="absolute right-5 bottom-8 -rotate-12 rounded border-2 border-red-300 px-2 py-1 text-[10px] font-bold tracking-widest text-red-400">
              TERSCAN
            </div>
            <div className="absolute right-5 bottom-4 font-mono text-[8px] text-neutral-300">
              1 / 4
            </div>
          </figure>
          <Badge
            className="bg-background/90 text-success-foreground ring-success/30 absolute right-4 bottom-4 rounded-full shadow-sm ring-1"
            variant="outline"
          >
            <CircleCheck
              aria-hidden="true"
              className="text-emerald-600 dark:text-emerald-400"
            />
            Diproses lokal
          </Badge>
        </div>
      </div>

      <div className="border-border/70 bg-background/60 flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Upload aria-hidden="true" className="size-4" />
          <span>Seret file ke sini atau pilih dari perangkat</span>
        </div>
        <Button
          className="w-full sm:w-auto"
          render={<Link to="/scan" />}
          size="sm"
        >
          Mulai memindai
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </Card>
  );
}

function SlidersIcon() {
  return (
    <span className="bg-background text-muted-foreground flex size-7 items-center justify-center rounded-lg shadow-xs">
      <Gauge aria-hidden="true" className="size-4" />
    </span>
  );
}

function StepsSection() {
  return (
    <section
      className="border-border/70 scroll-mt-10 border-t py-20 sm:py-28"
      id="cara-kerja"
    >
      <SectionIntro
        description="Tidak perlu belajar software baru. Pilih file, atur tampilannya, lalu simpan hasilnya."
        title="Tiga langkah menuju PDF hasil scan"
      />
      <Reveal className="mt-10" delay={0} offsetY={20}>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card className="bg-card/60 h-full" key={step.title}>
                <CardHeader className="gap-5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-mono text-xs">
                      0{index + 1}
                    </span>
                    <span className="bg-primary/8 text-primary flex size-10 items-center justify-center rounded-xl">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                  </div>
                  <CardTitle
                    render={<h3 aria-label={step.title}>{step.title}</h3>}
                  />
                </CardHeader>
                <CardPanel>
                  <p className="text-muted-foreground text-sm leading-6">
                    {step.description}
                  </p>
                </CardPanel>
              </Card>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

function SectionIntro({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="text-muted-foreground mt-4 leading-7">{description}</p>
    </div>
  );
}

function PrivacySection() {
  const privacyPoints = [
    {
      description: "Dokumen tidak meninggalkan browser Anda.",
      icon: LockKeyhole,
      title: "File tetap di perangkat",
    },
    {
      description: "Tidak ada penyimpanan cloud untuk pemindaian standar.",
      icon: CloudOff,
      title: "Tidak disimpan di cloud",
    },
    {
      description: "Semua efek diterapkan langsung melalui browser Anda.",
      icon: Laptop,
      title: "Berjalan di browser",
    },
  ];

  return (
    <section className="scroll-mt-10 py-4 sm:py-8" id="privasi">
      <Card className="overflow-hidden rounded-3xl border-0 bg-neutral-900 text-neutral-50 shadow-[var(--brand-accent)]/20 shadow-xl dark:bg-neutral-950">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <div className="p-7 sm:p-10 lg:p-12">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-neutral-800 text-neutral-200">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </span>
            <h2 className="mt-6 max-w-md text-3xl font-bold tracking-tight sm:text-4xl">
              Pemrosesan Privat dan Lokal
            </h2>
            <p className="mt-5 max-w-md leading-7 text-neutral-300">
              Dokumen Anda adalah milik Anda. Look Scanned memproses pemindaian
              standar secara lokal agar file sensitif tetap berada di perangkat.
            </p>
          </div>
          <div className="grid border-t border-neutral-700/70 lg:border-t-0 lg:border-l">
            {privacyPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  className="flex gap-4 border-b border-neutral-700/70 p-7 last:border-b-0 sm:p-8"
                  key={point.title}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800 text-neutral-200">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{point.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-neutral-400">
                      {point.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="scroll-mt-10 py-20 sm:py-28" id="fitur">
      <SectionIntro
        description="Semua yang Anda butuhkan untuk membuat hasil scan terasa lebih autentik, tanpa membuat alur kerja menjadi rumit."
        title="Fitur Utama"
      />
      <Reveal className="mt-10" delay={0} offsetY={20}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                className="bg-card/60 hover:bg-card transition-colors"
                key={feature.title}
              >
                <CardHeader className="gap-4">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-accent)]/12 text-[var(--brand-accent)]">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <CardTitle
                    render={<h3 aria-label={feature.title}>{feature.title}</h3>}
                  />
                </CardHeader>
                <CardPanel>
                  <p className="text-muted-foreground text-sm leading-6">
                    {feature.description}
                  </p>
                </CardPanel>
              </Card>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

function ScanModesSection() {
  return (
    <section
      className="border-border/70 border-t py-20 sm:py-28"
      id="mode-scan"
    >
      <SectionIntro
        description="Pilih alur sederhana untuk membuat PDF terasa seperti hasil scan."
        title="Cara menggunakan Look Scanned"
      />
      <Reveal className="mt-10" delay={0} offsetY={20}>
        <div className="grid gap-4 lg:grid-cols-3">
          {scanModes.map((mode, index) => {
            const Icon = mode.icon;
            return (
              <Card
                className={
                  index === 0
                    ? "border-[var(--brand-accent)]/40 shadow-[var(--brand-accent)]/10 shadow-lg"
                    : undefined
                }
                key={mode.title}
              >
                <CardHeader className="gap-5">
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-accent)]/12 text-[var(--brand-accent)]">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <Badge
                      className="rounded-full"
                      variant={index === 0 ? "success" : "secondary"}
                    >
                      {mode.label}
                    </Badge>
                  </div>
                  <CardTitle
                    render={<h3 aria-label={mode.title}>{mode.title}</h3>}
                  />
                </CardHeader>
                <CardPanel>
                  <p className="text-muted-foreground text-sm leading-6">
                    {mode.description}
                  </p>
                </CardPanel>
                <CardFooter>
                  {mode.external ? (
                    <Button
                      className="w-full"
                      aria-label={`Lihat ${mode.title} di GitHub`}
                      render={
                        <a
                          aria-label={`Lihat ${mode.title} di GitHub`}
                          href={mode.href}
                          rel="noopener noreferrer"
                          target="_blank"
                        />
                      }
                      variant="outline"
                    >
                      Lihat di GitHub
                      <ArrowRight aria-hidden="true" />
                    </Button>
                  ) : (
                    <Button className="w-full" render={<Link to="/scan" />}>
                      Mulai sekarang
                      <ArrowRight aria-hidden="true" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

function FaqSection() {
  return (
    <section
      className="border-border/70 scroll-mt-10 border-t py-20 sm:py-28"
      id="faq"
    >
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <SectionIntro
          description="Jawaban singkat tentang privasi, format file, dan cara kerja Look Scanned."
          title="Pertanyaan yang Sering Diajukan"
        />
        <Accordion
          className="bg-card h-fit rounded-2xl border px-5"
          defaultValue={["faq-1"]}
        >
          {faqItems.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index + 1}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionPanel>{item.answer}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="pb-20 sm:pb-28">
      <Card className="border-primary/15 from-primary/10 via-card to-card overflow-hidden rounded-3xl bg-linear-to-br p-8 sm:p-12">
        <div className="max-w-2xl">
          <Reveal delay={0} offsetY={12}>
            <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-2xl">
              <FileText aria-hidden="true" className="size-5" />
            </span>
          </Reveal>
          <Reveal delay={80} offsetY={16}>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Ubah PDF menjadi hasil scan langsung dari browser
            </h2>
          </Reveal>
          <Reveal delay={160} offsetY={16}>
            <p className="text-muted-foreground mt-4 max-w-xl leading-7">
              Gratis untuk pemindaian standar. Tidak ada pendaftaran, tidak ada
              upload, dan tidak ada langkah yang tidak perlu.
            </p>
          </Reveal>
          <Reveal delay={240} offsetY={12}>
            <Button
              className="mt-8 rounded-full px-6"
              render={<Link to="/scan" />}
              size="xl"
            >
              <ScanLine aria-hidden="true" />
              Ubah ke PDF hasil scan
              <ArrowRight aria-hidden="true" />
            </Button>
          </Reveal>
        </div>
      </Card>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="border-border/70 border-t">
      <div className="mx-auto flex w-full max-w-285 flex-col gap-8 px-4 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-sm">
          <Link
            aria-label="Look Scanned — kembali ke beranda"
            className="focus-visible:ring-ring focus-visible:ring-offset-background inline-flex min-h-11 items-center gap-2 rounded-lg font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            to="/"
          >
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <ScanLine aria-hidden="true" className="size-4" />
            </span>
            Look Scanned
          </Link>
          <p className="text-muted-foreground mt-3 text-sm leading-6">
            Cara cepat membuat dokumen digital terlihat seperti hasil
            scan—dengan privasi yang tetap terjaga.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-sm sm:items-end">
          <nav
            aria-label="Tautan tambahan"
            className="flex flex-wrap gap-x-5 gap-y-2"
          >
            <a
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex min-h-11 items-center rounded-md px-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              href="https://github.com/rwv/lookscanned.io"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
            <a
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex min-h-11 items-center rounded-md px-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              href="https://inbrowser.app"
              rel="noopener noreferrer"
              target="_blank"
            >
              InBrowser.App
            </a>
            <a
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex min-h-11 items-center rounded-md px-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              href="#faq"
            >
              FAQ
            </a>
          </nav>
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Look Scanned. Dibuat untuk pemrosesan
            lokal.
          </p>
        </div>
      </div>
    </footer>
  );
}
