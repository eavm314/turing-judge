/*
  Warnings:

  - You are about to alter the column `difficulty` on the `problems` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(2))`.
  - The values [WRONG_ANSWER] on the enum `submissions_verdict` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `expected_result` on the `test_cases` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to drop the `user_automata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_automata` DROP FOREIGN KEY `user_automata_user_id_fkey`;

-- AlterTable
ALTER TABLE `problems` MODIFY `difficulty` ENUM('UNKNOWN', 'EASY', 'MEDIUM', 'HARD', 'EXPERT') NOT NULL;

-- AlterTable
ALTER TABLE `submissions` ADD COLUMN `message` VARCHAR(191) NULL,
    MODIFY `verdict` ENUM('ACCEPTED', 'WRONG_RESULT', 'WRONG_OUTPUT', 'STEP_LIMIT_EXCEEDED', 'TIME_LIMIT_EXCEEDED', 'INVALID_FORMAT', 'UNKNOWN_ERROR') NULL;

-- AlterTable
ALTER TABLE `test_cases` MODIFY `expected_result` BOOLEAN NOT NULL;

-- DropTable
DROP TABLE `user_automata`;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `type` ENUM('FSM', 'PDA', 'TM') NOT NULL,
    `automaton` JSON NOT NULL,
    `is_public` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
