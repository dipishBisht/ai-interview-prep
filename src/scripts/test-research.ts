import { fetchPage } from "@/lib/research/page-fetcher";

async function main() {
  const page = await fetchPage("https://www.microsoft.com");

  console.log({
    url: page.url,
    finalUrl: page.finalUrl,
    title: page.title,
    textLength: page.text.length,
    preview: page.text.slice(0, 500),
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});