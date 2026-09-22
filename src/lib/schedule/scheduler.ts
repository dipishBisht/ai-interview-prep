import type { Question, Requirement } from "@/lib/validation/kit-schema";

type ScheduledDay = {
  day: number;
  focus: string;
  question_ids: string[];
  minutes: number;
};

type ScheduleResult = {
  days_available: number;
  days: ScheduledDay[];
};

function getQuestionScore(question: Question, requirements: Requirement[]) {
  const linkedRequirements = requirements.filter((requirement) =>
    question.requirement_ids.includes(requirement.id),
  );

  let score = question.difficulty * 10;

  for (const requirement of linkedRequirements) {
    if (requirement.priority === "must") {
      score += 100;
    }

    if (requirement.kind === "technical") {
      score += 20;
    }

    if (requirement.kind === "behavioural") {
      score += 10;
    }

    if (requirement.kind === "domain") {
      score += 15;
    }
  }

  if (question.category === "system-design") {
    score += 20;
  }

  return score;
}

export function buildSchedule(
  questions: Question[],
  requirements: Requirement[],
  daysAvailable: number,
): ScheduleResult {
  if (!Number.isInteger(daysAvailable)) {
    throw new Error("daysAvailable must be an integer.");
  }

  if (daysAvailable < 1) {
    throw new Error("daysAvailable must be at least 1.");
  }

  const sortedQuestions = [...questions].sort(
    (a, b) =>
      getQuestionScore(b, requirements) - getQuestionScore(a, requirements),
  );

  const days: ScheduledDay[] = Array.from(
    { length: daysAvailable },
    (_, index) => ({
      day: index + 1,
      focus: "Review",
      question_ids: [],
      minutes: 0,
    }),
  );

  sortedQuestions.forEach((question, index) => {
    const dayIndex = index % daysAvailable;

    days[dayIndex].question_ids.push(question.id);

    days[dayIndex].minutes +=
      question.difficulty === 3 ? 30 : question.difficulty === 2 ? 20 : 15;
  });

  for (const day of days) {
    const dayQuestions = questions.filter((question) =>
      day.question_ids.includes(question.id),
    );

    const categories = [
      ...new Set(dayQuestions.map((question) => question.category)),
    ];

    day.focus = categories.length > 0 ? categories.join(" + ") : "Review";
  }

  return {
    days_available: daysAvailable,
    days,
  };
}
