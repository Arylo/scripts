// ==UserScript==
// @name Max Size CI/CD Setting Page for the Self-managed Gitlab
// @name:zh-CN 自托管 Gitlab CI/CD 设置页面最大化尺寸
// @description (Deprecated)(Please use the gitlab-enhance script) Maximize the size of the CI/CD setting
// @description:zh-CN (已废弃)(请使用 gitlab-enhance 脚本) 最大化 CI/CD 设置页面的尺寸
// @icon data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iNTEycHgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJfeDMxXzQ0LWdpdGxhYiI+PGc+PGcgaWQ9IlhNTElEXzZfIj48Zz48Zz48cGF0aCBkPSJNNTIuNzUyLDIwNS41MDFsMjAzLjE4LDI2NC4wN2wtMjIyLjctMTY1LjI5Yy02LjExLTQuNTktOC43Mi0xMi41OC02LjM4LTE5Ljc3MWwyNS44Ny03OS4wNSAgICAgICBMNTIuNzUyLDIwNS41MDF6IiBzdHlsZT0iZmlsbDojRkNBMzI2OyIvPjwvZz48Zz48cG9seWdvbiBwb2ludHM9IjE3MS4zMDIsMjA1LjQ2MSAyNTYuMDEyLDQ2OS41NDEgMjU1LjkzMiw0NjkuNTcxIDUyLjc1MiwyMDUuNTAxIDUyLjgxMiwyMDUuNDYxICAgICAgICAgICAgICIgc3R5bGU9ImZpbGw6I0ZDNkQyNjsiLz48L2c+PGc+PHBvbHlnb24gcG9pbnRzPSIzNDAuNzMxLDIwNS40NjEgMjU2LjAyMSw0NjkuNTcxIDI1Ni4wMTIsNDY5LjU0MSAxNzEuMzAyLDIwNS40NjEgMTcxLjM5MiwyMDUuNDYxICAgICAgICAzNDAuNjQyLDIwNS40NjEgICAgICAiIHN0eWxlPSJmaWxsOiNFMjQzMjk7Ii8+PC9nPjxnPjxwb2x5Z29uIHBvaW50cz0iNDU5LjI5MiwyMDUuNTAxIDI1Ni4wMjEsNDY5LjU3MSAzNDAuNzMxLDIwNS40NjEgNDU5LjIzMSwyMDUuNDYxICAgICAgIiBzdHlsZT0iZmlsbDojRkM2RDI2OyIvPjwvZz48Zz48cGF0aCBkPSJNNDg1LjE5MSwyODQuNTExYzIuMjQsNy4xOS0wLjI3LDE1LjE4MS02LjQ3LDE5Ljc3MWwtMjIyLjcsMTY1LjI5bDIwMy4yNzEtMjY0LjA3bDAuMDI5LTAuMDQgICAgICAgTDQ4NS4xOTEsMjg0LjUxMXoiIHN0eWxlPSJmaWxsOiNGQ0EzMjY7Ii8+PC9nPjxnPjxwYXRoIGQ9Ik00MDguNDcyLDQ4LjQyMWw1MC43NiwxNTcuMDRoLTExOC41aC0wLjA5bDUwLjg1LTE1Ny4wNCAgICAgICBDMzk0LjM2MSw0MC40MzEsNDA1LjY4Miw0MC40MzEsNDA4LjQ3Miw0OC40MjF6IiBzdHlsZT0iZmlsbDojRTI0MzI5OyIvPjwvZz48Zz48cGF0aCBkPSJNMTcxLjM5MiwyMDUuNDYxaC0wLjA5SDUyLjgxMmw1MC43Ni0xNTcuMDRjMi44Ny03Ljk5LDE0LjE5LTcuOTksMTYuOTgsMCAgICAgICBDMTIwLjU1Miw0OC40MjEsMTcxLjMwMiwyMDUuNDYxLDE3MS4zOTIsMjA1LjQ2MXoiIHN0eWxlPSJmaWxsOiNFMjQzMjk7Ii8+PC9nPjwvZz48L2c+PC9nPjwvZz48ZyBpZD0iTGF5ZXJfMSIvPjwvc3ZnPg==
// @version 12
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

  // src/monkey/gitlab-enhance/settings/ci_cd.css
  var ci_cd_default = ".content-wrapper nav{max-width:100%}.content-wrapper .container-fluid{max-width:100%}.ci-variable-table table colgroup col:nth-child(3){width:100px}.ci-variable-table table colgroup col:nth-child(4){width:200px}.ci-variable-table table colgroup col:nth-child(5){width:50px}\n";

  // src/monkey/gitlab-enhance/settings/ci_cd.ts
  if (location.pathname.endsWith("/-/settings/ci_cd")) {
    setTimeout(() => GM_addStyle(ci_cd_default), 25);
  }
})();
