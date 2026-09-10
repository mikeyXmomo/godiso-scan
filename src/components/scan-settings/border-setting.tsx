import { useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { useScannerStore } from "@/lib/scanner-store";
import { SettingField } from "./setting-field";

export function BorderSetting() {
  const border = useScannerStore((s) => s.config.border);
  const setConfig = useScannerStore((s) => s.setConfig);
  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      setConfig((prev) => ({ ...prev, border: checked }));
    },
    [setConfig]
  );

  return (
    <SettingField label="Garis tepi">
      <Switch
        aria-label="Garis tepi"
        checked={border}
        onCheckedChange={handleCheckedChange}
      />
    </SettingField>
  );
}
