/*
  Warnings:

  - A unique constraint covering the columns `[roomId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "onGoing" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "InviteGame" ADD COLUMN     "onGoing" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "roomId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Match_roomId_key" ON "Match"("roomId");
