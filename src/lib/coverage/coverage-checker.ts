import type { Requirement, Question } from "@/lib/validation/kit-schema";

export function findUncoveredRequirements(
  requirements: Requirement[],
  questions: Question[],
): string[] {
  const coveredRequirementIds = new Set(
    questions.flatMap((question) => question.requirement_ids),
  );

  return requirements
    .filter((requirement) => requirement.priority === "must")
    .filter((requirement) => !coveredRequirementIds.has(requirement.id))
    .map((requirement) => requirement.id);
}
