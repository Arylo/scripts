// ==UserScript==
// @name Add Font Family for Gitlab
// @version 1.2
// @author Arylo Yeung <arylo.open@gmail.com>
// @include /^https://git\b.[^/]+/.*/-/raw/.*/
// @include /^https://git\b.[^/]+/.*/-/blob/.*/
// @include /^https://git\b.[^/]+/.*/-/commit/.*/
// @include /^https://git\b.[^/]+/.*/-/merge_requests/(\d+|new)\b/
// @include /^https://git\b.[^/]+/.*/-/merge_requests/(\d+|new)/diffs\b/
// @downloadURL https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-font-family.user.js
// @updateURL https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-font-family.meta.js
// @run-at document-end
// @grant none
// ==/UserScript==
"use strict";
(() => {
  // src/monkey/gitlab-font-family.css
  var gitlab_font_family_default = 'code {\n  font-family: "Fira Code", "Smiley Sans", "Courier New", "Consolas", monospace;\n}\n\n.blob-content.file-content.code pre code {\n  font-family: "Fira Code", "Smiley Sans", "Courier New", "Consolas", monospace;\n}\n\ntable.code tr.line_holder td.line_content {\n  font-family: "Fira Code", "Smiley Sans", "Courier New", "Consolas", monospace;\n}\n\n.diff-grid-row {\n  font-family: "Fira Code", "Smiley Sans", "Courier New", "Consolas", monospace;\n}\n';

  // src/monkey/utils/appendStyleElement.ts
  var appendStyleElement = (cssContent, id) => {
    const elem = document.createElement("style");
    id && (elem.id = id);
    elem.innerText = cssContent.replace(/\n/g, "");
    document.body.append(elem);
  };

  // src/monkey/gitlab-font-family.ts
  setTimeout(() => appendStyleElement(gitlab_font_family_default, "append-font"), 25);
})();
