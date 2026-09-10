export interface ScanRenderer {
  renderPage: (
    image: Blob,
    options?: { signal?: AbortSignal }
  ) => Promise<{ blob: Blob }>;
}

export type RenderPageResult = Awaited<ReturnType<ScanRenderer["renderPage"]>>;
export type RenderPageParams = Parameters<ScanRenderer["renderPage"]>;
