import { validateExternalUrl } from "./url-security";
import { crawlCompany } from "./crawler";
import type { ResearchPage, ResearchResult } from "./types";

export async function researchCompany(
  companyUrl: string,
): Promise<ResearchResult> {
  const validatedUrl = validateExternalUrl(companyUrl);

  const result = await crawlCompany(validatedUrl.toString(), {
    maxPages: 8,
  });

  const pages: ResearchPage[] = result.pages.map((page) => ({
    url: page.finalUrl,
    title: page.title,
    text: page.text,
    status: page.status,
    kind: classifyPage(page.title, page.finalUrl, page.text),
  }));

  return {
    companyUrl: validatedUrl.toString(),
    pages,
    failures: result.failures,
    linksDiscovered: result.pages.reduce(
      (count, page) => count + page.links.length,
      0,
    ),
    researchedAt: new Date().toISOString(),
  };
}

function classifyPage(
  title: string,
  url: string,
  text: string,
): ResearchPage["kind"] {
  const value = `${title} ${url} ${text.slice(0, 3000)}`.toLowerCase();

  if (/interview|hiring process|selection process/.test(value)) {
    return "interview";
  }

  if (/career|careers|jobs|hiring|join us|talent/.test(value)) {
    return "hiring";
  }

  if (/about us|about company|who we are|what we do/.test(value)) {
    return "about";
  }

  return "other";
}
