import { $ } from "bun";
import * as prettier from "prettier";
import getAllSubpages from "./getAllSubpages.js";
import {
  insertHtmlFromFile,
  insertBadgeHideScript,
} from "./insertHtmlSnippets.ts";


// Check if current folder is a github repo
const isGitRepo = await Bun.file(".git/HEAD").exists();
if (!isGitRepo) {
  process.stdout.write(
    "Git repository not found. The recommended flow is to create a repository connected to your deployment. Unwebflow will pull changes from your free Webflow site and push them to your repo. Press or Ctrl+C to exit (and create/move into a repository) or press anything else to run without a repository." +
      "\n"
  );
}

let baseUrl: string | undefined = undefined;
const args = Bun.argv;
for (const arg of args) {
  if (arg.includes("webflow.io")) {
    baseUrl = arg;
    break;
  }
}

if (!baseUrl) {
  const prompt =
    "What's the URL for your free Webflow site? (e.g. https://something.webflow.io)\n";
  process.stdout.write(prompt);

  for await (const line of console) {
    try {
      const response = await fetch(line);
      if (!response.ok) {
        process.stdout.write(
          `${line} seems like an invalid URL. Please try again. Make sure it uses https://.\n`
        );
      } else {
        baseUrl = line.trim();
        const html = await response.text();
        if (!html.includes(`<meta content="Webflow"`)) {
          process.stdout.write(
            `${line} doesn't seem to be a Webflow site, please try another URL:\n`
          );
          continue;
        }
        process.stdout.write(`Processing ${line}\n`);
        break;
      }
    } catch (error) {
      process.stdout.write(
        `${line} seems like an invalid URL. Please try again. Make sure it uses https://.\n`
      );
    }
  }
}

const subpageUrls: string[] = await getAllSubpages(baseUrl);
console.log(`Found ${subpageUrls.length} subpages`);

const saveSubpage = async (url: string, html: string) => {
  const prettierHtml = await prettier.format(html, { parser: "html" });
  const fileName: string =
    url === baseUrl ? "index.html" : url.replace(baseUrl!, "").concat(".html");
  await Bun.write(fileName, prettierHtml);
};

// TODO: This is tested as proof of concept, but needs extra work to be functional when ran from standalone binary
// More specifically, documented first and then included in script flow.
// It could potentially work as follows:
// - Special name for "data-custom-code-id" attribute is already hardcoded
// - Assume the name of the html files equals to the value of the data-custom-code-id attribute
// - Run for the entire folder of html-snippets
const insertCustomHtmlSnippet = async (html: string) => {
  const customHtmlSnippetPath = path.join(destinationDir, "html-snippets/test-custom-code.html");
  const htmlWithCustomHtmlSnippet = await insertHtmlFromFile(
    html,
    "replacingAnotherElement",
    customHtmlSnippetPath,
    "test-custom-code"
  );
  return htmlWithCustomHtmlSnippet;
};

// Download and process subpages
for (const url of subpageUrls) {
  const response = await fetch(url);
  let html: string = await response.text();
  html = await insertBadgeHideScript(html);
  // html = await insertCustomHtmlSnippet(html);
  saveSubpage(url, html);
}

// Perform the automatic deployment
console.log("Pushing to GitHub...");
const command =
  "git add .; git commit -m 'Automatic deployment'; git push --set-upstream origin main";
const res = await Bun.spawn(["/bin/sh", "-c", command]);

console.log("Done! Check your deployment to see the changes.");
