import * as prettier from "prettier";
import getAllSubpages from "./getAllSubpages.js";

const baseUrl = "https://untested.webflow.io";
const subpages = await getAllSubpages(baseUrl);
console.log("subpages: ", subpages);

for (const subpage of subpages) {
  const response = await fetch(subpage);
  const html = await response.text();
  const prettierHtml = await prettier.format(html, { parser: "html" });
  console.log(prettierHtml);
}


