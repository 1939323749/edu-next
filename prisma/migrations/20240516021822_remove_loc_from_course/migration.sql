/*
  Warnings:

  - You are about to drop the `_coursetolocation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_coursetolocation` DROP FOREIGN KEY `_CourseToLocation_A_fkey`;

-- DropForeignKey
ALTER TABLE `_coursetolocation` DROP FOREIGN KEY `_CourseToLocation_B_fkey`;

-- DropTable
DROP TABLE `_coursetolocation`;
