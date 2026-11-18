/**
 * Fallback dish images keyed by a stable slug/substring.
 * Used when a MenuItem.imageUrl is null so cards always render something.
 * Local files live in public/images/ — upload new ones there and extend the map.
 *
 * TODO: no dedicated fish/croaker photo yet — `croaker` currently reuses the
 * jollof plate (img1.jpg). Drop in a real fish image and repoint it.
 */

export const DISH_IMAGES: Record<string, string> = {
  croaker: "/images/img1.jpg",
  jollof: "/images/img1.jpg",
  suya: "/images/suya.jpg",
  egusi: "/images/egusi.jpg",
};

/** Return a fallback image for a dish named `name`, or null if unknown. */
export function lookupDishImage(name: string): string | null {
  const n = name.toLowerCase();
  if (n.includes("jollof")) return DISH_IMAGES.jollof;
  if (n.includes("suya")) return DISH_IMAGES.suya;
  if (n.includes("egusi") || n.includes("soup") || n.includes("pounded")) return DISH_IMAGES.egusi;
  if (n.includes("croaker") || n.includes("fish") || n.includes("catfish"))
    return DISH_IMAGES.croaker;
  return null;
}
