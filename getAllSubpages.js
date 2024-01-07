import * as cheerio from "cheerio";

const getAllSubpages = async (url, depth = 4) => {
  const baseUrl = url;
  const urls = await getSubpagesForUrl(url, 0, depth, baseUrl);
  return urls;
};

const getSubpagesForUrl = async (
  url,
  currentDepth,
  depth,
  baseUrl,
  visited = new Set()
) => {
  // Check for depth limit and circular references
  if (currentDepth > depth || visited.has(url)) {
    return [];
  }

  visited.add(url);

  let html;
  try {
    const response = await fetch(url);
    html = await response.text();
  } catch (error) {
    console.error("Error fetching URL:", url, error);
    return [];
  }
  const $ = cheerio.load(html);
  const urls = $("a")
    .map((i, el) => $(el).attr("href"))
    .get()

  console.log("urls", urls);
  const filteredUrls = urls
    .filter((url) => url.startsWith("/"));
  console.log("filteredUrls", filteredUrls);
  const uniqueUrls = [...new Set(filteredUrls)];
  console.log("Unique URLs:", uniqueUrls);

  // Resolve relative URLs and filter out invalid URLs
  const fullUrls = uniqueUrls
    .map((relativeUrl) => {
      try {
        return new URL(relativeUrl, baseUrl).href;
      } catch {
        return null;
      }
    })
  console.log("fullUrls", fullUrls);
    // .filter((url) => (url.startsWith("/") || url.startsWith(baseUrl)));
  // Recursive fetching of subpages
  const subUrls = await Promise.all(
    fullUrls.map((subUrl) =>
      getSubpagesForUrl(subUrl, currentDepth + 1, depth, baseUrl, visited)
    )
  );

  console.log("subUrls", subUrls);
  const ret = [url, ...subUrls.flat()];
  console.log("ret", ret);
  return ret
};

export default getAllSubpages;
