// ==UserScript==
// @name Max Size CI/CD Setting Page for the Self-managed Gitlab
// @name:zh 自托管 Gitlab CI/CD 设置页面最大化尺寸
// @version 5
// @author Arylo Yeung <arylo.open@gmail.com>
// @include /^https://git\b.[^/]+/.*/-/settings/ci_cd$/
// @license MIT
// @homepage https://github.com/Arylo/scripts#readme
// @supportURL https://github.com/Arylo/scripts/issues
// @downloadURL https://raw.githubusercontent.com/Arylo/scripts/monkey/index.ts.user.js
// @updateURL https://raw.githubusercontent.com/Arylo/scripts/monkey/index.ts.meta.js
// @run-at document-end
// @grant GM_addStyle
// ==/UserScript==
"use strict";
(() => {
  // src/monkey/polyfill/GM_addStyle.ts
  if (typeof window.GM_addStyle == "undefined") {
    window.GM_addStyle = (cssContent) => {
      let head = document.getElementsByTagName("head")[0];
      if (head) {
        let style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.textContent = cssContent;
        head.appendChild(style);
        return style;
      }
      return null;
    };
  }

  // src/monkey/gitlab-settings-max-size/style.css
  var style_default = ".content-wrapper nav{max-width:100%}.content-wrapper .container-fluid{max-width:100%}.ci-variable-table table colgroup col:nth-child(3){width:100px}.ci-variable-table table colgroup col:nth-child(4){width:200px}.ci-variable-table table colgroup col:nth-child(5){width:50px}\n";

  // src/monkey/gitlab-settings-max-size/index.ts
  setTimeout(() => GM_addStyle(style_default), 25);
})();
