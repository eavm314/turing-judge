import { parentPort, workerData } from 'node:worker_threads';

import { judgeSubmission } from '@/lib/judge/judge-submission';
import type { JudgeRequest } from '@/lib/judge/judge-types';

if (parentPort && workerData?.request) {
  parentPort.postMessage(judgeSubmission(workerData.request as JudgeRequest));
}

export default judgeSubmission;
