import * as prettier from "prettier";


const baseUrl = "https://untested.webflow.io";

const response = await fetch(baseUrl);
const html = await response.text();
const prettierHtml = await prettier.format(html, { parser: "html" });
await Bun.write("index.html", prettierHtml);


console.log(prettierHtml);
