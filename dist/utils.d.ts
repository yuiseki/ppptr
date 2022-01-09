import { ElementHandle, Page } from "puppeteer";
/**
 * 一時ファイルのpathを得る処理
 * @param {string} url
 * @param {string} xpath
 * @param {number} idx
 * @returns {string}
 */
export declare const getTmpFilePath: (url: string, xpath?: string | undefined, idx?: number) => any;
/**
 * PuppeteerのElementHandleの配列を渡すと、
 * すべてクリックする処理
 * @param {ElementHandle[]} elements PuppeteerのElementHandleの配列
 * @param {number} idx 0
 * @returns {Promise}
 */
export declare const clickAllElements: (elements: ElementHandle[], idx?: number) => Promise<void>;
/**
 * 任意の位置までスクロールする処理
 * @param {Page} page PuppeteerのPage
 * @param {number} scrollY スクロールしたいY座標
 * @returns {Promise}
 */
export declare const scrollTo: (page: Page, scrollY: number) => Promise<void>;
/**
 * 限界までスクロールする処理
 * @param {Page} page PuppeteerのPage
 * @returns {Promise}
 */
export declare const scrollToLimit: (page: Page) => Promise<void>;
