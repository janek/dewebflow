import * as prettier from "prettier";
import getAllSubpages from "./getAllSubpages.js";

const baseUrl = "https://untested.webflow.io";
const subpageUrls = await getAllSubpages(baseUrl);

const saveSubpage = async (url, html) => {
  const fileName = url === baseUrl ? "index.html" : url.replace(baseUrl, ".").concat(".html");
  await Bun.write(fileName, html);
}

for (const url of subpageUrls) {
  const response = await fetch(url);
  const html = await response.text();
  const prettierHtml = await prettier.format(html, { parser: "html" }); 
  saveSubpage(url, prettierHtml);
}

