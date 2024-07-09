/*
  Warnings:

  - The `createdAt` column on the `Org` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `createdAt` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_OrgToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdById` to the `Org` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `updatedAt` on the `Org` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `updatedAt` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_OrgToUser" DROP CONSTRAINT "_OrgToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrgToUser" DROP CONSTRAINT "_OrgToUser_B_fkey";

-- AlterTable
ALTER TABLE "Org" ADD COLUMN     "createdById" TEXT NOT NULL,
DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "_OrgToUser";

-- CreateTable
CREATE TABLE "_UserOrgs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserOrgs_AB_unique" ON "_UserOrgs"("A", "B");

-- CreateIndex
CREATE INDEX "_UserOrgs_B_index" ON "_UserOrgs"("B");

-- AddForeignKey
ALTER TABLE "Org" ADD CONSTRAINT "Org_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserOrgs" ADD CONSTRAINT "_UserOrgs_A_fkey" FOREIGN KEY ("A") REFERENCES "Org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserOrgs" ADD CONSTRAINT "_UserOrgs_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
