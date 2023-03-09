/*
  Warnings:

  - Added the required column `type` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('PUBLIC', 'PROTECT', 'PRIVATE', 'DM');

-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "type" "RoomType" NOT NULL;

-- DropEnum
DROP TYPE "RoomRole";
