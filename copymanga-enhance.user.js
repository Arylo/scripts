// ==UserScript==
// @name Enhance the copy manga site
// @version 1
// @author Arylo Yeung <arylo.open@gmail.com>
// @license MIT
// @match https://copymanga.com/comic/*/chapter/*
// @match https://copymanga.org/comic/*/chapter/*
// @match https://copymanga.net/comic/*/chapter/*
// @match https://copymanga.info/comic/*/chapter/*
// @match https://copymanga.site/comic/*/chapter/*
// @match https://copymanga.tv/comic/*/chapter/*
// @match https://mangacopy.com/comic/*/chapter/*
// @match https://*.copymanga.com/comic/*/chapter/*
// @match https://*.copymanga.org/comic/*/chapter/*
// @match https://*.copymanga.net/comic/*/chapter/*
// @match https://*.copymanga.info/comic/*/chapter/*
// @match https://*.copymanga.site/comic/*/chapter/*
// @match https://*.copymanga.tv/comic/*/chapter/*
// @match https://*.mangacopy.com/comic/*/chapter/*
// @homepage https://github.com/Arylo/scripts#readme
// @supportURL https://github.com/Arylo/scripts/issues
// @downloadURL https://raw.githubusercontent.com/Arylo/scripts/monkey/copymanga-enhance.user.js
// @updateURL https://raw.githubusercontent.com/Arylo/scripts/monkey/copymanga-enhance.meta.js
// @run-at document-end
// @grant none
// ==/UserScript==
"use strict";
(() => {
  // src/monkey/copymanga-enhance.ts
  var getCurrentCount = () => $(".comicContent-list > li > img").length;
  var getTotalCount = () => Number(document.getElementsByClassName("comicCount")[0].innerText);
  var weScrollTo = (top, isSmooth = false) => window.scrollTo({
    top,
    left: 0,
    behavior: isSmooth ? "smooth" : "instant"
  });
  var refreshImage = (cb) => {
    const nextTime = 10;
    let [cur, total] = [getCurrentCount(), getTotalCount()];
    console.log("Process:", getCurrentCount(), "/", getTotalCount());
    if (total === 0 || cur < total) {
      weScrollTo(document.getElementsByClassName("comicContent")[0].clientHeight, true);
      cur = getCurrentCount();
      setTimeout(() => refreshImage(cb), nextTime);
      setTimeout(() => weScrollTo(0), nextTime / 2);
      return;
    }
    cb();
  };
  setTimeout(() => {
    refreshImage(() => {
      weScrollTo(0);
      $(".comicContent-list > li > img").each((_, el) => {
        $(el).attr("src", $(el).data("src"));
      });
    });
  }, 25);
})();
