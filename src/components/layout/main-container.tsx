import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MainContainerProps {
  children: ReactNode;
  className?: string;
}

export function MainContainer({ children, className }: MainContainerProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full px-4 pt-4 pb-10 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px]",
        className
      )}
    >
      {children}
    </main>
  );
}
