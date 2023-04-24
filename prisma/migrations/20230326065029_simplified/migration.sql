/*
  Warnings:

  - You are about to drop the column `orderAmount` on the `CheckoutOrder` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAmount` on the `CheckoutOrder` table. All the data in the column will be lost.
  - You are about to drop the column `taxesAmount` on the `CheckoutOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CheckoutOrder" DROP COLUMN "orderAmount",
DROP COLUMN "shippingAmount",
DROP COLUMN "taxesAmount";
