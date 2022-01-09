import { promises as fs } from "fs";
import { PuppeteerNode } from "puppeteer";
const puppeteer: PuppeteerNode = require("puppeteer");

import {
  clickAllElements,
  scrollTo,
  scrollToLimit,
  getTmpFilePath,
} from "./utils";

export type ResolutionKey = "SD" | "HD" | "FHD" | "2K" | "4K";
type ResolutionValue = {
  width: number;
  height: number;
};
const resolutionList: { [key in ResolutionKey]: ResolutionValue } = {
  SD: { width: 720, height: 480 },
  HD: { width: 1280, height: 720 },
  FHD: { width: 1920, height: 1080 },
  "2K": { width: 2560, height: 1440 },
  "4K": { width: 4096, height: 2160 },
};

export const ppptr = async (
  url: string,
  {
    resolution,
    width,
    height,
    cookieFilePath,
    clickAllXPath,
    targetXPath,
    scrollY,
  }: {
    resolution: ResolutionKey;
    width: number | undefined;
    height: number | undefined;
    cookieFilePath: string | undefined;
    clickAllXPath: string | undefined;
    targetXPath: string | undefined;
    scrollY: number | undefined;
  }
): Promise<string[] | undefined> => {
  if (process.env.NODE_ENV !== "development") {
    console.debug = (args) => {};
  }
  console.debug("capture start: " + url);
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // set browser resolution
    const browserRes = resolutionList[resolution];
    if (width) {
      browserRes.width = width;
    }
    if (height) {
      browserRes.height = height;
    }
    console.debug("resolution: " + JSON.stringify(browserRes));
    page.setViewport(browserRes);

    // load and set cookie
    if (cookieFilePath) {
      let cookieJSON = await fs.readFile(cookieFilePath, "utf-8");
      let cookie = JSON.parse(cookieJSON);
      page.setCookie(...cookie);
    }

    await page.goto(url, { waitUntil: ["load", "networkidle2"], timeout: 0 });

    // click by xpath
    if (clickAllXPath) {
      try {
        console.debug("click by xpath: " + clickAllXPath);
        await page.waitForXPath(clickAllXPath, { timeout: 5000 });
        const clickElements = await page.$x(clickAllXPath);
        await clickAllElements(clickElements);
      } catch {}
    }

    // scroll to scrollY
    if (scrollY !== undefined) {
      console.debug("scroll: " + scrollY);
      if (scrollY === 0) {
        await scrollToLimit(page);
      } else {
        await scrollTo(page, scrollY);
      }
    }

    let results = [];
    if (targetXPath) {
      // screenshot by xpath
      try {
        console.debug("screenshot by xpath: " + targetXPath);
        await page.waitForXPath(targetXPath, { timeout: 5000 });
        const elements = await page.$x(targetXPath);
        // screenshot all matched elements
        let idx = 0;
        for await (const e of elements) {
          const filepath = getTmpFilePath(url, targetXPath, idx);
          await e.screenshot({ path: filepath });
          results.push(filepath);
          idx++;
        }
      } catch (err) {
        console.error("Element not found by xpath: " + targetXPath);
        console.error(err);
        process.exit(1);
      }
    } else {
      // screenshot page
      console.debug("screenshot page");
      const filepath = getTmpFilePath(url);
      await page.screenshot({ path: filepath });
      results.push(filepath);
    }
    await browser.close();
    return results;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};
