import * as prettier from "prettier";
import getAllSubpages from "./getAllSubpages.js";
import insertHtmlSnippet from "./insertHtmlSnippet.ts";

const baseUrl: string = "https://untested.webflow.io";
const subpageUrls: string[] = await getAllSubpages(baseUrl);

const saveSubpage = async (url: string, html: string) => {
  const prettierHtml = await prettier.format(html, { parser: "html" }); 
  const fileName: string = url === baseUrl ? "index.html" : url.replace(baseUrl, ".").concat(".html");
  await Bun.write(fileName, prettierHtml);
}

const insertBadgeHideScript = async (html: string) => {
  const badgeHideScriptPath = "html-snippets/remove-badge.html";
  const htmlWithBadgeHideScript = await insertHtmlSnippet(html, "endOfBody", badgeHideScriptPath );
  return htmlWithBadgeHideScript;
}

for (const url of subpageUrls) {
  const response = await fetch(url);
  let html: string = await response.text();
  html = await insertBadgeHideScript(html);
  saveSubpage(url, html);
}

