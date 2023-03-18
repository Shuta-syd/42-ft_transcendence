-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "player1" TEXT NOT NULL,
    "player2" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);
