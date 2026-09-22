import { fetchPage } from "./page-fetcher";
import { extractLinks } from "./link-extractor";
import { rankResearchLinks } from "./link-ranker";
import { canFetchUrl } from "./robots";
import { withRetry } from "./retry";

type CrawlOptions = {
  maxPages?: number;
};

function isSameOrigin(targetUrl: string, rootUrl: string) {
  try {
    return new URL(targetUrl).origin === new URL(rootUrl).origin;
  } catch {
    return false;
  }
}

export async function crawlCompany(
  startUrl: string,
  options: CrawlOptions = {},
) {
  const maxPages = options.maxPages ?? 8;

  const visited = new Set<string>();
  const pages = [];
  const failures: {
    url: string;
    error: string;
  }[] = [];

  const queue = [startUrl];

  while (queue.length > 0 && pages.length < maxPages) {
    const currentUrl = queue.shift()!;

    if (visited.has(currentUrl)) {
      continue;
    }

    visited.add(currentUrl);

    try {
      if (!(await canFetchUrl(currentUrl))) {
        failures.push({
          url: currentUrl,
          error: "ROBOTS_DISALLOWED",
        });

        continue;
      }

      const page = await withRetry(() => fetchPage(currentUrl), {
        retries: 2,
        baseDelayMs: 500,
      });

      const links = extractLinks(page.html, page.finalUrl);

      pages.push({
        url: page.url,
        finalUrl: page.finalUrl,
        title: page.title,
        text: page.text,
        status: page.status,
        links,
      });

      const rankedLinks = rankResearchLinks(links);

      for (const link of rankedLinks) {
        if (
          isSameOrigin(link.url, startUrl) &&
          !visited.has(link.url) &&
          !queue.includes(link.url)
        ) {
          queue.push(link.url);
        }
      }
    } catch (error) {
      failures.push({
        url: currentUrl,
        error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
      });
    }
  }

  return {
    pages,
    failures,
  };
}
