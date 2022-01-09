const os = require("os");
const path = require("path");
const crypto = require("crypto");

import { ElementHandle, Page } from "puppeteer";

/**
 * 一時ファイルのpathを得る処理
 * @param {string} url
 * @param {string} xpath
 * @param {number} idx
 * @returns {string}
 */
export const getTmpFilePath = (
  url: string,
  xpath?: string,
  idx: number = 0
) => {
  const tmpdir = os.tmpdir();

  let filename = url.replace(/[^a-z0-9]/gi, "_");
  if (xpath) {
    filename =
      url.replace(/[^a-z0-9]/gi, "_") +
      xpath.replace(/[^a-z0-9]/gi, "_") +
      "-" +
      idx;
  }
  if (filename.length >= 200) {
    const md5 = crypto.createHash("md5");
    filename = md5.update(filename, "binary").digest("hex");
  }
  filename = filename + ".png";
  const filepath = path.join(tmpdir, filename);
  console.debug("getTmpFilePath: " + filepath);
  return filepath;
};

/**
 * PuppeteerのElementHandleの配列を渡すと、
 * すべてクリックする処理
 * @param {ElementHandle[]} elements PuppeteerのElementHandleの配列
 * @param {number} idx 0
 * @returns {Promise}
 */
export const clickAllElements = async (
  elements: ElementHandle[],
  idx: number = 0
): Promise<void> => {
  console.debug("clickAllElements: " + idx);
  const promise: Promise<void> = new Promise(async (resolve) => {
    const e = elements[idx];
    idx += 1;
    await e.click();
    resolve();
  });
  if (idx < elements.length) {
    await clickAllElements(elements, idx);
  } else {
    return promise;
  }
};

/**
 * 任意の位置までスクロールする処理
 * @param {Page} page PuppeteerのPage
 * @param {number} scrollY スクロールしたいY座標
 * @returns {Promise}
 */
export const scrollTo = async (page: Page, scrollY: number) => {
  await page.evaluate(async (scrollY) => {
    window.scrollTo(0, scrollY);
  }, scrollY);
};

/**
 * 限界までスクロールする処理
 * @param {Page} page PuppeteerのPage
 * @returns {Promise}
 */
export const scrollToLimit = async (page: Page): Promise<void> => {
  let scrollHeight = await page.evaluate("document.body.scrollHeight");
  let scrollBottom = await page.evaluate("window.scrollY+window.innerHeight");

  const promise: Promise<void> = new Promise(async (resolve, reject) => {
    await page.evaluate("window.scrollBy(0, 500)");
    setTimeout(async () => {
      scrollHeight = await page.evaluate("document.body.scrollHeight");
      scrollBottom = await page.evaluate("window.scrollY+window.innerHeight");
      resolve();
    }, 500);
  });

  if (scrollBottom < scrollHeight) {
    // 再帰
    await scrollToLimit(page);
  } else {
    return promise;
  }
};
