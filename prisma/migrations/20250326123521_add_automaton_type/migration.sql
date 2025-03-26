/*
  Warnings:

  - Added the required column `type` to the `user_automata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_automata` ADD COLUMN `type` ENUM('FSM', 'PDA', 'TM') NOT NULL;
