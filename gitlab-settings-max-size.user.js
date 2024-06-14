// ==UserScript==
// @name Max Size CI/CD Setting Page for Gitlab
// @version 0.1.0
// @author Arylo Yeung <arylo.open@gmail.com>
// @include /^https://git.[^/]+/.*/-/settings/ci_cd$/
// @downloadURL https://raw.githubusercontent.com/Arylo/scripts//monkey/gitlab-settings-max-size.user.js
// @updateURL https://raw.githubusercontent.com/Arylo/scripts//monkey/gitlab-settings-max-size.meta.js
// @run-at document-end
// @grant none
// ==/UserScript==
"use strict";
(() => {
  // src/monkey/gitlab-settings-max-size.ts
  var elem = document.createElement("style");
  elem.id = "max-size";
  var containerStyle = "{ max-width: 100%; }";
  var styles = [
    `.content-wrapper nav ${containerStyle}`,
    `.content-wrapper .container-fluid ${containerStyle}`,
    `.ci-variable-table table colgroup col:nth-child(3) { width: 100px; }`,
    `.ci-variable-table table colgroup col:nth-child(4) { width: 200px; }`,
    `.ci-variable-table table colgroup col:nth-child(5) { width: 50px; }`
  ];
  styles.forEach((style) => elem.append(style));
  setTimeout(() => {
    document.head.append(elem);
  }, 25);
})();
