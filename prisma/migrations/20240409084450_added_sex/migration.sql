/*
  Warnings:

  - Added the required column `sex` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `sex` VARCHAR(191) NOT NULL;
