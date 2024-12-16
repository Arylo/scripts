// ==UserScript==
// @name Enhance some features of the Self-managed Gitlab
// @name:zh-CN 强化自托管 Gitlab 能力
// @description Enhance some features of the Self-managed Gitlab, such as the CI/CD settings page, the merge request create/edit page etc.
// @description:zh-CN 强化自托管 Gitlab 的一些功能，如 CI/CD 设置页面、合并请求创建/编辑页面等。
// @icon data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iNTEycHgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJfeDMxXzQ0LWdpdGxhYiI+PGc+PGcgaWQ9IlhNTElEXzZfIj48Zz48Zz48cGF0aCBkPSJNNTIuNzUyLDIwNS41MDFsMjAzLjE4LDI2NC4wN2wtMjIyLjctMTY1LjI5Yy02LjExLTQuNTktOC43Mi0xMi41OC02LjM4LTE5Ljc3MWwyNS44Ny03OS4wNSAgICAgICBMNTIuNzUyLDIwNS41MDF6IiBzdHlsZT0iZmlsbDojRkNBMzI2OyIvPjwvZz48Zz48cG9seWdvbiBwb2ludHM9IjE3MS4zMDIsMjA1LjQ2MSAyNTYuMDEyLDQ2OS41NDEgMjU1LjkzMiw0NjkuNTcxIDUyLjc1MiwyMDUuNTAxIDUyLjgxMiwyMDUuNDYxICAgICAgICAgICAgICIgc3R5bGU9ImZpbGw6I0ZDNkQyNjsiLz48L2c+PGc+PHBvbHlnb24gcG9pbnRzPSIzNDAuNzMxLDIwNS40NjEgMjU2LjAyMSw0NjkuNTcxIDI1Ni4wMTIsNDY5LjU0MSAxNzEuMzAyLDIwNS40NjEgMTcxLjM5MiwyMDUuNDYxICAgICAgICAzNDAuNjQyLDIwNS40NjEgICAgICAiIHN0eWxlPSJmaWxsOiNFMjQzMjk7Ii8+PC9nPjxnPjxwb2x5Z29uIHBvaW50cz0iNDU5LjI5MiwyMDUuNTAxIDI1Ni4wMjEsNDY5LjU3MSAzNDAuNzMxLDIwNS40NjEgNDU5LjIzMSwyMDUuNDYxICAgICAgIiBzdHlsZT0iZmlsbDojRkM2RDI2OyIvPjwvZz48Zz48cGF0aCBkPSJNNDg1LjE5MSwyODQuNTExYzIuMjQsNy4xOS0wLjI3LDE1LjE4MS02LjQ3LDE5Ljc3MWwtMjIyLjcsMTY1LjI5bDIwMy4yNzEtMjY0LjA3bDAuMDI5LTAuMDQgICAgICAgTDQ4NS4xOTEsMjg0LjUxMXoiIHN0eWxlPSJmaWxsOiNGQ0EzMjY7Ii8+PC9nPjxnPjxwYXRoIGQ9Ik00MDguNDcyLDQ4LjQyMWw1MC43NiwxNTcuMDRoLTExOC41aC0wLjA5bDUwLjg1LTE1Ny4wNCAgICAgICBDMzk0LjM2MSw0MC40MzEsNDA1LjY4Miw0MC40MzEsNDA4LjQ3Miw0OC40MjF6IiBzdHlsZT0iZmlsbDojRTI0MzI5OyIvPjwvZz48Zz48cGF0aCBkPSJNMTcxLjM5MiwyMDUuNDYxaC0wLjA5SDUyLjgxMmw1MC43Ni0xNTcuMDRjMi44Ny03Ljk5LDE0LjE5LTcuOTksMTYuOTgsMCAgICAgICBDMTIwLjU1Miw0OC40MjEsMTcxLjMwMiwyMDUuNDYxLDE3MS4zOTIsMjA1LjQ2MXoiIHN0eWxlPSJmaWxsOiNFMjQzMjk7Ii8+PC9nPjwvZz48L2c+PC9nPjwvZz48ZyBpZD0iTGF5ZXJfMSIvPjwvc3ZnPg==
// @version 8
// @author Arylo
// @include /^https:\/\/(git(lab)?|code)\.[^/]+\/.*\/-\/settings\/ci_cd$/
// @include /^https:\/\/(git(lab)?|code)\.[^/]+\/.*\/-\/merge_requests\/new\b/
// @include /^https:\/\/(git(lab)?|code)\.[^/]+\/.*\/-\/merge_requests\/\d+/edit\b/
// @include /^https:\/\/(git(lab)?|code)\.[^/]+\/dashboard\/merge_requests\b/
// @license MIT
// @homepage https://github.com/Arylo/scripts#readme
// @supportURL https://github.com/Arylo/scripts/issues
// @downloadURL https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-enhance.user.js
// @updateURL https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-enhance.meta.js
// @run-at document-end
// @grant GM_addStyle
// @grant GM_setClipboard
// ==/UserScript==