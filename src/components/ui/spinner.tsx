import { Loader2Icon } from "lucide-react";
import type React from "react";

import { cn } from "@/lib/utils";

// The SVG spinner uses status semantics to announce an in-progress operation.
// oxlint-disable jsx-a11y/prefer-tag-over-role

export function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof Loader2Icon>): React.ReactElement {
  return (
    <Loader2Icon
      aria-label="Loading"
      className={cn("animate-spin", className)}
      role="status"
      {...props}
    />
  );
}
