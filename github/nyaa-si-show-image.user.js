// ==UserScript==
// @name Display image right now in nyaa.si
// @name:zh-CN 在nyaa.si 上立即显示图片
// @version 8
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
  function fallback(elem, imgUrl) {
    setTimeout(function() {
      elem.attr("src", imgUrl + (imgUrl.indexOf("?") === -1 ? "?" : "&") + "refresh=" + Date.now());
    }, Number(Math.random() * 2e3));
  }
  function newProcess(elem, imgUrl, linkUrl) {
    const linkList = linkUrl.split("/");
    const imgList = imgUrl.split("/");
    if (/^(\w+\.){2,}\w{2,}$/.test(imgList[3]) && imgList[4] === "th") {
      const [last] = imgList[imgList.length - 1].split("?");
      imgList.splice(imgList.length - 1, 1, ...[last, linkList[linkList.length - 1]]);
      imgList[4] = "i";
      imgList.splice(2, 1);
      const newImgUrl = imgList.join("/");
      elem.attr("src", newImgUrl);
      elem.on("error", function() {
        fallback(elem, newImgUrl);
      });
    }
  }
  function oldProcess(elem, imgUrl, linkUrl) {
    if (!imgUrl.includes("//th")) return newProcess(elem, imgUrl, linkUrl);
    let newImgUrl = imgUrl.replace("//th", "/i");
    const list = linkUrl.split("/");
    newImgUrl += "/";
    newImgUrl += list[list.length - 1];
    elem.attr("src", newImgUrl);
    elem.on("error", function() {
      newProcess(elem, imgUrl, linkUrl);
    });
  }
  function handleUserJavsubs91() {
    const markdownElement = $("div[markdown-text]");
    if (markdownElement.length) {
      const markdownMatches = markdownElement[0].innerText.match(/\[!\[.+\]\((.+)\)\]\((.+)\)/);
      if (markdownMatches) {
        const imageUrl = markdownMatches[1];
        const targetUrl = markdownMatches[2];
        markdownElement[0].innerHTML = `<a href="${targetUrl}"><img src="${imageUrl}"></a>`;
      }
    }
    const imageElements = $("a > img");
    if (imageElements.length) {
      let imageSrc = imageElements.attr("src");
      if (!imageSrc) return;
      const parentLinkUrl = imageElements.parent().attr("href");
      if (!parentLinkUrl) return;
      oldProcess(imageElements, imageSrc, parentLinkUrl);
    }
  }
  setTimeout(() => {
    const userLinks = $('.col-md-5 a[title="User"]');
    if (userLinks.length && userLinks.text() === "javsubs91") {
      handleUserJavsubs91();
    }
  }, 50);
})();
