import { prisma } from "@/lib/prisma";
import { lookupDishImage } from "@/lib/images";
import { resolveImageUrl } from "@/lib/storage";
import MenuController from "./MenuController";

export const dynamic = "force-dynamic";

export type MenuDish = {
  id: string;
  name: string;
  description: string | null;
  priceKobo: number;
  portionsLeft: number | null;
  available: boolean;
  category: string | null;
  prepTime: string | null;
  spice: string | null;
  image: string | null;
};

export default async function AdminMenuPage() {
  // Catalog dishes with today's live publishing (portions/available).
  const dishes = await prisma.dish.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      dayDishes: {
        where: {
          dayMenu: { active: true },
        },
        take: 1,
      },
    },
  });

  const rows: MenuDish[] = await Promise.all(
    dishes.map(async (d) => {
      const today = d.dayDishes[0];
      return {
        id: d.id,
        name: d.name,
        description: d.description,
        priceKobo: d.priceKobo,
        portionsLeft: today?.portionsLeft ?? null,
        available: today?.available ?? false,
        category: d.category,
        prepTime: d.prepTime,
        spice: d.spice,
        image: (await resolveImageUrl(d.imageUrl)) ?? lookupDishImage(d.name),
      };
    }),
  );

  return <MenuController dishes={rows} />;
}
