import * as cheerio from "cheerio";
import * as prettier from "prettier";

type HtmlInsertMode = "endOfBody" | "endOfHead" | "replacingAnotherElement";

const insertHtmlSnippet = async (
  htmlToInsertInto: string,
  mode: HtmlInsertMode,
  insertedHtmlPath: string,
  mockElementIdentifier?: string
): Promise<string> => {
  htmlToInsertInto = await prettier.format(htmlToInsertInto, {
    parser: "html",
  }); 
  if (
    mode === "replacingAnotherElement" && !mockElementIdentifier
  ) {
    throw new Error(
      "When replacing existing element, you must provide an identifier of the element that's meant to be replaced"
    );
  }

  if (mode === "replacingAnotherElement") {
    throw new Error("TODO");
  }

  const insertedHtml = await Bun.file(insertedHtmlPath).text();

  const $ = cheerio.load(htmlToInsertInto);
  if (mode === "endOfBody") {
    $("body").append(insertedHtml);
  } else if (mode === "endOfHead") {
    $("head").append(insertedHtml);
  }

  return $.html();
};

export default insertHtmlSnippet;