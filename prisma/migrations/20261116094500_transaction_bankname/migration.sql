-- Add bankName to Transaction (dynamic account bank shown in the pay modal).
ALTER TABLE "Transaction" ADD COLUMN "bankName" TEXT;
