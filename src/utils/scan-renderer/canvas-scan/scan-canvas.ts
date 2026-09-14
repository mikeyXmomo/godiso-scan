import type { ScanConfig } from "../config.types";

export async function scanCanvas(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  page: Blob,
  config: ScanConfig,
  noise: Blob,
  signal?: AbortSignal
): Promise<void> {
  if (signal?.aborted) {
    throw new Error("Aborted");
  }

  const imgPromise = createImageBitmap(page);
  const noiseImagePromise = createImageBitmap(noise);

  // SAFETY: HTMLCanvasElement and OffscreenCanvas both return their respective 2D context here.
  const ctx = canvas.getContext("2d") as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D;
  if (!ctx) {
    throw new Error("Canvas not supported");
  }

  const img = await imgPromise;
  if (signal?.aborted) {
    throw new Error("Aborted");
  }

  const { width, height } = img;

  canvas.width = width;
  canvas.height = height;

  // fill white
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  // add blur
  ctx.filter = `blur(${config.blur}px)`;
  if (config.colorspace === "gray") {
    ctx.filter += " grayscale(1)";
  }

  // add brightness
  ctx.filter += ` brightness(${config.brightness})`;

  // modify yellowish
  ctx.filter += ` sepia(${config.yellowish})`;

  // add contrast
  ctx.filter += ` contrast(${config.contrast})`;

  // rotate
  ctx.translate(width / 2, height / 2);
  ctx.rotate(
    ((config.rotate + config.rotate_var * Math.random()) * Math.PI) / 180
  );
  ctx.translate(-width / 2, -height / 2);

  ctx.drawImage(img, 0, 0);

  ctx.filter = "none";

  const noiseImage = await noiseImagePromise;
  ctx.drawImage(noiseImage, 0, 0, width, height);

  if (config.border) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width, height);
  }

  drawWatermark(ctx, width, height, config.watermark);
}

function drawWatermark(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  watermark: ScanConfig["watermark"]
) {
  if (!watermark.text.trim()) {
    return;
  }

  const baseFontPx = Math.max(24, Math.round(width * 0.06) * watermark.scale);
  const spacing = baseFontPx * watermark.y_spacing;
  const angle = (watermark.rotate * Math.PI) / 180;

  ctx.save();
  ctx.globalAlpha = Math.min(1, Math.max(0, watermark.opacity));
  ctx.fillStyle = watermark.color || "#888888";
  ctx.font = `${baseFontPx}px ${watermark.font_family}, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  for (let y = spacing / 2; y < height + spacing; y += spacing) {
    for (let x = spacing / 2; x < width + spacing; x += spacing) {
      const offsetX = x + watermark.x_offset * spacing;
      ctx.save();
      ctx.translate(offsetX, y);
      ctx.rotate(angle);
      ctx.fillText(watermark.text, 0, 0);
      ctx.restore();
    }
  }

  ctx.restore();
}
