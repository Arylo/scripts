// ==UserScript==
// @name Set Fira Code as font in development websites
// @name:zh 将Fira Code 作为开发用网站的代码字体
// @description Unified use of `Fira Code` as the code font to enhance developers' awareness of the code on the page
// @description:zh 统一将`Fira Code`作为代码字体, 提高开发者对页面中的代码的感知度
// @version 1
// @author Arylo Yeung <arylo.open@gmail.com>
// @include https://jestjs.io/*
// @include https://lodash.com/*
// @include https://www.tampermonkey.net/*
// @include https://*.github.io/*
// @include https://docs.gitlab.com/*
// @include https://npmjs.com/*
// @include https://nodejs.org/docs/*
// @include https://vuejs.org/api/*
// @include https://greasyfork.org/*/code
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