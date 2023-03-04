/*
  Warnings:

  - Added the required column `score1` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score2` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "score1" INTEGER NOT NULL,
ADD COLUMN     "score2" INTEGER NOT NULL,
ADD COLUMN     "state" INTEGER NOT NULL;
