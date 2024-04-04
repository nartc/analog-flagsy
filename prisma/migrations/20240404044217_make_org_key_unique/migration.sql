/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Org` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Org_key_key" ON "Org"("key");
