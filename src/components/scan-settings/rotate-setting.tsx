import { useCallback } from "react";
import { useScannerStore } from "@/lib/scanner-store";
import { SliderSetting } from "./slider-setting";

const formatValue = (value: number): string => `${value.toFixed(1)}°`;

export function RotateSetting() {
  const rotate = useScannerStore((s) => s.config.rotate);
  const setConfig = useScannerStore((s) => s.setConfig);
  const handleChange = useCallback(
    (value: number) => {
      setConfig((prev) => ({ ...prev, rotate: value }));
    },
    [setConfig]
  );

  return (
    <SliderSetting
      formatValue={formatValue}
      label="Rotasi"
      max={10}
      min={-10}
      onChange={handleChange}
      step={0.1}
      value={rotate}
    />
  );
}
