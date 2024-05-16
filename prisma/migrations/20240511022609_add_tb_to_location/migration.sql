-- CreateTable
CREATE TABLE `_LocationToTimeBlock` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LocationToTimeBlock_AB_unique`(`A`, `B`),
    INDEX `_LocationToTimeBlock_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_LocationToTimeBlock` ADD CONSTRAINT `_LocationToTimeBlock_A_fkey` FOREIGN KEY (`A`) REFERENCES `Location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LocationToTimeBlock` ADD CONSTRAINT `_LocationToTimeBlock_B_fkey` FOREIGN KEY (`B`) REFERENCES `TimeBlock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
