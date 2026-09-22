import { validateExternalUrl } from "./url-security";
import { cleanHtml } from "./html-cleaner";

const MAX_HTML_BYTES = 1_000_000;
const REQUEST_TIMEOUT_MS = 10_000;

export type FetchedPage = {
  url: string;
  finalUrl: string;
  title: string;
  text: string;
  status: number;
  html: string;
};

export async function fetchPage(rawUrl: string): Promise<FetchedPage> {
  const url = validateExternalUrl(rawUrl);

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "AI-Interview-Prep-Kit/1.0 (+assessment)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("text/html")) {
      throw new Error("UNSUPPORTED_CONTENT_TYPE");
    }

    const contentLength = response.headers.get("content-length");

    if (contentLength && Number(contentLength) > MAX_HTML_BYTES) {
      throw new Error("PAGE_TOO_LARGE");
    }

    const html = await response.text();

    if (Buffer.byteLength(html, "utf8") > MAX_HTML_BYTES) {
      throw new Error("PAGE_TOO_LARGE");
    }

    const cleaned = cleanHtml(html);

    return {
      url: url.toString(),
      finalUrl: response.url,
      title: cleaned.title,
      text: cleaned.text,
      status: response.status,
      html,
    };
  } finally {
    clearTimeout(timeout);
  }
}
