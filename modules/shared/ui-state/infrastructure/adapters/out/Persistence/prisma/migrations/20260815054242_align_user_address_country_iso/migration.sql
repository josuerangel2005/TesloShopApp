-- DropForeignKey
ALTER TABLE "UserAddress" DROP CONSTRAINT "UserAddress_countryId_fkey";

-- AlterTable
ALTER TABLE "UserAddress" ALTER COLUMN "countryId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("countryId") ON DELETE RESTRICT ON UPDATE CASCADE;
