"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollToLimit = exports.scrollTo = exports.clickAllElements = exports.getTmpFilePath = void 0;
const os = require("os");
const path = require("path");
const crypto = require("crypto");
/**
 * 一時ファイルのpathを得る処理
 * @param {string} url
 * @param {string} xpath
 * @param {number} idx
 * @returns {string}
 */
const getTmpFilePath = (url, xpath, idx = 0) => {
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
exports.getTmpFilePath = getTmpFilePath;
/**
 * PuppeteerのElementHandleの配列を渡すと、
 * すべてクリックする処理
 * @param {ElementHandle[]} elements PuppeteerのElementHandleの配列
 * @param {number} idx 0
 * @returns {Promise}
 */
const clickAllElements = (elements, idx = 0) => __awaiter(void 0, void 0, void 0, function* () {
    console.debug("clickAllElements: " + idx);
    const promise = new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        const e = elements[idx];
        idx += 1;
        yield e.click();
        resolve();
    }));
    if (idx < elements.length) {
        yield (0, exports.clickAllElements)(elements, idx);
    }
    else {
        return promise;
    }
});
exports.clickAllElements = clickAllElements;
/**
 * 任意の位置までスクロールする処理
 * @param {Page} page PuppeteerのPage
 * @param {number} scrollY スクロールしたいY座標
 * @returns {Promise}
 */
const scrollTo = (page, scrollY) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.evaluate((scrollY) => __awaiter(void 0, void 0, void 0, function* () {
        window.scrollTo(0, scrollY);
    }), scrollY);
});
exports.scrollTo = scrollTo;
/**
 * 限界までスクロールする処理
 * @param {Page} page PuppeteerのPage
 * @returns {Promise}
 */
const scrollToLimit = (page) => __awaiter(void 0, void 0, void 0, function* () {
    let scrollHeight = yield page.evaluate("document.body.scrollHeight");
    let scrollBottom = yield page.evaluate("window.scrollY+window.innerHeight");
    const promise = new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        yield page.evaluate("window.scrollBy(0, 500)");
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            scrollHeight = yield page.evaluate("document.body.scrollHeight");
            scrollBottom = yield page.evaluate("window.scrollY+window.innerHeight");
            resolve();
        }), 500);
    }));
    if (scrollBottom < scrollHeight) {
        // 再帰
        yield (0, exports.scrollToLimit)(page);
    }
    else {
        return promise;
    }
});
exports.scrollToLimit = scrollToLimit;
