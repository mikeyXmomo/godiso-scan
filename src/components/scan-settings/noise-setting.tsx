import { useCallback } from "react";

import { useScannerStore } from "@/lib/scanner-store";

import { SliderSetting } from "./slider-setting";

const formatValue = (value: number): string => value.toFixed(2);

export function NoiseSetting() {
  const noise = useScannerStore((s) => s.config.noise);
  const setConfig = useScannerStore((s) => s.setConfig);
  const handleChange = useCallback(
    (value: number) => {
      setConfig((prev) => ({ ...prev, noise: value }));
    },
    [setConfig]
  );

  return (
    <SliderSetting
      formatValue={formatValue}
      label="Derau"
      max={1}
      min={0}
      onChange={handleChange}
      step={0.01}
      value={noise}
    />
  );
}
