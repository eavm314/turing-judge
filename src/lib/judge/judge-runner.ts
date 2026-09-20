import { judgeSubmission } from './judge-submission';
import type { JudgeOutcome, JudgeRequest } from './judge-types';
import { runInWorker } from './worker-judge-runner';

// Read at call time, not module scope: module scope also evaluates during `next build`, where a
// standalone deployment's build host and run host do not share environment.
export const runJudge = (request: JudgeRequest): Promise<JudgeOutcome> =>
  process.env.JUDGE_WORKER === '1'
    ? runInWorker(request)
    : Promise.resolve<JudgeOutcome>({ ok: true, result: judgeSubmission(request) });
