import { useCallback } from "react";
import { useScannerStore } from "@/lib/scanner-store";
import { SliderSetting } from "./slider-setting";

const formatValue = (value: number): string => `${value.toFixed(1)}x`;

export function ScaleSetting() {
  const scale = useScannerStore((s) => s.config.scale);
  const setConfig = useScannerStore((s) => s.setConfig);
  const handleChange = useCallback(
    (value: number) => {
      setConfig((prev) => ({ ...prev, scale: value }));
    },
    [setConfig]
  );

  return (
    <SliderSetting
      formatValue={formatValue}
      label="Resolusi"
      max={3}
      min={1}
      onChange={handleChange}
      step={0.5}
      value={scale}
    />
  );
}
