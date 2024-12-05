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
"use strict";
(() => {
  // src/monkey/polyfill/GM.ts
  var thisGlobal = window;
  if (typeof thisGlobal.GM === "undefined") {
    thisGlobal.GM = {};
  }
  function getGMWindow() {
    return thisGlobal;
  }

  // src/monkey/polyfill/GM_addStyle.ts
  var w = getGMWindow();
  if (typeof w.GM_addStyle === "undefined") {
    w.GM_addStyle = function GM_addStyle2(cssContent) {
      const head = document.getElementsByTagName("head")[0];
      if (head) {
        const styleElement = document.createElement("style");
        styleElement.setAttribute("type", "text/css");
        styleElement.textContent = cssContent;
        head.appendChild(styleElement);
        return styleElement;
      }
      return null;
    };
  }
  if (typeof w.GM.addStyle === "undefined") {
    w.GM.addStyle = GM_addStyle;
  }

  // src/monkey/set-fira-code-development-websites/styles/template.css
  var template_default = "*{font-family:Fira Code,monospace!important;font-variant-ligatures:contextual}\n";

  // src/monkey/set-fira-code-development-websites/index.ts
  var specialParentSelectors = [
    ":not(li) > a",
    ":not(h1):not(h2):not(h3):not(h4):not(h5) >"
  ];
  function parseFontString(selector = "code, code *, pre:not(:has(code))") {
    const selectors = selector.split(",").reduce((list, s) => {
      for (const ps of specialParentSelectors) {
        list.push(`${ps} ${s}`);
      }
      return list;
    }, []);
    return template_default.replace(/\*/g, selectors.join(", "));
  }
  setTimeout(() => {
    const fontCssContent = GM_getResourceText("font_css").replace(/(\burl\(["'])/g, "$1https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/");
    GM_addStyle(fontCssContent);
    let selector = void 0;
    switch (location.host) {
    }
    GM_addStyle(parseFontString(selector));
  }, 25);
})();
