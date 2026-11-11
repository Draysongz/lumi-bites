-- AlterTable
ALTER TABLE "DayMenu" ADD COLUMN     "dailyNote" TEXT;

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "category" TEXT,
ADD COLUMN     "portionsLeft" INTEGER,
ADD COLUMN     "rating" DOUBLE PRECISION;
