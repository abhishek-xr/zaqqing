/*
  Warnings:

  - You are about to drop the column `moq` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productCode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `minOrderQty` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productCode` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Product_sku_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "moq",
DROP COLUMN "name",
DROP COLUMN "sku",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "minOrderQty" INTEGER NOT NULL,
ADD COLUMN     "productCode" TEXT NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_productCode_key" ON "Product"("productCode");

-- Normalize all SKUs in the database
UPDATE "Product" SET "productCode" = LOWER(TRIM("productCode"));
