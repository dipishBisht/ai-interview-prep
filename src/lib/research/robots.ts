import robotsParser from "robots-parser";

const cache = new Map<string, ReturnType<typeof robotsParser>>();

export async function getRobotsParser(targetUrl: string) {
  const url = new URL(targetUrl);

  const robotsUrl = new URL("/robots.txt", url.origin);

  const cached = cache.get(robotsUrl.toString());

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(robotsUrl, {
      signal: AbortSignal.timeout(5_000),
      headers: {
        "User-Agent": "AI-Interview-Prep-Kit/1.0 (+assessment)",
      },
    });

    if (!response.ok) {
      return null;
    }

    const text = await response.text();

    const parser = robotsParser(robotsUrl.toString(), text);

    cache.set(robotsUrl.toString(), parser);

    return parser;
  } catch {
    return null;
  }
}

export async function canFetchUrl(targetUrl: string) {
  const robots = await getRobotsParser(targetUrl);

  if (!robots) {
    return true;
  }

  return robots.isAllowed(targetUrl, "AI-Interview-Prep-Kit/1.0") !== false;
}
