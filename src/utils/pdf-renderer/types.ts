export interface PDFPageInfo {
  blob: Blob;
  height: number;
  page: number;
  ppi: number;
  scale: number;
  width: number;
}

export interface PDFInfoType {
  filename: string;
  source: string;
}

export interface PDFRenderer {
  getNumPages: () => Promise<number>;
  renderPage: (page: number, scale: number) => Promise<PDFPageInfo>;
}
