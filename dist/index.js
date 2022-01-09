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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ppptr = void 0;
const fs_1 = require("fs");
const puppeteer = require("puppeteer");
const utils_1 = require("./utils");
const resolutionList = {
    SD: { width: 720, height: 480 },
    HD: { width: 1280, height: 720 },
    FHD: { width: 1920, height: 1080 },
    "2K": { width: 2560, height: 1440 },
    "4K": { width: 4096, height: 2160 },
};
const ppptr = (url, { resolution, width, height, cookieFilePath, clickAllXPath, targetXPath, scrollY, }) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    if (process.env.NODE_ENV !== "development") {
        console.debug = (args) => { };
    }
    console.debug("capture start: " + url);
    try {
        const browser = yield puppeteer.launch();
        const page = yield browser.newPage();
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
            let cookieJSON = yield fs_1.promises.readFile(cookieFilePath, "utf-8");
            let cookie = JSON.parse(cookieJSON);
            page.setCookie(...cookie);
        }
        yield page.goto(url, { waitUntil: ["load", "networkidle2"], timeout: 0 });
        // click by xpath
        if (clickAllXPath) {
            try {
                console.debug("click by xpath: " + clickAllXPath);
                yield page.waitForXPath(clickAllXPath, { timeout: 5000 });
                const clickElements = yield page.$x(clickAllXPath);
                yield (0, utils_1.clickAllElements)(clickElements);
            }
            catch (_b) { }
        }
        // scroll to scrollY
        if (scrollY !== undefined) {
            console.debug("scroll: " + scrollY);
            if (scrollY === 0) {
                yield (0, utils_1.scrollToLimit)(page);
            }
            else {
                yield (0, utils_1.scrollTo)(page, scrollY);
            }
        }
        let results = [];
        if (targetXPath) {
            // screenshot by xpath
            try {
                console.debug("screenshot by xpath: " + targetXPath);
                yield page.waitForXPath(targetXPath, { timeout: 5000 });
                const elements = yield page.$x(targetXPath);
                // screenshot all matched elements
                let idx = 0;
                try {
                    for (var elements_1 = __asyncValues(elements), elements_1_1; elements_1_1 = yield elements_1.next(), !elements_1_1.done;) {
                        const e = elements_1_1.value;
                        const filepath = (0, utils_1.getTmpFilePath)(url, targetXPath, idx);
                        yield e.screenshot({ path: filepath });
                        results.push(filepath);
                        idx++;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (elements_1_1 && !elements_1_1.done && (_a = elements_1.return)) yield _a.call(elements_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (err) {
                console.error("Element not found by xpath: " + targetXPath);
                console.error(err);
                process.exit(1);
            }
        }
        else {
            // screenshot page
            console.debug("screenshot page");
            const filepath = (0, utils_1.getTmpFilePath)(url);
            yield page.screenshot({ path: filepath });
            results.push(filepath);
        }
        yield browser.close();
        return results;
    }
    catch (err) {
        console.error(err);
        return undefined;
    }
});
exports.ppptr = ppptr;
