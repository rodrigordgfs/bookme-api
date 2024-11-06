/*
  Warnings:

  - You are about to drop the column `professionalId` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `appointments` table. All the data in the column will be lost.
  - Added the required column `professionalServiceId` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_professionalId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_serviceId_fkey";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "professionalId",
DROP COLUMN "serviceId",
ADD COLUMN     "professionalServiceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_professionalServiceId_fkey" FOREIGN KEY ("professionalServiceId") REFERENCES "professional_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
