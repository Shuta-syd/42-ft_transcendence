-- CreateEnum
CREATE TYPE "BanType" AS ENUM ('CHANNEL', 'LOCAL');

-- CreateTable
CREATE TABLE "BanUserOnChatRoom" (
    "id" TEXT NOT NULL,
    "baned_userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "BanUserOnChatRoom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BanUserOnChatRoom" ADD CONSTRAINT "BanUserOnChatRoom_baned_userId_fkey" FOREIGN KEY ("baned_userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanUserOnChatRoom" ADD CONSTRAINT "BanUserOnChatRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
