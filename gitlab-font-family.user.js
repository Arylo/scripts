// ==UserScript==
// @name Add Font Family for the Self-managed Gitlab
// @name:zh-CN 为自托管 Gitlab 添加字体
// @icon data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iNTEycHgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJfeDMxXzQ0LWdpdGxhYiI+PGc+PGcgaWQ9IlhNTElEXzZfIj48Zz48Zz48cGF0aCBkPSJNNTIuNzUyLDIwNS41MDFsMjAzLjE4LDI2NC4wN2wtMjIyLjctMTY1LjI5Yy02LjExLTQuNTktOC43Mi0xMi41OC02LjM4LTE5Ljc3MWwyNS44Ny03OS4wNSAgICAgICBMNTIuNzUyLDIwNS41MDF6IiBzdHlsZT0iZmlsbDojRkNBMzI2OyIvPjwvZz48Zz48cG9seWdvbiBwb2ludHM9IjE3MS4zMDIsMjA1LjQ2MSAyNTYuMDEyLDQ2OS41NDEgMjU1LjkzMiw0NjkuNTcxIDUyLjc1MiwyMDUuNTAxIDUyLjgxMiwyMDUuNDYxICAgICAgICAgICAgICIgc3R5bGU9ImZpbGw6I0ZDNkQyNjsiLz48L2c+PGc+PHBvbHlnb24gcG9pbnRzPSIzNDAuNzMxLDIwNS40NjEgMjU2LjAyMSw0NjkuNTcxIDI1Ni4wMTIsNDY5LjU0MSAxNzEuMzAyLDIwNS40NjEgMTcxLjM5MiwyMDUuNDYxICAgICAgICAzNDAuNjQyLDIwNS40NjEgICAgICAiIHN0eWxlPSJmaWxsOiNFMjQzMjk7Ii8+PC9nPjxnPjxwb2x5Z29uIHBvaW50cz0iNDU5LjI5MiwyMDUuNTAxIDI1Ni4wMjEsNDY5LjU3MSAzNDAuNzMxLDIwNS40NjEgNDU5LjIzMSwyMDUuNDYxICAgICAgIiBzdHlsZT0iZmlsbDojRkM2RDI2OyIvPjwvZz48Zz48cGF0aCBkPSJNNDg1LjE5MSwyODQuNTExYzIuMjQsNy4xOS0wLjI3LDE1LjE4MS02LjQ3LDE5Ljc3MWwtMjIyLjcsMTY1LjI5bDIwMy4yNzEtMjY0LjA3bDAuMDI5LTAuMDQgICAgICAgTDQ4NS4xOTEsMjg0LjUxMXoiIHN0eWxlPSJmaWxsOiNGQ0EzMjY7Ii8+PC9nPjxnPjxwYXRoIGQ9Ik00MDguNDcyLDQ4LjQyMWw1MC43NiwxNTcuMDRoLTExOC41aC0wLjA5bDUwLjg1LTE1Ny4wNCAgICAgICBDMzk0LjM2MSw0MC40MzEsNDA1LjY4Miw0MC40MzEsNDA4LjQ3Miw0OC40MjF6IiBzdHlsZT0iZmlsbDojRTI0MzI5OyIvPjwvZz48Zz48cGF0aCBkPSJNMTcxLjM5MiwyMDUuNDYxaC0wLjA5SDUyLjgxMmw1MC43Ni0xNTcuMDRjMi44Ny03Ljk5LDE0LjE5LTcuOTksMTYuOTgsMCAgICAgICBDMTIwLjU1Miw0OC40MjEsMTcxLjMwMiwyMDUuNDYxLDE3MS4zOTIsMjA1LjQ2MXoiIHN0eWxlPSJmaWxsOiNFMjQzMjk7Ii8+PC9nPjwvZz48L2c+PC9nPjwvZz48ZyBpZD0iTGF5ZXJfMSIvPjwvc3ZnPg==
// @version 11
// @author Arylo Yeung <arylo.open@gmail.com>
// @include /^https://git(lab)?.[^/]+/.*/-/raw/.*/
// @include /^https://git(lab)?.[^/]+/.*/-/blob/.*/
// @include /^https://git(lab)?.[^/]+/.*/-/commit/.*/
// @include /^https://git(lab)?.[^/]+/.*/-/merge_requests/(\d+|new)\b/
// @include /^https://git(lab)?.[^/]+/.*/-/merge_requests/(\d+|new)/diffs\b/
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
  // src/monkey/polyfill/GM.ts
  if (typeof window.GM === "undefined") {
    window.GM = {
      addStyle: GM_addStyle
    };
  }
  function getGMWindow() {
    return window;
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

  // src/monkey/gitlab-font-family/style.css
  var style_default = "code,.blob-content.file-content.code pre code,table.code tr.line_holder td.line_content,.diff-grid-row{font-family:Fira Code,Smiley Sans,Courier New,Consolas,monospace}\n";

  // src/monkey/gitlab-font-family/index.ts
  setTimeout(() => GM_addStyle(style_default), 25);
})();
