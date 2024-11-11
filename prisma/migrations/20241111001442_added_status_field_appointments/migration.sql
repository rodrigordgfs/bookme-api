-- CreateEnum
CREATE TYPE "StatusAppointment" AS ENUM ('pending', 'confirmed', 'completed', 'canceled');

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "status" "StatusAppointment" NOT NULL DEFAULT 'pending';
