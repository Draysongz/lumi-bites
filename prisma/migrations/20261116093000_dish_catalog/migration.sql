-- Catalog migration: MenuItem -> Dish (permanent) + DayDish (per-day publish).

-- 1. Create Dish, mirroring MenuItem minus per-day fields (available/portionsLeft/dayMenuId).
CREATE TABLE "Dish" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceKobo" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "rating" DOUBLE PRECISION,
    "category" TEXT,
    "prepTime" TEXT,
    "spice" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- 2. Backfill Dish from MenuItem (dedupe by name, keeping the earliest).
INSERT INTO "Dish" ("id", "name", "description", "priceKobo", "imageUrl", "rating", "category", "createdAt", "updatedAt")
SELECT
    "id", "name", "description", "priceKobo", "imageUrl", "rating", "category", "createdAt", "updatedAt"
FROM "MenuItem"
ORDER BY "createdAt" ASC
ON CONFLICT ("id") DO NOTHING;

-- 3. Create DayDish (per-day publish: which dishes live today + stock).
CREATE TABLE "DayDish" (
    "id" TEXT NOT NULL,
    "dayMenuId" TEXT NOT NULL,
    "dishId" TEXT NOT NULL,
    "portionsLeft" INTEGER,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DayDish_pkey" PRIMARY KEY ("id")
);

-- 4. Backfill DayDish from MenuItem (today's live dishes -> DayDish rows).
INSERT INTO "DayDish" ("id", "dayMenuId", "dishId", "portionsLeft", "available", "createdAt", "updatedAt")
SELECT
    "id", "dayMenuId", "id", "portionsLeft", "available", "createdAt", "updatedAt"
FROM "MenuItem";

CREATE UNIQUE INDEX "DayDish_dayMenuId_dishId_key" ON "DayDish"("dayMenuId", "dishId");
CREATE INDEX "DayDish_dishId_idx" ON "DayDish"("dishId");

-- 5. Repoint OrderItem + CartItem to Dish, preserving rows.
ALTER TABLE "OrderItem" ADD COLUMN "dishId" TEXT;
UPDATE "OrderItem" SET "dishId" = "menuItemId";
ALTER TABLE "OrderItem" ALTER COLUMN "dishId" SET NOT NULL;

ALTER TABLE "CartItem" ADD COLUMN "dishId" TEXT;
UPDATE "CartItem" SET "dishId" = "menuItemId";
ALTER TABLE "CartItem" ALTER COLUMN "dishId" SET NOT NULL;

-- 6. Add FKs to Dish.
ALTER TABLE "DayDish" ADD CONSTRAINT "DayDish_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DayDish" ADD CONSTRAINT "DayDish_dayMenuId_fkey" FOREIGN KEY ("dayMenuId") REFERENCES "DayMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 7. Drop the old MenuItem FKs + columns.
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_menuItemId_fkey";
ALTER TABLE "OrderItem" DROP COLUMN "menuItemId";
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_menuItemId_fkey";
ALTER TABLE "CartItem" DROP COLUMN "menuItemId";

-- 8. Drop MenuItem entirely.
DROP TABLE "MenuItem";
