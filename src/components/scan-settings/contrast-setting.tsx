import { useCallback } from "react";

import { useScannerStore } from "@/lib/scanner-store";

import { SliderSetting } from "./slider-setting";

const formatValue = (value: number): string => value.toFixed(2);

export function ContrastSetting() {
  const contrast = useScannerStore((s) => s.config.contrast);
  const setConfig = useScannerStore((s) => s.setConfig);
  const handleChange = useCallback(
    (value: number) => {
      setConfig((prev) => ({ ...prev, contrast: value }));
    },
    [setConfig]
  );

  return (
    <SliderSetting
      formatValue={formatValue}
      label="Kontras"
      max={2}
      min={0}
      onChange={handleChange}
      step={0.01}
      value={contrast}
    />
  );
}
