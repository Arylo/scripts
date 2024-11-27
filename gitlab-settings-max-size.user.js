// ==UserScript==
// @name Max Size CI/CD Setting Page for the Self-managed Gitlab
// @name:zh 自托管 Gitlab CI/CD 设置页面最大化尺寸
// @description (Deprecated)(Please use the gitlab-enhance script) Maximize the size of the CI/CD setting
// @description:zh (已废弃)(请使用 gitlab-enhance 脚本) 最大化 CI/CD 设置页面的尺寸
// @version 8
// @author Arylo Yeung <arylo.open@gmail.com>
// @include /^https://git(lab)?.[^/]+/.*/-/settings/ci_cd$/
// @license MIT
// @homepage https://github.com/Arylo/scripts#readme
// @supportURL https://github.com/Arylo/scripts/issues
// @downloadURL https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-settings-max-size.user.js
// @updateURL https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-settings-max-size.meta.js
// @run-at document-end
// @grant GM_addStyle
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

  // src/monkey/gitlab-enhance/settings/ci_cd.css
  var ci_cd_default = ".content-wrapper nav{max-width:100%}.content-wrapper .container-fluid{max-width:100%}.ci-variable-table table colgroup col:nth-child(3){width:100px}.ci-variable-table table colgroup col:nth-child(4){width:200px}.ci-variable-table table colgroup col:nth-child(5){width:50px}\n";

  // src/monkey/gitlab-enhance/settings/ci_cd.ts
  if (location.pathname.endsWith("/-/settings/ci_cd")) {
    setTimeout(() => GM_addStyle(ci_cd_default), 25);
  }
})();
