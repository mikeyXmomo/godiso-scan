import { useCallback } from "react";

import { Switch } from "@/components/ui/switch";
import { useScannerStore } from "@/lib/scanner-store";

import { SettingField } from "./setting-field";

export function ColorspaceSetting() {
  const config = useScannerStore((s) => s.config);
  const setConfig = useScannerStore((s) => s.setConfig);
  const isColor = config.colorspace === "sRGB";
  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      setConfig((prev) => ({
        ...prev,
        colorspace: checked ? "sRGB" : "gray",
      }));
    },
    [setConfig]
  );

  return (
    <SettingField
      label="Mode warna"
      preview={isColor ? "Berwarna" : "Skala abu-abu"}
    >
      <Switch
        aria-label="Mode warna"
        checked={isColor}
        onCheckedChange={handleCheckedChange}
      />
    </SettingField>
  );
}
