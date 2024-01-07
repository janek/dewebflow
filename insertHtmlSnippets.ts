import * as cheerio from "cheerio";
import * as prettier from "prettier";

type HtmlInsertMode =  "replacingAnotherElement" | "endOfBody" | "endOfHead" ;
const mockElementAttributeName = "data-custom-code-id";

export const insertHtmlFromString = async (
  htmlToInsertInto: string,
  mode: HtmlInsertMode,
  insertedHtml: string,
  mockElementIdentifier?: string
): Promise<string> => {
  htmlToInsertInto = await prettier.format(htmlToInsertInto, {
    parser: "html",
  });
  if (mode === "replacingAnotherElement" && !mockElementIdentifier) {
    throw new Error(
      "When replacing existing element, you must provide an identifier of the element that's meant to be replaced"
    );
  }

  const $ = cheerio.load(htmlToInsertInto);
  switch (mode) {
    case "endOfBody":
      $("body").append(insertedHtml);
      break;
    case "endOfHead":
      $("head").append(insertedHtml);
      break;
    case "replacingAnotherElement":
      // The code in webflow needs to have an attribute named "data-custom-code-id" with the value equal to the name of the mockElementIdentifier
      $(`[${mockElementAttributeName}="${mockElementIdentifier}"]`).replaceWith(
        insertedHtml
      );
      break;
  }

  return $.html();
};

export const insertHtmlFromFile = async (
  htmlToInsertInto: string,
  mode: HtmlInsertMode,
  insertedHtmlFilePath: string,
  mockElementIdentifier?: string
): Promise<string> => {
  const insertedHtml = await Bun.file(insertedHtmlFilePath).text();
  return insertHtmlFromString(htmlToInsertInto, mode, insertedHtml, mockElementIdentifier);
};


export const insertBadgeHideScript = async (htmlToinsertInto: string) => {
  const htmlWithBadgeHideScript = await insertHtmlFromString(htmlToinsertInto, "endOfBody", removeBadgeSnippet);
  return htmlWithBadgeHideScript;
} 

const removeBadgeSnippet =
`
<script>
  // Function to be called when mutations are observed
  const callback = function(mutationsList, observer) {
      for(let mutation of mutationsList) {
          if (mutation.type === 'childList') {
              // Check if the added nodes contain the element you're looking for
              mutation.addedNodes.forEach(node => {
                  if(node.classList && node.classList.contains('w-webflow-badge')) {
                      node.remove(); // Remove the element
                  }
              });
          }
      }
  };

  // Create an instance of MutationObserver with the callback function
  const observer = new MutationObserver(callback);

  // Options for the observer (which parts of the DOM to monitor)
  const config = { attributes: false, childList: true, subtree: true };

  // Select the target node (usually the document or a specific part of the page)
  const targetNode = document.body; // Adjust as needed

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  // Optionally, later you can stop observing
  
  // Set a timeout to stop observing after a certain period
  const timeoutPeriod = 5000; // 5000 milliseconds = 5 seconds
  setTimeout(() => {
    observer.disconnect();
  }, timeoutPeriod);
</script>
`;

export default insertHtmlFromFile;