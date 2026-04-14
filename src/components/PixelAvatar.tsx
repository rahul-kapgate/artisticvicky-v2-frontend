// PixelAvatar.tsx
import { useEffect, useRef } from "react";

function hashStr(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

const PALETTES = [
  { bg: "#26215C", fg: "#7F77DD", acc: "#5DCAA5" },
  { bg: "#085041", fg: "#5DCAA5", acc: "#EF9F27" },
  { bg: "#4A1B0C", fg: "#D85A30", acc: "#FAC775" },
  { bg: "#042C53", fg: "#378ADD", acc: "#EEEDFE" },
  { bg: "#3C3489", fg: "#AFA9EC", acc: "#5DCAA5" },
  { bg: "#27500A", fg: "#97C459", acc: "#FAC775" },
  { bg: "#4B1528", fg: "#D4537E", acc: "#CECBF6" },
  { bg: "#412402", fg: "#EF9F27", acc: "#D85A30" },
];

interface Props {
  username: string;
  size?: number;
  className?: string;
}

export default function PixelAvatar({ username, size = 80, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const GRID = 8;
    const cell = size / GRID;
    const seed = hashStr(username || "user");
    const palette = PALETTES[(seed >> 4) % PALETTES.length];

    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, size, size);

    let s = seed;
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < Math.ceil(GRID / 2); col++) {
        s = ((s * 1664525 + 1013904223) >>> 0);
        const on = (s >>> 16) % 3 !== 0;
        if (on) {
          ctx.fillStyle = (s >>> 8) % 3 === 0 ? palette.acc : palette.fg;
          ctx.fillRect(col * cell, row * cell, cell, cell);
          ctx.fillRect((GRID - 1 - col) * cell, row * cell, cell, cell);
        }
      }
    }
  }, [username, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      style={{ imageRendering: "pixelated", borderRadius: "1rem" }}
    />
  );
}