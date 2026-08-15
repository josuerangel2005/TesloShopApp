/*
  Warnings:

  - You are about to drop the column `tex` on the `Order` table. All the data in the column will be lost.
  - Added the required column `tax` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderAddress" DROP CONSTRAINT "OrderAddress_countryId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "tex",
ADD COLUMN     "tax" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "paidAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderAddress" ALTER COLUMN "countryId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "OrderAddress" ADD CONSTRAINT "OrderAddress_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("countryId") ON DELETE RESTRICT ON UPDATE CASCADE;
