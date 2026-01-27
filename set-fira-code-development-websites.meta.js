// ==UserScript==
// @name Set Fira Code as font in development websites
// @name:zh-CN 将Fira Code 作为开发用网站的代码字体
// @description Unified use of `Fira Code` as the code font to enhance developers' awareness of the code on the page
// @description:zh-CN 统一将`Fira Code`作为代码字体, 提高开发者对页面中的代码的感知度
// @version 10
// @author Arylo Yeung <arylo.open@gmail.com>
// @include https://webpack.js.org/*
// @include https://rollupjs.org/*
// @include https://jestjs.io/*
// @include https://turbo.build/*
// @include https://vite.dev/*
// @include https://vitest.dev/*
// @include https://lodash.com/*
// @include https://docs.taro.zone/*
// @include https://ajv.js.org/*
// @include https://yargs.js.org/*
// @include https://www.tampermonkey.net/*
// @include https://*.github.io/*
// @include https://docs.gitlab.com/*
// @include https://www.w3schools.com/*
// @include https://www.typescriptlang.org/*
// @include https://yarnpkg.com/*
// @include https://pnpm.io/*
// @include https://npmjs.com/*
// @include https://docs.npmjs.com/*
// @include https://nodejs.org/docs/*
// @include https://vuejs.org/api/*
// @include https://vueuse.org/*
// @include https://react.dev/*
// @include https://rxjs.dev/*
// @include https://axios-http.com/*
// @include https://nextjs.org/*
// @include https://docs.nestjs.com/*
// @include https://eslint.org/*
// @include https://mochajs.org/*
// @include https://toml.io/*
// @include https://ls-lint.org/*
// @include https://nodemailer.com/*
// @include https://greasyfork.org/*/code
// @include https://docs.docker.com/*
// @include https://developers.weixin.qq.com/miniprogram/*
// @license MIT
// @resource font_css https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/fira_code.css
// @homepage https://github.com/Arylo/scripts#readme
// @supportURL https://github.com/Arylo/scripts/issues
// @downloadURL https://raw.githubusercontent.com/Arylo/scripts/monkey/set-fira-code-development-websites.user.js
// @updateURL https://raw.githubusercontent.com/Arylo/scripts/monkey/set-fira-code-development-websites.meta.js
// @run-at document-idle
// @grant GM_addStyle
// @grant GM_getResourceText
// ==/UserScript==