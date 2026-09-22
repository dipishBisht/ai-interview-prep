import type { ExtractedLink } from "./link-extractor";

const HIRING_TERMS = [
  "career",
  "careers",
  "jobs",
  "hiring",
  "join us",
  "join-us",
  "work with us",
  "work-with-us",
  "talent",
  "opportunities",
  "interview",
];

const COMPANY_TERMS = [
  "about",
  "about us",
  "company",
  "who we are",
  "what we do",
  "products",
  "services",
  "solutions",
];

export function rankResearchLinks(links: ExtractedLink[]) {
  return links
    .map((link) => {
      const haystack = `${link.text} ${link.url}`.toLowerCase();

      let score = 0;

      for (const term of HIRING_TERMS) {
        if (haystack.includes(term)) {
          score += 10;
        }
      }

      for (const term of COMPANY_TERMS) {
        if (haystack.includes(term)) {
          score += 5;
        }
      }

      return {
        link,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.link);
}
