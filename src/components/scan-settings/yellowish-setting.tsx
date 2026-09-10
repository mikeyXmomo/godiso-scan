import { useCallback } from "react";

import { useScannerStore } from "@/lib/scanner-store";

import { SliderSetting } from "./slider-setting";

const formatValue = (value: number): string => value.toFixed(2);

export function YellowishSetting() {
  const yellowish = useScannerStore((s) => s.config.yellowish);
  const setConfig = useScannerStore((s) => s.setConfig);
  const handleChange = useCallback(
    (value: number) => {
      setConfig((prev) => ({ ...prev, yellowish: value }));
    },
    [setConfig]
  );

  return (
    <SliderSetting
      formatValue={formatValue}
      label="Kekuningan"
      max={2}
      min={0}
      onChange={handleChange}
      step={0.01}
      value={yellowish}
    />
  );
}
