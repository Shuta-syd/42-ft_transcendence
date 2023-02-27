-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "player1" TEXT NOT NULL,
    "player2" TEXT NOT NULL,
    "winner_id" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);
