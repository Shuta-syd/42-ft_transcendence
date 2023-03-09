/*
  Warnings:

  - You are about to drop the column `isDM` on the `ChatRoom` table. All the data in the column will be lost.
  - Added the required column `password` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "RoomRole" ADD VALUE 'DM';

-- AlterTable
ALTER TABLE "ChatRoom" DROP COLUMN "isDM",
ADD COLUMN     "password" TEXT NOT NULL;
