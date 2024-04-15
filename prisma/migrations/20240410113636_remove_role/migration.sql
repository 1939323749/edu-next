/*
  Warnings:

  - You are about to drop the column `eduUserId` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `eduUserId` on the `teacher` table. All the data in the column will be lost.
  - You are about to drop the `_permissiontorole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eduuser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_permissiontorole` DROP FOREIGN KEY `_PermissionToRole_A_fkey`;

-- DropForeignKey
ALTER TABLE `_permissiontorole` DROP FOREIGN KEY `_PermissionToRole_B_fkey`;

-- DropForeignKey
ALTER TABLE `admin` DROP FOREIGN KEY `Admin_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `eduuser` DROP FOREIGN KEY `EduUser_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_eduUserId_fkey`;

-- DropForeignKey
ALTER TABLE `teacher` DROP FOREIGN KEY `Teacher_eduUserId_fkey`;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `eduUserId`;

-- AlterTable
ALTER TABLE `teacher` DROP COLUMN `eduUserId`;

-- DropTable
DROP TABLE `_permissiontorole`;

-- DropTable
DROP TABLE `admin`;

-- DropTable
DROP TABLE `eduuser`;

-- DropTable
DROP TABLE `permission`;

-- DropTable
DROP TABLE `role`;
