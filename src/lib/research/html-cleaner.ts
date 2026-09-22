import * as cheerio from "cheerio";

export function cleanHtml(html: string) {
  const $ = cheerio.load(html);

  $("script, style, noscript, iframe, svg").remove();
  $("nav, footer, header, aside").remove();

  const title = $("title").first().text().trim();

  const text = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title,
    text,
  };
}
