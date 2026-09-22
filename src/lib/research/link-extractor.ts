import * as cheerio from "cheerio";

export type ExtractedLink = {
  url: string;
  text: string;
};

export function extractLinks(html: string, baseUrl: string): ExtractedLink[] {
  const $ = cheerio.load(html);

  const links: ExtractedLink[] = [];
  const seen = new Set<string>();

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");

    if (!href) {
      return;
    }

    try {
      const url = new URL(href, baseUrl);

      if (!["http:", "https:"].includes(url.protocol)) {
        return;
      }

      const normalized = url.toString();

      if (seen.has(normalized)) {
        return;
      }

      seen.add(normalized);

      links.push({
        url: normalized,
        text: $(element).text().replace(/\s+/g, " ").trim(),
      });
    } catch {
      // Ignore malformed links.
    }
  });

  return links;
}
