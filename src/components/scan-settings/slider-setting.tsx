import type { ComponentProps } from "react";
import { useCallback } from "react";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

import { SettingField } from "./setting-field";

interface SliderSettingProps {
  className?: string;
  formatValue?: (value: number) => string;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  preview?: string;
  step: number;
  value: number;
}

export function SliderSetting({
  label,
  value,
  onChange,
  min,
  max,
  step,
  preview,
  formatValue,
  className,
}: SliderSettingProps) {
  const handleValueChange = useCallback<
    NonNullable<ComponentProps<typeof Slider>["onValueChange"]>
  >(
    (nextValue) => {
      if (!Array.isArray(nextValue)) {
        onChange(nextValue);
      }
    },
    [onChange]
  );

  return (
    <SettingField
      label={label}
      preview={preview ?? (formatValue ? formatValue(value) : undefined)}
    >
      <Slider
        aria-label={label}
        className={cn("min-h-11", className)}
        max={max}
        min={min}
        onValueChange={handleValueChange}
        step={step}
        value={value}
      />
    </SettingField>
  );
}
