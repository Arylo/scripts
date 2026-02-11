// ==UserScript==
// @name Enhance the copy manga site
// @name:en Enhance the copy manga site
// @name:zh 快乐看拷贝
// @name:zh-Hans 快乐看拷贝
// @name:zh-Hant 快樂看拷貝
// @name:zh-CN 快乐看拷贝
// @name:zh-HK 快樂看拷貝
// @name:zh-MO 快樂看拷貝
// @name:zh-TW 快樂看拷貝
// @name:zh-SG 快乐看拷贝
// @name:zh-MY 快乐看拷贝
// @description support ultra-wide screen, adaptive image height, quick page turning, keyboard operation
// @description:en support ultra-wide screen, adaptive image height, quick page turning, keyboard operation
// @description:zh 对开布局、支持带鱼屏、自适应图片高度、快捷翻页、支持键盘操作
// @description:zh-Hans 对开布局、支持带鱼屏、自适应图片高度、快捷翻页、支持键盘操作
// @description:zh-Hant 對開佈局、支持帶魚屏、自適應圖片高度、快捷翻頁、支持鍵盤操作
// @description:zh-CN 对开布局、支持带鱼屏、自适应图片高度、快捷翻页、支持键盘操作
// @description:zh-HK 對開佈局、支持帶魚屏、自適應圖片高度、快捷翻頁、支持鍵盤操作
// @description:zh-MO 對開佈局、支持帶魚屏、自適應圖片高度、快捷翻頁、支持鍵盤操作
// @description:zh-TW 對開佈局、支持帶魚屏、自適應圖片高度、快捷翻頁、支持鍵盤操作
// @description:zh-SG 对开布局、支持带鱼屏、自适应图片高度、快捷翻页、支持键盘操作
// @description:zh-MY 对开布局、支持带鱼屏、自适应图片高度、快捷翻页、支持键盘操作
// @version 42
// @author Arylo Yeung <arylo.open@gmail.com>
// @connect unpkg.com
// @license MIT
// @match https://copymanga.com/comic/*/chapter/*
// @match https://*.copymanga.com/comic/*/chapter/*
// @match https://copymanga.org/comic/*/chapter/*
// @match https://*.copymanga.org/comic/*/chapter/*
// @match https://copymanga.net/comic/*/chapter/*
// @match https://*.copymanga.net/comic/*/chapter/*
// @match https://copymanga.info/comic/*/chapter/*
// @match https://*.copymanga.info/comic/*/chapter/*
// @match https://copymanga.site/comic/*/chapter/*
// @match https://*.copymanga.site/comic/*/chapter/*
// @match https://copymanga.tv/comic/*/chapter/*
// @match https://*.copymanga.tv/comic/*/chapter/*
// @match https://mangacopy.com/comic/*/chapter/*
// @match https://*.mangacopy.com/comic/*/chapter/*
// @match https://copy-manga.com/comic/*/chapter/*
// @match https://*.copy-manga.com/comic/*/chapter/*
// @match https://copy20.com/comic/*/chapter/*
// @match https://*.copy20.com/comic/*/chapter/*
// @match https://copy2000.site/comic/*/chapter/*
// @match https://*.copy2000.site/comic/*/chapter/*
// @match https://2025copy.com/comic/*/chapter/*
// @match https://*.2025copy.com/comic/*/chapter/*
// @match https://2026copy.com/comic/*/chapter/*
// @match https://*.2026copy.com/comic/*/chapter/*
// @require https://unpkg.com/vue@3/dist/vue.global.prod.js
// @resource vue https://unpkg.com/vue@3/dist/vue.global.prod.js
// @homepage https://github.com/Arylo/scripts#readme
// @supportURL https://github.com/Arylo/scripts/issues
// @downloadURL https://raw.githubusercontent.com/Arylo/scripts/monkey/copymanga-enhance.user.js
// @updateURL https://raw.githubusercontent.com/Arylo/scripts/monkey/copymanga-enhance.meta.js
// @run-at document-end
// @grant GM_getResourceText
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==