import { describe, expect, it } from "vitest";

import { findUncoveredRequirements } from "@/lib/coverage/coverage-checker";

describe("coverage checker", () => {
  it("finds uncovered must-have requirements", () => {
    const requirements = [
      {
        id: "r1",
        text: "React",
        kind: "technical" as const,
        priority: "must" as const,
      },
      {
        id: "r2",
        text: "Node.js",
        kind: "technical" as const,
        priority: "must" as const,
      },
      {
        id: "r3",
        text: "AWS",
        kind: "technical" as const,
        priority: "nice" as const,
      },
    ];

    const questions = [
      {
        id: "q1",
        requirement_ids: ["r1"],
        category: "technical" as const,
        prompt: "Explain React rendering.",
        answer_outline: "Discuss reconciliation.",
        difficulty: 2 as const,
      },
    ];

    expect(findUncoveredRequirements(requirements, questions)).toEqual(["r2"]);
  });

  it("does not report nice-to-have requirements", () => {
    const requirements = [
      {
        id: "r1",
        text: "AWS",
        kind: "technical" as const,
        priority: "nice" as const,
      },
    ];

    expect(findUncoveredRequirements(requirements, [])).toEqual([]);
  });
});
