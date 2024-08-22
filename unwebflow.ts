import { mkdir } from "node:fs/promises";
import * as prettier from "prettier";
import * as path from "path";
import getAllSubpages from "./getAllSubpages.js";
import {
  insertHtmlFromFile,
  insertBadgeHideScript,
} from "./insertHtmlSnippets.ts";

// Check if current folder is a github repo
const isGitRepo = await Bun.file(".git/HEAD").exists();
if (!isGitRepo) {
  console.log(
`Git repository not found. The recommended flow is to create a repository and connect it to your deployment.
Unwebflow will fetch changes from your free Webflow site and push them to your repo.

Press Enter to continue without a repository, or Ctrl+C to exit (and create/move into a repository).`
  );
  for await (const _ of console) {
    break;
  }
  console.log("Continuing without a repository...");
} else {
  console.log("Git repository found, continuing...");
}

let baseUrl: string | undefined = undefined;
let shouldDeploy = false;

const args = Bun.argv;
for (const arg of args) {
  if (arg.includes("webflow.io")) {
    baseUrl = arg;
  }
  if (arg === "--deploy" || arg === "-d") {
    shouldDeploy = true;
  }
}

const printInvalidUrlMessage = (line: string) => {
  if (!line.includes('.')) {
    process.stdout.write(
      `Please provide a URL.\n`
    );
  } else {
    process.stdout.write(
      `${line} seems like an invalid URL. Please try again. Make sure it starts with https:// and ends with .webflow.io\n`
    );
  }
};

if (!baseUrl) {
  const prompt =
    "What's the URL for your free Webflow site? (e.g. https://something.webflow.io)\n";
  process.stdout.write(prompt);

  for await (const line of console) {
    try {
      const response = await fetch(line);
      if (!response.ok) {
        printInvalidUrlMessage(line);
      } else {
        baseUrl = line.trim();
        const html = await response.text();
        if (!baseUrl.includes("webflow.io")) {
          process.stdout.write(
            `${line} doesn't seem to be a Webflow site, please try another URL:\n`
          );
          continue;
        }
        process.stdout.write(`Processing ${line}\n`);
        break;
      }
    } catch (error) {
      printInvalidUrlMessage(line);
    }
  }
}

if (!baseUrl) {
  console.log("No valid URL provided. Exiting.");
  process.exit(1);
}

let destinationPath: string | undefined = undefined;
if (isGitRepo) {
  destinationPath = process.cwd();
} else {
  const siteName = baseUrl.replace("https://", "").split(".webflow.io")[0].replace(/\./g, "-");
  destinationPath = path.join(process.cwd(), siteName);
}

await mkdir(destinationPath, { recursive: true });

const subpageUrls: string[] = await getAllSubpages(baseUrl);

const saveSubpage = async (url: string, html: string) => {
  const prettierHtml = await prettier.format(html, { parser: "html" });
  const fileName: string =
    url === baseUrl ? "index.html" : url.replace(baseUrl!, "").concat(".html");
  const filePath = path.join(destinationPath!, fileName);
  await Bun.write(filePath, prettierHtml);
};

if (subpageUrls.length > 0) {
  console.log(`Found ${subpageUrls.length} subpages`);
}

console.log(`Saved to ${destinationPath}`);

// TODO: This is tested as proof of concept, but needs extra work to be functional when ran from standalone binary
// More specifically, documented first and then included in script flow.
// It could potentially work as follows:
// - Special name for "data-custom-code-id" attribute is already hardcoded
// - Assume the name of the html files equals to the value of the data-custom-code-id attribute
// - Run for the entire folder of html-snippets
const insertCustomHtmlSnippet = async (html: string) => {
  const customHtmlSnippetPath = path.join(destinationPath!, "html-snippets/test-custom-code.html");
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

// Perform the automatic deployment if the flag is set
if (shouldDeploy) {
  console.log("Pushing to GitHub...");
  const command =
    `cd ${destinationPath} && git add . && git commit -m 'Automatic deployment' && git push --set-upstream origin main`;
  const res = await Bun.spawn(["/bin/sh", "-c", command]);
  console.log("Done! Check your deployment to see the changes.");
} else {
  console.log(`Latest version saved in ${destinationPath}.\nUse --deploy or -d flag to automatically commit and push to GitHub.`);
}
