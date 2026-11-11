/**
 * Provisional dish images (from the prototype HTML) keyed by a stable slug/substring.
 * Used as a fallback when MenuItem.imageUrl is null, so cards always show food.
 * Replace with real uploaded/CDN URLs as the admin starts uploading images.
 */

const DISH_IMAGES = {
  croaker: "/images/img1.jpg", // assumed: swap if img1 is a different dish
  jollof:
    "https://lh3.googleusercontent.com/aida/ALJJyrCZ...your existing jollof URL...",
  suya: "/images/suya.jpg",
  egusi: "/images/egusi.jpg",
} as const;

export { DISH_IMAGES };

export function lookupDishImage(name: string): string | null {
  const n = name.toLowerCase();
  if (n.includes("croaker") || n.includes("fish")) return DISH_IMAGES.croaker;
  if (n.includes("jollof")) return DISH_IMAGES.jollof;
  if (n.includes("suya")) return DISH_IMAGES.suya;
  if (n.includes("egusi") || n.includes("soup") || n.includes("pounded")) return DISH_IMAGES.egusi;
  return null;
}
