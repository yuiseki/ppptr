# ppptr - Simple CLI tool and npm package just take screenshot of Web page with puppeteer in minutes

## Install

If you want to use ppptr as command, install with `-g` option.

```bash
npm i -g ppptr
```

Or if you want to use ppptr as npm package in your Node.js project, just install.

```bash
npm i ppptr
```

## Basic Usage as command

You can use `ppptr` command if you have install with `-g` option.

The following command:

```bash
ppptr https://www.google.com/ --res SD
```

will output tmp file path of screenshot to stdout:

```bash
/tmp/https___www_google_com_.png
```

### Check out all options

```bash
ppptr --help
```

## Basic Usage as package

```typescript
import { ppptr } from "ppptr";

const results = await ppptr(url);
// results is an array of string of tmp file path of screenshot
console.log(results);
```

## Development

```bash
npm ci
npm run build
npm link
NODE_ENV=development ppptr https://www.google.com/ -r SD
```
