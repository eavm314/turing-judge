import path from 'node:path';

import type {
  JudgeOutcome,
  JudgeProgress,
  JudgeRequest,
  JudgeWorkerMessage,
} from './judge-types';

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_MEMORY_MB = 256;

// Loaded opaquely: a static import would let Turbopack recognise the `new Worker(...)` below as a
// module reference and, since the path is dynamic, glob the whole project root looking for an entry.
// The worker bundle is built separately by tools/build-verify-worker.mjs.
const loadWorkerThreads = () => import(/* turbopackIgnore: true */ 'node:worker_threads');

export const resolveWorkerPath = () =>
  process.env.JUDGE_WORKER_PATH ?? path.join(process.cwd(), 'dist/workers/verify-worker.cjs');

export const runInWorker = async (request: JudgeRequest): Promise<JudgeOutcome> => {
  const { Worker } = await loadWorkerThreads();

  return new Promise<JudgeOutcome>((resolve, reject) => {
    const worker = new Worker(resolveWorkerPath(), {
      workerData: { request },
      // The judge reads no environment, so don't hand a submission DATABASE_URL or AUTH_SECRET.
      env: {},
      execArgv: [],
      resourceLimits: {
        maxOldGenerationSizeMb: Number(process.env.JUDGE_WORKER_MEMORY_MB ?? DEFAULT_MEMORY_MB),
        maxYoungGenerationSizeMb: 32,
      },
    });

    let settled = false;
    let progress: JudgeProgress = { passedCases: 0, totalCases: request.testCases.length };

    const settle = (finish: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      finish();
    };

    const timer = setTimeout(() => {
      // terminate() interrupts the running execute() loop, which never yields on its own.
      settle(() => resolve({ ok: false, reason: 'timeout', progress }));
      void worker.terminate();
    }, Number(process.env.JUDGE_WORKER_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS));
    timer.unref();

    worker.on('message', (message: JudgeWorkerMessage) => {
      if (message.type === 'progress') {
        progress = message.progress;
        return;
      }
      settle(() => resolve({ ok: true, result: message.result }));
    });
    worker.on('error', (error: Error) => settle(() => reject(error)));
    worker.on('exit', (code) =>
      settle(() => reject(new Error(`Judge worker exited with code ${code}`))),
    );
  });
};
