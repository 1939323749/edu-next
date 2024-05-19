-- CreateTable
CREATE TABLE `_CourseToMajor` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CourseToMajor_AB_unique`(`A`, `B`),
    INDEX `_CourseToMajor_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CourseToMajor` ADD CONSTRAINT `_CourseToMajor_A_fkey` FOREIGN KEY (`A`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToMajor` ADD CONSTRAINT `_CourseToMajor_B_fkey` FOREIGN KEY (`B`) REFERENCES `Major`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
