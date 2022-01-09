import yargs from "yargs/yargs";
import { ppptr, ResolutionKey } from ".";

const argv = yargs(process.argv)
  .option("res", {
    alias: "r",
    description: "Browser Resolution. [SD, HD, FHD, 2K, 4K]",
    choices: ["SD", "HD", "FHD", "2K", "4K"] as const,
    default: "HD" as ResolutionKey,
  })
  .option("width", {
    alias: "w",
    description: "Browser Width. It override resolution option.",
    type: "number",
  })
  .option("height", {
    alias: "h",
    description: "Browser Height. It override resolution option.",
    type: "number",
  })
  .option("targetXPath", {
    alias: "x",
    description: "XPath for elements to screenshot and upload.",
    type: "string",
  })
  .option("clickAllXPath", {
    alias: "c",
    description: "XPath for elements to click before screenshot",
    type: "string",
  })
  .option("scrollY", {
    alias: "s",
    description:
      "Scroll pages before screenshot. 0 means to scroll the limit of web page.",
    type: "number",
  })
  .option("cookieFilePath", {
    description: "cookie file path to set puppeteer.",
    type: "string",
  })
  .help()
  .parseSync();

const main = async () => {
  // check first arg is URL
  const url = argv._[argv._.length - 1];
  if (!url || url === "") {
    console.info("Usage:");
    console.info("\tgyapp [URL] {options}");
    console.info("\tgyapp --help");
    process.exit(1);
  }
  if (typeof url !== "string" || url.indexOf("http") !== 0) {
    console.error("first arg is not URL!");
    process.exit(1);
  }
  const results = await ppptr(url, {
    resolution: argv.res,
    width: argv.width,
    height: argv.height,
    cookieFilePath: argv.cookieFilePath,
    clickAllXPath: argv.clickAllXPath,
    targetXPath: argv.targetXPath,
    scrollY: argv.scrollY,
  });
  if (results) {
    for await (const result of results) {
      console.log(result);
    }
    process.exit(0);
  } else {
    process.exit(1);
  }
};

(async () => {
  try {
    await main();
  } catch (err) {
    console.error(err);
  }
})();
