import { useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { useScannerStore } from "@/lib/scanner-store";
import { SCAN_PRESETS } from "@/utils/scan-renderer/config.types";
import type { ScanPreset } from "@/utils/scan-renderer/config.types";

type PresetKey = keyof ScanPreset["values"];
type PresetValue = ScanPreset["values"][PresetKey];

const PRESET_KEYS: readonly PresetKey[] = [
  "blur",
  "border",
  "brightness",
  "colorspace",
  "contrast",
  "noise",
  "rotate",
  "rotate_var",
  "yellowish",
];

function configMatchesPreset(
  configKey: (key: PresetKey) => PresetValue,
  preset: ScanPreset
): boolean {
  return PRESET_KEYS.every((key) => configKey(key) === preset.values[key]);
}

interface PresetEntry {
  onSelect: () => void;
  preset: ScanPreset;
}

export function PresetChips() {
  const setConfig = useScannerStore((s) => s.setConfig);

  const activePresetId = useScannerStore(
    (s) =>
      SCAN_PRESETS.find((preset) =>
        configMatchesPreset((key) => s.config[key], preset)
      )?.id
  );

  const makeSelect = useCallback(
    (preset: ScanPreset) => () => {
      setConfig((prev) => ({ ...prev, ...preset.values }));
    },
    [setConfig]
  );

  const entries = useMemo<PresetEntry[]>(
    () =>
      SCAN_PRESETS.map((preset) => ({ onSelect: makeSelect(preset), preset })),
    [makeSelect]
  );

  return (
    <fieldset
      aria-label="Preset pengaturan"
      className="m-0 flex flex-wrap items-center gap-2 border-0 p-0"
    >
      {entries.map(({ preset, onSelect }) => {
        const isActive = preset.id === activePresetId;
        return (
          <Button
            aria-pressed={isActive}
            key={preset.id}
            onClick={onSelect}
            size="sm"
            title={preset.description}
            variant={isActive ? "default" : "outline"}
          >
            {preset.label}
          </Button>
        );
      })}
    </fieldset>
  );
}
