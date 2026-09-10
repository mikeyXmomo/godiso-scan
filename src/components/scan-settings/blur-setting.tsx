import { useCallback } from "react";

import { useScannerStore } from "@/lib/scanner-store";

import { SliderSetting } from "./slider-setting";

const formatValue = (value: number): string => value.toFixed(2);

export function BlurSetting() {
  const blur = useScannerStore((s) => s.config.blur);
  const setConfig = useScannerStore((s) => s.setConfig);
  const handleChange = useCallback(
    (value: number) => {
      setConfig((prev) => ({ ...prev, blur: value }));
    },
    [setConfig]
  );

  return (
    <SliderSetting
      formatValue={formatValue}
      label="Buram"
      max={1}
      min={0}
      onChange={handleChange}
      step={0.01}
      value={blur}
    />
  );
}
