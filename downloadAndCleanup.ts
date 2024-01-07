import * as prettier from "prettier";
import getAllSubpages from "./getAllSubpages.js";
import insertHtmlSnippet from "./insertHtmlSnippet.ts";


const prompt = "What's the URL for your free Webflow site? (e.g. https://something.webflow.io)" + "\n";
process.stdout.write(prompt);

let baseUrl: string = "";
for await (const line of console) {
  try {
    const response = await fetch(line);
    if (!response.ok) {
      process.stdout.write(line + " seems like an invalid URL. Please try again. Make sure it uses https://." + "\n");
    } else {
      baseUrl = line;
      const html = await response.text();
      if (!html.includes(`<meta content="Webflow"`)) {
        process.stdout.write(line + " doesn't seem to be a Webflow site, please try another URL:" + "\n");
        continue;
      }
      process.stdout.write("Processing " + line + "\n");
      break;
    }
  } catch (error) {
    process.stdout.write(line + " seems like an invalid URL. Please try again. Make sure it uses https://." + "\n");
  }
}

// Check if current folder is a github repo
const isGitRepo = await Bun.file(".git/HEAD").exists();
if (!isGitRepo) {
  process.stdout.write("Github repository not found. Please run this from a directory that contains a repository that's connected to your deployment (e.g. Netlify or Vercel)" + "\n");
  process.exit(1);
}

const subpageUrls: string[] = await getAllSubpages(baseUrl);

const saveSubpage = async (url: string, html: string) => {
  const subdirectory = "output";
  const prettierHtml = await prettier.format(html, { parser: "html" }); 
  const fileName: string = url === baseUrl ? "index.html" : url.replace(baseUrl, ".").concat(".html");
  await Bun.write(subdirectory + "/" + fileName, prettierHtml);
}

const insertBadgeHideScript = async (html: string) => {
  const badgeHideScriptPath = "html-snippets/remove-badge.html";
  const htmlWithBadgeHideScript = await insertHtmlSnippet(html, "endOfBody", badgeHideScriptPath );
  return htmlWithBadgeHideScript;
}

const insertCustomHtmlSnippet = async (html: string) => {
  const customHtmlSnippetPath = "html-snippets/test-custom-code.html";
  const htmlWithCustomHtmlSnippet = await insertHtmlSnippet(
    html,
    "replacingAnotherElement",
    customHtmlSnippetPath,
    "test-custom-code"
  );
  return htmlWithCustomHtmlSnippet;
}

// Download and process subpages
for (const url of subpageUrls) {
  const response = await fetch(url);
  let html: string = await response.text();
  html = await insertBadgeHideScript(html);
  html = await insertCustomHtmlSnippet(html);
  saveSubpage(url, html);
}

console.log("Done!");
