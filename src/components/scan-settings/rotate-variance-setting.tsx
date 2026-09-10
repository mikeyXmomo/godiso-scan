import { useCallback } from "react";

import { useScannerStore } from "@/lib/scanner-store";

import { SliderSetting } from "./slider-setting";

const formatValue = (value: number): string => `±${value.toFixed(1)}°`;

export function RotateVarianceSetting() {
  const rotateVar = useScannerStore((s) => s.config.rotate_var);
  const setConfig = useScannerStore((s) => s.setConfig);
  const handleChange = useCallback(
    (value: number) => {
      setConfig((prev) => ({ ...prev, rotate_var: value }));
    },
    [setConfig]
  );

  return (
    <SliderSetting
      formatValue={formatValue}
      label="Variasi rotasi"
      max={10}
      min={0}
      onChange={handleChange}
      step={0.1}
      value={rotateVar}
    />
  );
}
