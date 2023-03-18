/*
  Warnings:

  - You are about to drop the column `score1` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `score2` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "score1",
DROP COLUMN "score2",
DROP COLUMN "state";
