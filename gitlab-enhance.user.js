// ==UserScript==
// @name Enhance some features of the Self-managed Gitlab
// @name:zh 强化自托管 Gitlab 能力
// @version 1
// @author Arylo Yeung <arylo.open@gmail.com>
// @include /^https:\/\/(git(lab)?|code)\.[^/]+\/.*\/-\/settings\/ci_cd$/
// @include /^https:\/\/(git(lab)?|code)\.[^/]+\/dashboard\/merge_requests\b/
// @license MIT
// @homepage https://github.com/Arylo/scripts#readme
// @supportURL https://github.com/Arylo/scripts/issues
// @downloadURL https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-enhance.user.js
// @updateURL https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-enhance.meta.js
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

  // src/monkey/gitlab-enhance/settings/style.css
  var style_default = ".content-wrapper nav{max-width:100%}.content-wrapper .container-fluid{max-width:100%}.ci-variable-table table colgroup col:nth-child(3){width:100px}.ci-variable-table table colgroup col:nth-child(4){width:200px}.ci-variable-table table colgroup col:nth-child(5){width:50px}\n";

  // src/monkey/gitlab-enhance/settings/ci_cd.ts
  if (location.pathname.endsWith("/-/settings/ci_cd")) {
    setTimeout(() => GM_addStyle(style_default), 25);
  }

  // src/monkey/gitlab-enhance/dashboard/merge_requests.ts
  var hyperlinkResource = () => {
    const mergeRequests = $(".merge-request:not([hyperlinked])");
    mergeRequests.each((_, mergeRequestEle) => {
      const href = $(".js-prefetch-document", mergeRequestEle).attr("href");
      if (!href) return;
      const resourceUrl = href.replace(/\/-\/merge_requests\/\d+$/, "");
      const rawRefEle = $(".issuable-reference", mergeRequestEle);
      const rawRefName = rawRefEle.text();
      const [resourceName, number] = rawRefName.split("!");
      rawRefEle.html(`<a href="${resourceUrl}">${resourceName}</a>!${number}`);
      $(mergeRequestEle).attr("hyperlinked", "");
    });
  };
  if (location.pathname.endsWith("/dashboard/merge_requests")) {
    $(".issuable-list").on("mouseenter", hyperlinkResource);
    setTimeout(hyperlinkResource, 1e3);
  }
})();
