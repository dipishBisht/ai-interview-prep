import type { Kit } from "./kit-schema";

export type ValidationIssue = {
  code: string;
  message: string;
};

export function validateKitBusinessRules(kit: Kit): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const requirementIds = new Set(
    kit.role.requirements.map((requirement) => requirement.id),
  );

  const questionIds = new Set(kit.questions.map((question) => question.id));

  // Requirement IDs must be unique.
  if (requirementIds.size !== kit.role.requirements.length) {
    issues.push({
      code: "DUPLICATE_REQUIREMENT_ID",
      message: "Requirement IDs must be unique.",
    });
  }

  // Question IDs must be unique.
  if (questionIds.size !== kit.questions.length) {
    issues.push({
      code: "DUPLICATE_QUESTION_ID",
      message: "Question IDs must be unique.",
    });
  }

  // Every question must reference an existing requirement.
  for (const question of kit.questions) {
    for (const requirementId of question.requirement_ids) {
      if (!requirementIds.has(requirementId)) {
        issues.push({
          code: "INVALID_REQUIREMENT_REFERENCE",
          message: `Question ${question.id} references unknown requirement ${requirementId}.`,
        });
      }
    }
  }

  // Every schedule question must exist.
  for (const day of kit.schedule.days) {
    for (const questionId of day.question_ids) {
      if (!questionIds.has(questionId)) {
        issues.push({
          code: "INVALID_SCHEDULE_QUESTION",
          message: `Schedule day ${day.day} references unknown question ${questionId}.`,
        });
      }
    }
  }

  // Schedule must contain exactly the requested number of days.
  if (kit.schedule.days.length !== kit.schedule.days_available) {
    issues.push({
      code: "INVALID_SCHEDULE_LENGTH",
      message: "Schedule must contain exactly days_available days.",
    });
  }

  // Every must-have requirement must be covered.
  const scheduledQuestionIds = new Set(
    kit.schedule.days.flatMap((day) => day.question_ids),
  );

  const scheduledRequirements = new Set(
    kit.questions
      .filter((question) => scheduledQuestionIds.has(question.id))
      .flatMap((question) => question.requirement_ids),
  );

  for (const requirement of kit.role.requirements) {
    if (
      requirement.priority === "must" &&
      !scheduledRequirements.has(requirement.id)
    ) {
      issues.push({
        code: "MUST_REQUIREMENT_NOT_SCHEDULED",
        message: `Must-have requirement ${requirement.id} is not represented in the schedule.`,
      });
    }
  }

  return issues;
}
