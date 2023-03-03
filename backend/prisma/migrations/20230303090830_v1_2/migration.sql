/*
  Warnings:

  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatRoom" ALTER COLUMN "name" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL;
