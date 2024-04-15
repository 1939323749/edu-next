/*
  Warnings:

  - You are about to drop the column `classesId` on the `student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_classesId_fkey`;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `classesId`,
    ADD COLUMN `classId` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
