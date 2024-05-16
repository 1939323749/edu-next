-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `departmentId` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
