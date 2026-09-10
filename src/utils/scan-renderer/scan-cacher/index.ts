import type {
  RenderPageParams,
  RenderPageResult,
  ScanRenderer,
} from "../types";

export class ScanCacher implements ScanRenderer {
  private readonly cache = new Map<Blob, RenderPageResult>();
  private readonly renderer: ScanRenderer;

  constructor(renderer: ScanRenderer) {
    this.renderer = renderer;
  }

  async renderPage(
    image: RenderPageParams[0],
    options?: RenderPageParams[1]
  ): Promise<RenderPageResult> {
    const cached = this.cache.get(image);
    if (cached) {
      return cached;
    }

    const result = await this.renderer.renderPage(image, options);
    this.cache.set(image, result);
    return result;
  }
}
