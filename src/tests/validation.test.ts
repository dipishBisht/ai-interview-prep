import { describe, expect, it } from "vitest";
import { kitSchema } from "@/lib/validation/kit-schema";

describe("kit schema", () => {
  it("accepts a valid kit", () => {
    const kit = {
      source: {
        company: "Acme",
        company_url: "https://acme.com",
        role: "Senior Backend Engineer",
        location: "Remote",
        jd_chars: 500,
        researched_at: new Date().toISOString(),
        pages_used: ["https://acme.com"],
      },

      company_brief: {
        summary: "Acme builds software.",
        what_they_do: "Acme builds developer tools.",
        sources: ["https://acme.com"],
      },

      role: {
        title: "Senior Backend Engineer",
        seniority: "Senior",
        responsibilities: ["Build backend services"],
        requirements: [
          {
            id: "r1",
            text: "5+ years with Node.js",
            kind: "technical",
            priority: "must",
          },
        ],
      },

      questions: [
        {
          id: "q1",
          requirement_ids: ["r1"],
          category: "technical",
          prompt: "Explain Node.js event loop.",
          answer_outline: "Discuss event loop phases.",
          difficulty: 2,
        },
      ],

      flashcards: [
        {
          id: "f1",
          front: "What is Node.js?",
          back: "A JavaScript runtime.",
          requirement_ids: ["r1"],
        },
      ],

      schedule: {
        days_available: 1,
        days: [
          {
            day: 1,
            focus: "Node.js",
            question_ids: ["q1"],
            minutes: 60,
          },
        ],
      },

      coverage: {
        uncovered_requirement_ids: [],
        passes: 2,
      },
    };

    expect(kitSchema.safeParse(kit).success).toBe(true);
  });
});