import type { ScanConfig } from "../config.types";
import type { ScanRenderer } from "../types";
import { createNoiseBlob } from "./create-noise-blob";
// Vite provides the worker constructor through the virtual ?worker module.
// oxlint-disable-next-line import/default
import ScanWorker from "./scan.worker?worker";

// to avoid web worker cold start
const workers = [
  new ScanWorker(),
  new ScanWorker(),
  new ScanWorker(),
  new ScanWorker(),
  new ScanWorker(),
];

const noiseBlobCache = new Map<string, Blob>();

export class CanvasScanner implements ScanRenderer {
  config: ScanConfig;

  constructor(config: ScanConfig) {
    this.config = config;
  }

  async renderPage(
    image: Blob,
    options?: { signal?: AbortSignal }
  ): Promise<{ blob: Blob }> {
    if (options?.signal?.aborted) {
      throw new Error("Aborted");
    }

    const worker = workers.shift() ?? new ScanWorker();
    workers.push(new ScanWorker());

    const abortHandler = () => worker.terminate();
    options?.signal?.addEventListener("abort", abortHandler);

    const noiseBlob = await getNoiseBlob(this.config.noise);

    try {
      // Worker completion is delivered through message/error events.
      // oxlint-disable-next-line promise/avoid-new
      const blob = await new Promise<Blob>((resolve, reject) => {
        const handleMessage = (e: MessageEvent<Blob>) => {
          resolve(e.data);
          worker.terminate();
        };
        const handleError = (e: ErrorEvent) => {
          console.error(e);
          reject(e);
          worker.terminate();
        };
        worker.addEventListener("message", handleMessage, { once: true });
        worker.addEventListener("error", handleError, { once: true });
        const workerMessage = {
          config: structuredClone(this.config),
          noise: noiseBlob,
          page: image,
        };
        // DedicatedWorkerGlobalScope.postMessage has no targetOrigin parameter.
        // oxlint-disable-next-line unicorn/require-post-message-target-origin
        worker.postMessage(workerMessage);
      });

      return { blob };
    } finally {
      options?.signal?.removeEventListener("abort", abortHandler);
    }
  }
}

async function getNoiseBlob(noise: number) {
  const noiseCacheKey = noise.toFixed(2);
  const cachedNoiseBlob = noiseBlobCache.get(noiseCacheKey);
  if (cachedNoiseBlob) {
    return cachedNoiseBlob;
  }
  const noiseBlob = await createNoiseBlob(noise, 1000, 1000);
  noiseBlobCache.set(noiseCacheKey, noiseBlob);
  return noiseBlob;
}
