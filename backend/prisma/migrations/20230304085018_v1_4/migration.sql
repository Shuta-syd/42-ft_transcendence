-- CreateEnum
CREATE TYPE "RoomRole" AS ENUM ('OWNER', 'ADMIN', 'NORMAL');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "role" "RoomRole" NOT NULL DEFAULT 'NORMAL';
