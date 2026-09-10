import type { ScanConfig } from "../config.types";
import type { ScanRenderer } from "../types";
import { createNoiseBlob } from "./create-noise-blob";
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
      const blob = await new Promise<Blob>((resolve, reject) => {
        worker.onmessage = (e) => {
          resolve(e.data);
          worker.terminate();
        };
        worker.onerror = (e) => {
          console.error(e);
          reject(e);
          worker.terminate();
        };
        worker.postMessage({
          config: JSON.parse(JSON.stringify(this.config)),
          noise: noiseBlob,
          page: image,
        });
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
