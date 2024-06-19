// ==UserScript==
// @name Add Font Family for the Self-managed Gitlab
// @name:zh 为自托管 Gitlab 添加字体
// @version 3
// @author Arylo Yeung <arylo.open@gmail.com>
// @include /^https://git\b.[^/]+/.*/-/raw/.*/
// @include /^https://git\b.[^/]+/.*/-/blob/.*/
// @include /^https://git\b.[^/]+/.*/-/commit/.*/
// @include /^https://git\b.[^/]+/.*/-/merge_requests/(\d+|new)\b/
// @include /^https://git\b.[^/]+/.*/-/merge_requests/(\d+|new)/diffs\b/
// @license MIT
// @homepage https://github.com/Arylo/scripts#readme
// @supportURL https://github.com/Arylo/scripts/issues
// @downloadURL https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-font-family.user.js
// @updateURL https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-font-family.meta.js
// @run-at document-end
// @grant GM_addStyle
// ==/UserScript==
"use strict";
(() => {
  // src/monkey/gitlab-font-family.css
  var gitlab_font_family_default = 'code {\n  font-family: "Fira Code", "Smiley Sans", "Courier New", "Consolas", monospace;\n}\n\n.blob-content.file-content.code pre code {\n  font-family: "Fira Code", "Smiley Sans", "Courier New", "Consolas", monospace;\n}\n\ntable.code tr.line_holder td.line_content {\n  font-family: "Fira Code", "Smiley Sans", "Courier New", "Consolas", monospace;\n}\n\n.diff-grid-row {\n  font-family: "Fira Code", "Smiley Sans", "Courier New", "Consolas", monospace;\n}\n';

  // src/monkey/gitlab-font-family.ts
  setTimeout(() => GM_addStyle(gitlab_font_family_default), 25);
})();