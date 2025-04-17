import { ProblemDifficulty, Status, Verdict } from "@prisma/client"

export const getDifficultyBadge = (difficulty: ProblemDifficulty) => {
  const colorMap = {
    [ProblemDifficulty.UNKNOWN]: "bg-gray-100 text-gray-800",
    [ProblemDifficulty.EASY]: "bg-green-100 text-green-800",
    [ProblemDifficulty.MEDIUM]: "bg-yellow-100 text-yellow-800",
    [ProblemDifficulty.HARD]: "bg-red-100 text-red-800",
    [ProblemDifficulty.EXPERT]: "bg-purple-100 text-purple-800",
  };
  const text = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
  return { color: colorMap[difficulty], text };
}

export const getStatusBadge = (verdict: Verdict | null, status: Status) => {
  const result = verdict || status;
  switch (result) {
    case "ACCEPTED":
      return { color: "bg-green-100 text-green-800 hover:bg-green-100", text: 'Accepted' }
    case "WRONG_RESULT":
      return { color: "bg-red-100 text-red-800 hover:bg-red-100", text: 'Wrong Result' }
    case "PENDING":
      return { color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100", text: 'Pending' }
    default:
      return { color: "bg-gray-100 text-gray-800 hover:bg-gray-100", text: 'Unknown' }
  }
}