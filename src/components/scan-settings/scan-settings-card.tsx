import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardPanel } from "@/components/ui/card";
import { useScannerStore } from "@/lib/scanner-store";

import { BlurSetting } from "./blur-setting";
import { BorderSetting } from "./border-setting";
import { BrightnessSetting } from "./brightness-setting";
import { ColorspaceSetting } from "./colorspace-setting";
import { ContrastSetting } from "./contrast-setting";
import { NoiseSetting } from "./noise-setting";
import { PresetChips } from "./preset-chips";
import { RotateSetting } from "./rotate-setting";
import { RotateVarianceSetting } from "./rotate-variance-setting";
import { ScaleSetting } from "./scale-setting";
import { YellowishSetting } from "./yellowish-setting";

export function ScanSettingsCard() {
  const resetConfig = useScannerStore((s) => s.resetConfig);

  return (
    <Card>
      <CardPanel className="flex flex-col gap-4">
        <PresetChips />
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <ColorspaceSetting />
          <BorderSetting />
        </div>
        <RotateSetting />
        <RotateVarianceSetting />
        <BrightnessSetting />
        <YellowishSetting />
        <ContrastSetting />
        <BlurSetting />
        <NoiseSetting />
        <ScaleSetting />
        <div className="flex justify-end">
          <Button
            aria-label="Reset ke bawaan"
            onClick={resetConfig}
            size="sm"
            variant="ghost"
          >
            <RotateCcw aria-hidden="true" />
            Reset ke bawaan
          </Button>
        </div>
      </CardPanel>
    </Card>
  );
}
