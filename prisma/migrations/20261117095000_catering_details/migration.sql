-- Catering booking contact + logistics fields.
ALTER TABLE "CateringBooking" ADD COLUMN "clientName" TEXT;
ALTER TABLE "CateringBooking" ADD COLUMN "clientPhone" TEXT;
ALTER TABLE "CateringBooking" ADD COLUMN "company" TEXT;
ALTER TABLE "CateringBooking" ADD COLUMN "venue" TEXT;
ALTER TABLE "CateringBooking" ADD COLUMN "address" TEXT;
ALTER TABLE "CateringBooking" ADD COLUMN "menuItems" TEXT;
