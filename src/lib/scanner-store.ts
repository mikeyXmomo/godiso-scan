import { create } from "zustand";

import { defaultConfig } from "@/utils/scan-renderer/config.types";
import type { ScanConfig } from "@/utils/scan-renderer/config.types";

// The setter intentionally accepts either a config value or an updater function.
// oxlint-disable anti-slop/no-runtime-typeof

interface ScannerState {
  config: ScanConfig;
  pdf: File | undefined;
  resetConfig: () => void;
  setConfig: (updater: ScanConfig | ((prev: ScanConfig) => ScanConfig)) => void;
  setPdf: (pdf: File | undefined) => void;
}

export const useScannerStore = create<ScannerState>((set) => ({
  config: defaultConfig,
  pdf: undefined,
  resetConfig: () => set({ config: defaultConfig }),
  setConfig: (updater) =>
    set((state) => ({
      config: typeof updater === "function" ? updater(state.config) : updater,
    })),
  setPdf: (pdf) => set({ pdf }),
}));
