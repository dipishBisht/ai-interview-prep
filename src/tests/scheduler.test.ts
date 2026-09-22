import { describe, expect, it } from "vitest";

import { buildSchedule } from "@/lib/schedule/scheduler";

describe("schedule allocator", () => {
  const requirements = [
    {
      id: "r1",
      text: "React",
      kind: "technical" as const,
      priority: "must" as const,
    },
  ];

  const questions = [
    {
      id: "q1",
      requirement_ids: ["r1"],
      category: "technical" as const,
      prompt: "React question",
      answer_outline: "Answer",
      difficulty: 3 as const,
    },
    {
      id: "q2",
      requirement_ids: [],
      category: "behavioural" as const,
      prompt: "Behaviour question",
      answer_outline: "Answer",
      difficulty: 1 as const,
    },
    {
      id: "q3",
      requirement_ids: [],
      category: "system-design" as const,
      prompt: "System design question",
      answer_outline: "Answer",
      difficulty: 2 as const,
    },
  ];

  it("creates exactly the requested number of days", () => {
    const schedule = buildSchedule(questions, requirements, 5);

    expect(schedule.days).toHaveLength(5);
  });

  it("references only existing questions", () => {
    const schedule = buildSchedule(questions, requirements, 2);

    const ids = new Set(questions.map((question) => question.id));

    for (const day of schedule.days) {
      for (const questionId of day.question_ids) {
        expect(ids.has(questionId)).toBe(true);
      }
    }
  });

  it("uses integer durations", () => {
    const schedule = buildSchedule(questions, requirements, 2);

    for (const day of schedule.days) {
      expect(Number.isInteger(day.minutes)).toBe(true);
    }
  });
});
