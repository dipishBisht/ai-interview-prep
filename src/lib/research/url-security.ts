export function validateExternalUrl(rawUrl: string): URL {
  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("INVALID_COMPANY_URL");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("UNSUPPORTED_URL_PROTOCOL");
  }

  if (url.username || url.password) {
    throw new Error("URL_CREDENTIALS_NOT_ALLOWED");
  }

  const hostname = url.hostname.toLowerCase();

  const blockedHostnames = new Set([
    "localhost",
    "localhost.localdomain",
    "127.0.0.1",
    "::1",
    "0.0.0.0",
  ]);

  if (blockedHostnames.has(hostname)) {
    throw new Error("PRIVATE_URL_NOT_ALLOWED");
  }

  if (hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
    throw new Error("PRIVATE_URL_NOT_ALLOWED");
  }

  return url;
}
