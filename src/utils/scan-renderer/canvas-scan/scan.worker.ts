import type { ScanConfig } from "../config.types";
import { scanCanvas } from "./scan-canvas";

export interface WorkerMessage {
  config: ScanConfig;
  noise: Blob;
  page: Blob;
}

self.addEventListener("message", async (e: MessageEvent<WorkerMessage>) => {
  const { page, config, noise } = e.data;
  // initial size, will be resized
  const canvas = new OffscreenCanvas(1000, 1000);
  await scanCanvas(canvas, page, config, noise);
  const blob = await canvas.convertToBlob({ type: config.output_format });
  // WorkerGlobalScope.postMessage does not accept Window's targetOrigin argument.
  // oxlint-disable-next-line unicorn/require-post-message-target-origin
  self.postMessage(blob);
});
