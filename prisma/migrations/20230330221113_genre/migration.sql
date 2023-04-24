/*
  Warnings:

  - You are about to drop the column `genre` on the `Book` table. All the data in the column will be lost.
  - Added the required column `genreName` to the `BookGenre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "genre";

-- AlterTable
ALTER TABLE "BookGenre" ADD COLUMN     "genreName" TEXT NOT NULL;
