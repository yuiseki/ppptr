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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs/yargs"));
const _1 = require(".");
const argv = (0, yargs_1.default)(process.argv.slice(2))
    .option("res", {
    alias: "r",
    description: "Browser Resolution.",
    choices: ["SD", "HD", "FHD", "2K", "4K"],
    default: "HD",
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
    description: "Scroll pages before screenshot. 0 means to scroll the limit of web page.",
    type: "number",
})
    .option("cookieFilePath", {
    description: "cookie file path to set puppeteer.",
    type: "string",
})
    .help()
    .parseSync();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    // check first arg is URL
    const url = argv._[0];
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
    const results = yield (0, _1.ppptr)(url, {
        resolution: argv.res,
        width: argv.width,
        height: argv.height,
        cookieFilePath: argv.cookieFilePath,
        clickAllXPath: argv.clickAllXPath,
        targetXPath: argv.targetXPath,
        scrollY: argv.scrollY,
    });
    if (results) {
        try {
            for (var results_1 = __asyncValues(results), results_1_1; results_1_1 = yield results_1.next(), !results_1_1.done;) {
                const result = results_1_1.value;
                console.log(result);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (results_1_1 && !results_1_1.done && (_a = results_1.return)) yield _a.call(results_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        process.exit(0);
    }
    else {
        process.exit(1);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield main();
    }
    catch (err) {
        console.error(err);
    }
}))();
