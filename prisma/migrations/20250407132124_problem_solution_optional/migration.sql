-- AlterTable
ALTER TABLE `problems` ADD COLUMN `public_solution` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `solution_automaton` JSON NULL;
