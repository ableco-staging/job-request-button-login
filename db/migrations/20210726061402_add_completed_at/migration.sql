/*
  Warnings:

  - Added the required column `completedAt` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "completedAt" TIMESTAMP(3) NOT NULL;
