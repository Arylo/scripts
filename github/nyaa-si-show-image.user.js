// ==UserScript==
// @name Display image right now in nyaa.si
// @name:zh-CN 在nyaa.si 上立即显示图片
// @version 7
// @author Arylo Yeung <arylo.open@gmail.com>
// @license MIT
// @match https://sukebei.nyaa.si/view/*
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @homepage https://github.com/Arylo/scripts#readme
// @supportURL https://github.com/Arylo/scripts/issues
// @downloadURL https://raw.githubusercontent.com/Arylo/scripts/monkey/nyaa-si-show-image.user.js
// @updateURL https://raw.githubusercontent.com/Arylo/scripts/monkey/nyaa-si-show-image.meta.js
// @run-at document-end
// @grant none
// ==/UserScript==
"use strict";
(() => {
  // src/monkey/nyaa-si-show-image/index.ts
  setTimeout(() => {
    const elems = $('.col-md-5 a[title="User"]');
    if (elems.length && elems.text() === "javsubs91") {
      const pendMKElem = $("div[markdown-text]");
      if (pendMKElem.length) {
        const matches = pendMKElem[0].innerText.match(/\[!\[.+\]\((.+)\)\]\((.+)\)/);
        if (matches) {
          pendMKElem[0].innerHTML = `<a href="${matches[2]}"><img src="${matches[1]}"></a>`;
        }
      }
      const elems2 = $("a > img");
      if (elems2.length) {
        let imgUrl = elems2.attr("src");
        if (!imgUrl) return;
        const linkUrl = elems2.parent().attr("href");
        if (!linkUrl) return;
        imgUrl = imgUrl.replace("//th", "/i");
        const list = linkUrl.split("/");
        imgUrl += "/";
        imgUrl += list[list.length - 1];
        elems2.attr("src", imgUrl);
        elems2.on("error", function() {
          setTimeout(function() {
            elems2.attr("src", imgUrl + (imgUrl.indexOf("?") === -1 ? "?" : "&") + "refresh=" + Date.now());
          }, Number(Math.random() * 2e3));
        });
      }
    }
  }, 50);
})();
