import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "public/icons";
await mkdir(OUT, { recursive: true });

const icons = [
  { src: "scripts/icon.svg", size: 512, file: "icon-512.png" },
  { src: "scripts/icon.svg", size: 192, file: "icon-192.png" },
  { src: "scripts/icon-maskable.svg", size: 512, file: "maskable-512.png" },
  { src: "scripts/icon.svg", size: 180, file: "apple-touch.png" },
];

for (const icon of icons) {
  const buf = await sharp(icon.src).resize(icon.size, icon.size).png().toBuffer();
  const path = `${OUT}/${icon.file}`;
  await sharp(buf).toFile(path);
  console.log("✓", path, `(${icon.size}x${icon.size})`);
}
