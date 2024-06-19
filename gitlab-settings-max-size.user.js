// ==UserScript==
// @name Max Size CI/CD Setting Page for Gitlab
// @version 1
// @author Arylo Yeung <arylo.open@gmail.com>
// @include /^https://git\b.[^/]+/.*/-/settings/ci_cd$/
// @downloadURL https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-settings-max-size.user.js
// @updateURL https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-settings-max-size.meta.js
// @run-at document-end
// @grant GM_addStyle
// ==/UserScript==
"use strict";
(() => {
  // src/monkey/gitlab-settings-max-size.css
  var gitlab_settings_max_size_default = ".content-wrapper nav { max-width: 100%; }\n.content-wrapper .container-fluid { max-width: 100%; }\n.ci-variable-table table colgroup col:nth-child(3) { width: 100px; }\n.ci-variable-table table colgroup col:nth-child(4) { width: 200px; }\n.ci-variable-table table colgroup col:nth-child(5) { width: 50px; }\n";

  // src/monkey/gitlab-settings-max-size.ts
  setTimeout(() => GM_addStyle(gitlab_settings_max_size_default), 25);
})();
