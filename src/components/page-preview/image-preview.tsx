import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  alt: string;
  className?: string;
  height?: number;
  image?: Blob;
  width?: number;
}

export function ImagePreview({
  image,
  width,
  height,
  className,
  alt,
}: ImagePreviewProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      setUrl(null);
      return;
    }
    const u = URL.createObjectURL(image);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [image]);

  if (!url) {
    return (
      <Skeleton
        aria-hidden="true"
        className={cn("rounded-md", className)}
        style={{
          aspectRatio:
            width && height ? `${width} / ${height}` : "409.88 / 530.42",
        }}
      />
    );
  }

  return (
    <img
      alt={alt}
      className={cn("w-full rounded-md object-contain", className)}
      height={height}
      src={url}
      style={{
        aspectRatio: width && height ? `${width} / ${height}` : undefined,
      }}
      width={width}
    />
  );
}
