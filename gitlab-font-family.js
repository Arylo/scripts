// ==UserScript==
// @name Add Font Family for Gitlab
// @version 0.1.1
// @author Arylo Yeung <arylo.open@gmail.com>
// @include /^https://git.[^/]+/.*/-/blob/.*/
// @include /^https://git.[^/]+/.*/-/commit/.*/
// @include /^https://git.[^/]+/.*/-/merge_requests/\d+\b/
// @include /^https://git.[^/]+/.*/-/merge_requests/\d+/diffs\b/
// @run-at document-end
// @grant none
// @downloadURL https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-font-family.js
// @updateURL https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-font-family.meta.js
// ==/UserScript==
"use strict";
(() => {
  // src/monkey/gitlab-font-family.ts
  var elem = document.createElement("style");
  elem.id = "append-font";
  var fontStyle = '{ font-family: "Fira Code", "Smiley Sans", "Courier New", monospace; }';
  var query = [
    ".blob-content.file-content.code pre code",
    "table.code tr.line_holder td.line_content",
    ".diff-grid-row"
  ];
  query.forEach((q) => elem.append(`${q} ${fontStyle}`));
  document.body.append(elem);
})();
