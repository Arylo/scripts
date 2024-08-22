// ==UserScript==
// @name Add Font Family for the Self-managed Gitlab
// @name:zh 为自托管 Gitlab 添加字体
// @version 5
// @author Arylo Yeung <arylo.open@gmail.com>
// @include /^https://git\b.[^/]+/.*/-/raw/.*/
// @include /^https://git\b.[^/]+/.*/-/blob/.*/
// @include /^https://git\b.[^/]+/.*/-/commit/.*/
// @include /^https://git\b.[^/]+/.*/-/merge_requests/(\d+|new)\b/
// @include /^https://git\b.[^/]+/.*/-/merge_requests/(\d+|new)/diffs\b/
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

  // src/monkey/gitlab-font-family/style.css
  var style_default = "code,.blob-content.file-content.code pre code,table.code tr.line_holder td.line_content,.diff-grid-row{font-family:Fira Code,Smiley Sans,Courier New,Consolas,monospace}\n";

  // src/monkey/gitlab-font-family/index.ts
  setTimeout(() => GM_addStyle(style_default), 25);
})();
