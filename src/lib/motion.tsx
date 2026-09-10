import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  /** When true, the element reveals immediately on mount rather than on view. */
  immediate?: boolean;
  offsetX?: number;

  /**
   * Distance in pixels the element travels from. Default reveals from below.
   */
  offsetY?: number;
}

const DEFAULT_OFFSET = 16;

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 500,
  offsetY = DEFAULT_OFFSET,
  offsetX = 0,
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) {
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    const node = ref.current as HTMLDivElement | null;
    if (node) {
      observer.observe(node);
    }
    return () => {
      observer.disconnect();
    };
  }, [immediate]);

  const style: CSSProperties & Record<string, string> = {
    "--reveal-delay": `${delay}ms`,
    "--reveal-duration": `${duration}ms`,
    "--reveal-offset-x": `${offsetX}px`,
    "--reveal-offset-y": `${offsetY}px`,
  };

  return (
    <div
      className={cn("reveal", className)}
      data-revealed={visible ? "true" : "false"}
      ref={ref}
      style={style}
    >
      {children}
    </div>
  );
}
