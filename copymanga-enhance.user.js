// ==UserScript==
// @name Enhance the copy manga site
// @version 2
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
// @require https://unpkg.com/vue@2.7.14/dist/vue.min.js
// @homepage https://github.com/Arylo/scripts#readme
// @supportURL https://github.com/Arylo/scripts/issues
// @downloadURL https://raw.githubusercontent.com/Arylo/scripts/monkey/copymanga-enhance.user.js
// @updateURL https://raw.githubusercontent.com/Arylo/scripts/monkey/copymanga-enhance.meta.js
// @run-at document-end
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==
"use strict";
(() => {
  // src/monkey/copymanga-enhance.css
  var copymanga_enhance_default = "#app {\n  overflow: hidden;\n  height: 100vh;\n}\n\n#app .header {\n  height: 30px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n#app .header span {\n  color: white;\n}\n\n#app .header .btn {\n  min-width: 80px;\n}\n\n#app .images {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  overflow: auto;\n  height: calc(100vh - 30px);\n}\n\n#app .images div {\n  height: calc(100vh - 30px);\n  min-width: 50%;\n}\n\n#app .images.ttb div {\n  height: auto;\n  width: 90vw;\n}\n";

  // src/monkey/copymanga-enhance.html
  var copymanga_enhance_default2 = `<div id="app">
  <div class="header">
    <a :href="prevUrl" :disable="!prevUrl" class="btn"><span>\u4E0A\u4E00\u8BDD</span></a>
    <span class="title">{{ title }}</span>
    <a :href="nextUrl" :disable="!nextUrl" class="btn"><span>\u4E0B\u4E00\u8BDD</span></a>
    <a @click="() => switchMode('ttb')" class="btn" v-if="mode !== 'ttb'"><span>\u6B63\u5E38\u6A21\u5F0F</span></a>
    <a @click="() => switchMode('ltr')" class="btn" v-else><span>\u6761\u6F2B\u6A21\u5F0F</span></a>
  </div>
  <div class="images" :class="mode">
    <div v-for="(image, index) of images">
      <img :src="image" :index="index" ref="images" @load="() => imageLoaded(index)"/>
    </div>
  </div>
</app>
`;

  // src/monkey/copymanga-enhance.ts
  var comic = window.location.pathname.split("/")[2];
  var getPageInfo = () => {
    const list = [];
    $(".comicContent-list > li > img").each((_, el) => {
      list.push($(el).data("src"));
    });
    const footerElements = $(".footer a");
    return {
      images: list,
      title: $(".header").get(0)?.innerText,
      prevUrl: footerElements.get(1)?.className.includes("prev-null") ? void 0 : footerElements.get(1)?.href,
      nextUrl: footerElements.get(2)?.className.includes("prev-null") ? void 0 : footerElements.get(2)?.href
    };
  };
  var initBodyDom = () => {
    document.body.innerHTML = copymanga_enhance_default2;
    GM_addStyle(copymanga_enhance_default);
  };
  var render = () => {
    const info = getPageInfo();
    console.table(info);
    initBodyDom();
    new Vue({
      el: "#app",
      data: {
        ...info,
        mode: GM_getValue(`${comic}.direction.mode`, "ltr")
      },
      methods: {
        imageLoaded(index) {
        },
        switchMode(mode) {
          const that = this;
          that.mode = mode;
          GM_setValue(`${comic}.direction.mode`, mode);
        }
      }
    });
  };
  var getCurrentCount = () => $(".comicContent-list > li > img").length;
  var getTotalCount = () => Number(document.getElementsByClassName("comicCount")[0].innerText);
  var weScrollTo = (top, isSmooth = false) => window.scrollTo(top, 0, isSmooth);
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
      render();
    });
  }, 25);
})();
