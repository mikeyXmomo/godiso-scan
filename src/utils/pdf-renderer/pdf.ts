import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
// Vite provides the worker URL through the virtual ?url module.
// oxlint-disable-next-line import/default
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import type { PDFPageInfo, PDFRenderer } from "./types";

GlobalWorkerOptions.workerSrc = workerSrc;

export class PDF implements PDFRenderer {
  private readonly pdf: File;
  private pdfDocument?: PDFDocumentProxy;
  private readonly initPromise: Promise<void>;
  private readonly pagePromises = new Map<string, Promise<PDFPageInfo>>();

  constructor(pdf: File) {
    this.pdf = pdf;
    this.initPromise = this.init();
  }

  private async init() {
    const url = URL.createObjectURL(this.pdf);
    const pdfDocument = await getDocument({
      standardFontDataUrl: "/standard_fonts/",
      url,
    }).promise;
    this.pdfDocument = pdfDocument;
  }

  private async getDocument(): Promise<PDFDocumentProxy> {
    await this.initPromise;
    if (!this.pdfDocument) {
      throw new Error("PDF document is not initialized");
    }
    return this.pdfDocument;
  }

  async getNumPages(): Promise<number> {
    const doc = await this.getDocument();
    return doc.numPages;
  }

  async renderPage(page: number, scale: number): Promise<PDFPageInfo> {
    const promise = this.pagePromises.get(`${page}-${scale}`);
    if (promise) {
      return await promise;
    }

    const pageInfoPromise = this.renderPageRaw(page, scale);
    this.pagePromises.set(`${page}-${scale}`, pageInfoPromise);
    return await pageInfoPromise;
  }

  private async renderPageRaw(
    page: number,
    scale: number
  ): Promise<PDFPageInfo> {
    const ppi = scale * 72;
    const pdfDocument = await this.getDocument();
    const pdfPage = await pdfDocument.getPage(page);
    const viewport = pdfPage.getViewport({ scale });
    const { width, height } = viewport;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas context is null");
    }

    await pdfPage.render({
      canvas,
      canvasContext: ctx,
      viewport,
    }).promise;

    // HTMLCanvasElement.toBlob completes through its callback API.
    // oxlint-disable-next-line promise/avoid-new
    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob((pageBlob) => {
        if (pageBlob) {
          resolve(pageBlob);
        } else {
          reject(new Error("Canvas to Blob failed"));
        }
      });
    });

    canvas.remove();
    pdfPage.cleanup();

    return { blob, height, page, ppi, scale, width };
  }
}
