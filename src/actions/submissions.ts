"use server";

import { type ServerActionResult } from "@/hooks/use-server-action";
import { auth } from "@/lib/auth";
import AutomatonExecutor from "@/lib/automaton/AutomatonExecutor";
import { FiniteStateMachine } from "@/lib/automaton/FiniteStateMachine";
import { prisma } from "@/lib/db/prisma";
import {
  automatonCodeSchema,
  type AutomatonCode,
} from "@/lib/schemas/automaton-code";

export const getUserSubmissions = async (problemId: string) => {
  const session = await auth();
  if (!session?.user?.id) return [];

  const results = await prisma.submission.findMany({
    where: { problemId, userId: session.user.id },
    select: {
      status: true,
      verdict: true,
      message: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return results;
};

export const submitSolutionAction = async (
  problemId: string,
  projectId: string | null,
  automatonCode: AutomatonCode | null,
): Promise<ServerActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "User not authenticated" };
  }

  let solutionCode;
  if (projectId !== null) {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: session.user.id,
      },
      select: {
        automaton: true,
        type: true,
      },
    });
    if (!project) {
      return { success: false, message: "Project not found" };
    }
    solutionCode = {
      type: project.type,
      automaton: project.automaton,
    };
  } else if (automatonCode !== null) {
    solutionCode = automatonCode;
  } else {
    return { success: false, message: "No automaton provided" };
  }

  const result = automatonCodeSchema.safeParse(solutionCode);
  if (!result.success) {
    await prisma.submission.create({
      data: {
        userId: session.user.id,
        problemId,
        status: "FINISHED",
        verdict: "INVALID_FORMAT",
        message: "The provided code is not a valid automaton.",
      },
    });
    return { success: false, message: "Invalid automaton code" };
  }
  const submission = await prisma.submission.create({
    data: {
      userId: session.user.id,
      problemId,
      status: "PENDING",
    },
  });

  setTimeout(() => {
    verifySolution(submission.id, problemId, result.data);
  }, 5000);

  return { success: true, message: "Solution submitted successfully" };
};

const verifySolution = async (
  submissionId: number,
  problemId: string,
  solution: AutomatonCode,
) => {
  const problemTestData = await prisma.problem.findUnique({
    where: { id: problemId },
    select: {
      allowFSM: true,
      allowPDA: true,
      allowTM: true,
      allowNonDet: true,
      stateLimit: true,
      depthLimit: true,
      maxStepLimit: true,
      testCases: {
        select: {
          input: true,
          expectedResult: true,
          expectedOutput: true,
        },
      },
    },
  });

  if (!problemTestData) {
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: "FINISHED",
        verdict: "INVALID_FORMAT",
        message: "Problem not found.",
      },
    });
    return;
  }
  if (solution.type === "FSM" && !problemTestData.allowFSM) {
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: "FINISHED",
        verdict: "INVALID_FORMAT",
        message: "This problem does not accept FSM solutions.",
      },
    });
    return;
  }
  if (solution.type === "PDA" && !problemTestData.allowPDA) {
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: "FINISHED",
        verdict: "INVALID_FORMAT",
        message: "This problem does not accept PDA solutions.",
      },
    });
    return;
  }
  if (solution.type === "TM" && !problemTestData.allowTM) {
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: "FINISHED",
        verdict: "INVALID_FORMAT",
        message: "This problem does not accept TM solutions.",
      },
    });
    return;
  }

  if (solution.type === "FSM") {
    const automaton = new FiniteStateMachine(solution.automaton);
    AutomatonExecutor.setAutomaton(automaton);
  }

  let overallResult = true;
  let failedTestCase: (typeof problemTestData.testCases)[number] | null = null;
  for (const testCase of problemTestData.testCases) {
    const result = AutomatonExecutor.execute(testCase.input);
    overallResult =
      overallResult && result.accepted === testCase.expectedResult;
    if (!overallResult) {
      failedTestCase = testCase;
      break;
    }
  }
  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: "FINISHED",
      verdict: overallResult ? "ACCEPTED" : "WRONG_RESULT",
      message: failedTestCase
        ? `Failed test case: '${failedTestCase.input}'`
        : null,
    },
  });
};
