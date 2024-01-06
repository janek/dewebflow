import * as cheerio from "cheerio";
import * as prettier from "prettier";

type HtmlInsertMode =  "replacingAnotherElement" | "endOfBody" | "endOfHead" ;
const mockElementAttributeName = "data-custom-code-id";

const insertHtmlSnippet = async (
  htmlToInsertInto: string,
  mode: HtmlInsertMode,
  insertedHtmlPath: string,
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

  const insertedHtml = await Bun.file(insertedHtmlPath).text();

  const $ = cheerio.load(htmlToInsertInto);
  switch (mode) {
    case "endOfBody":
      $("body").append(insertedHtml);
      break;
    case "endOfHead":
      $("head").append(insertedHtml);
      break;
    case "replacingAnotherElement":
      console.log("HEY");
      // The code in webflow needs to have an attribute named "data-custom-code-id" with the value equal to the name of the mockElementIdentifier
      $(`[${mockElementAttributeName}="${mockElementIdentifier}"]`).replaceWith(
        insertedHtml
      );
      break;
  }

  return $.html();
};

export default insertHtmlSnippet;