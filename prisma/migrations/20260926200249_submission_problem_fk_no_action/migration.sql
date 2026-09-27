-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_problem_id_fkey";

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

