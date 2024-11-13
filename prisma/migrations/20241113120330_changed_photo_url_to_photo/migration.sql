/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `professionals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "photoUrl",
ADD COLUMN     "photo" TEXT;

-- AlterTable
ALTER TABLE "professionals" DROP COLUMN "photoUrl",
ADD COLUMN     "photo" TEXT;
