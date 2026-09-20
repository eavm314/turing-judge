import { createJudgeExecutor } from './judge-executor';
import type { JudgeProgress, JudgeRequest, JudgeResult, JudgeVerdict } from './judge-types';

type FailedCaseData = {
  input: string;
  result: boolean;
  expectedResult: boolean;
  depthLimitReached: boolean;
  maxLimitReached: boolean;
};

const formatCaseCount = ({ passedCases, totalCases }: JudgeProgress) =>
  `(${passedCases}/${totalCases})`;

const buildMessage = (progress: JudgeProgress, failedCaseData: FailedCaseData | null) => {
  let message = formatCaseCount(progress);
  if (failedCaseData) {
    message += ` Failed test case: '${failedCaseData.input}'.`;
    if (!failedCaseData.result && failedCaseData.depthLimitReached) {
      message += ' Depth limit reached.';
    }
    if (failedCaseData.maxLimitReached) {
      message += ' Max step limit reached.';
    }
  }
  return message;
};

export const buildTimeoutMessage = (progress: JudgeProgress) =>
  `${formatCaseCount(progress)} Time limit exceeded.`;

export const judgeSubmission = (
  { solution, constraints, testCases }: JudgeRequest,
  onProgress?: (progress: JudgeProgress) => void,
): JudgeResult => {
  const totalCases = testCases.length;
  const invalidFormat = (message: string): JudgeResult => ({
    verdict: 'INVALID_FORMAT',
    message,
    totalCases,
    passedCases: 0,
  });

  if (solution.type === 'FSM' && !constraints.allowFSM) {
    return invalidFormat('This problem does not accept FSM solutions.');
  }
  if (solution.type === 'PDA' && !constraints.allowPDA) {
    return invalidFormat('This problem does not accept PDA solutions.');
  }
  if (solution.type === 'TM' && !constraints.allowTM) {
    return invalidFormat('This problem does not accept TM solutions.');
  }

  const executor = createJudgeExecutor(solution);

  if (!executor.isDeterministic() && !constraints.allowNonDet) {
    return invalidFormat('This problem does not accept non-deterministic solutions.');
  }
  if (executor.countStates() > constraints.stateLimit) {
    return invalidFormat('The automaton has too many states.');
  }
  executor.config = {
    depthLimit: constraints.depthLimit,
    maxSteps: constraints.maxStepLimit,
  };

  let passedCases = 0;
  let finalVerdict: JudgeVerdict = 'ACCEPTED';
  let failedCaseData: FailedCaseData | null = null;
  for (const testCase of testCases) {
    const result = executor.execute(testCase.input, false);
    if (result.maxLimitReached) {
      finalVerdict = 'STEP_LIMIT_EXCEEDED';
    }
    if (result.accepted !== testCase.expectedResult) {
      finalVerdict = 'WRONG_RESULT';
    }
    if (finalVerdict !== 'ACCEPTED') {
      failedCaseData = {
        input: testCase.input,
        result: result.accepted,
        expectedResult: testCase.expectedResult,
        depthLimitReached: result.depthLimitReached,
        maxLimitReached: result.maxLimitReached,
      };
      break;
    }
    passedCases++;
    onProgress?.({ passedCases, totalCases });
  }

  return {
    verdict: finalVerdict,
    message: buildMessage({ passedCases, totalCases }, failedCaseData),
    totalCases,
    passedCases,
  };
};
