import { parentPort, workerData } from 'node:worker_threads';

import { judgeSubmission } from '@/lib/judge/judge-submission';
import type { JudgeRequest, JudgeWorkerMessage } from '@/lib/judge/judge-types';

if (parentPort && workerData?.request) {
  const port = parentPort;
  const post = (message: JudgeWorkerMessage) => port.postMessage(message);

  // Progress reaches the main thread while this thread is still judging, so a run killed by the
  // wall-clock timeout can still report how many cases it got through.
  const result = judgeSubmission(workerData.request as JudgeRequest, (progress) =>
    post({ type: 'progress', progress }),
  );
  post({ type: 'result', result });
}

export default judgeSubmission;
