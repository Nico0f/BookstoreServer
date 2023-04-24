/*
  Warnings:

  - Changed the type of `items` on the `CheckoutOrder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CheckoutOrder" DROP COLUMN "items",
ADD COLUMN     "items" JSONB NOT NULL;