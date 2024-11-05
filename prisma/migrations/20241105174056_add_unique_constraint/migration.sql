/*
  Warnings:

  - A unique constraint covering the columns `[professionalId,serviceId]` on the table `professional_services` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "professional_services_professionalId_serviceId_key" ON "professional_services"("professionalId", "serviceId");
