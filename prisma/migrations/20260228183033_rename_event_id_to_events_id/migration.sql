/*
  Warnings:

  - You are about to drop the column `eventId` on the `Participant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,eventsId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventsId` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_eventId_fkey";

-- DropIndex
DROP INDEX "Participant_userId_eventId_key";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "eventId",
ADD COLUMN     "eventsId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Participant_userId_eventsId_key" ON "Participant"("userId", "eventsId");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_eventsId_fkey" FOREIGN KEY ("eventsId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
