# 📚 Look Scanned

![License](https://img.shields.io/github/license/rwv/lookscanned.io)

[lookscanned.io](https://lookscanned.io)

Look Scanned is a pure frontend site that makes your PDFs look scanned! No need for printers and scanners anymore - everything you need to do is just a few clicks. Inspired by [baicunko/scanyourpdf](https://github.com/baicunko/scanyourpdf).

## ✨ Features

* Everything is processed in your browser. No privacy risk.

* See scanned PDF side-by-side in real time.
* Works on all modern browsers and devices.
* All files are static. No backend servers needed.
* Tweak the settings to make your PDF look better.

## 🧑‍💻 Develop

```sh
pnpm install
pnpm dev          # Run Dev Server
pnpm build        # Build to dist/
```

## 🛠 Stack

* **React 19** + **TypeScript**
* **Vite 8**
* **TanStack Router** (file-based routing)
* **Biome + Ultracite** (formatting and linting)
* **shadcn/ui** on **Base UI** (`@base-ui/react`)
* **Tailwind CSS 4**
* **Zustand** (state)
* **pdfjs-dist 6** (PDF parser/rasterizer)
* **pdf-lib** (PDF builder)
* **lucide-react** (icons)

## ♥ Credits

* [baicunko/scanyourpdf](https://github.com/baicunko/scanyourpdf)
* [mozilla/pdf.js](https://github.com/mozilla/pdf.js)
* [Scanner icons created by Freepik - Flaticon](https://www.flaticon.com/free-icons/scanner)

## 📝 License

MIT License
