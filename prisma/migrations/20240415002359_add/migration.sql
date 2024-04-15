-- CreateTable
CREATE TABLE `TimeBlock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `week_start` INTEGER NOT NULL,
    `week_end` INTEGER NOT NULL,
    `start` INTEGER NOT NULL,
    `end` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CourseToTimeBlock` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CourseToTimeBlock_AB_unique`(`A`, `B`),
    INDEX `_CourseToTimeBlock_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CourseToTimeBlock` ADD CONSTRAINT `_CourseToTimeBlock_A_fkey` FOREIGN KEY (`A`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToTimeBlock` ADD CONSTRAINT `_CourseToTimeBlock_B_fkey` FOREIGN KEY (`B`) REFERENCES `TimeBlock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
