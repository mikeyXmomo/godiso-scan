import type { ReactNode } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface SettingFieldProps {
  children: ReactNode;
  className?: string;
  label: string;
  preview?: ReactNode;
}

export function SettingField({
  label,
  preview,
  className,
  children,
}: SettingFieldProps) {
  return (
    <Field className={cn("w-full", className)}>
      <div className="flex w-full items-center justify-between gap-4">
        <FieldLabel>{label}</FieldLabel>
        {preview !== undefined && preview !== null ? (
          <div className="text-muted-foreground text-base tabular-nums">
            {preview}
          </div>
        ) : null}
      </div>
      {children}
    </Field>
  );
}
