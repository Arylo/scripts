// ==UserScript==
// @name Enhance the copy manga site
// @version 3
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
  var copymanga_enhance_default = ":root{---image-max-height: calc(100vh - 30px) }#app{overflow:hidden;height:100vh}#app .header{height:30px;display:flex;justify-content:center;align-items:center}#app .header span{color:#fff}#app .header .btn{min-width:80px}#app .images{display:flex;flex-wrap:wrap;justify-content:center;overflow:auto;height:var(---image-max-height)}#app .images div{height:var(---image-max-height)}#app .images.ttb div{height:auto;width:90vw}\n";

  // src/monkey/copymanga-enhance.html
  var copymanga_enhance_default2 = `<div id="app"> <div class="header"> <a :href="prevUrl" :disable="!prevUrl" class="btn"><span>\u4E0A\u4E00\u8BDD</span></a> <span class="title">{{ title }}</span> <a :href="nextUrl" :disable="!nextUrl" class="btn"><span>\u4E0B\u4E00\u8BDD</span></a> <a @click="() => switchMode(ComicDirection.TTB)" class="btn" v-if="mode !== 'ttb'"><span>\u6B63\u5E38\u6A21\u5F0F</span></a> <a @click="() => switchMode(ComicDirection.LTR)" class="btn" v-else><span>\u6761\u6F2B\u6A21\u5F0F</span></a> </div> <div class="images" :class="mode" @click="onClick"> <div v-for="(image, index) of images"> <img :src="image" :index="index" ref="images" @load="() => imageLoaded(index)"> </div> </div> </div>`;

  // src/monkey/copymanga-enhance/common.ts
  var genScrollTo = (el) => (top, isSmooth = false) => el.scrollTo({
    top,
    left: 0,
    behavior: isSmooth ? "smooth" : "auto"
  });
  var comic = window.location.pathname.split("/")[2];
  var chapter = window.location.pathname.split("/")[4];

  // src/monkey/copymanga-enhance/new.ts
  var ComicDirection = {
    LTR: "ltr",
    TTB: "ttb"
  };
  var render = ({ info, preFn = Function }) => {
    preFn();
    new Vue({
      el: "#app",
      data: {
        ...info,
        mode: GM_getValue(`${comic}.direction.mode`, "ltr")
      },
      computed: {
        headerHeight: () => document.getElementsByClassName("header")[0].clientHeight,
        ComicDirection: () => ComicDirection
      },
      methods: {
        imageLoaded(index) {
        },
        switchMode(mode) {
          const that = this;
          that.mode = mode;
          GM_setValue(`${comic}.direction.mode`, mode);
        },
        onClick(e) {
          const that = this;
          const element = document.body;
          const containerElement = document.getElementsByClassName("images")[0];
          const containerScrollTo = genScrollTo(containerElement);
          if (e.clientY < that.headerHeight) {
            return;
          }
          const actionWidth = element.clientWidth * 0.3;
          let nextAction;
          if (e.clientX < actionWidth) {
            nextAction = "left";
          } else if (e.clientX > element.clientWidth - actionWidth) {
            nextAction = "right";
          } else {
            return;
          }
          if (that.mode === ComicDirection.LTR) {
            const offsetTops = [...document.getElementsByTagName("img")].map((el) => el.offsetTop - that.headerHeight);
            const currentTop = containerElement.scrollTop;
            for (let i = 0; i < offsetTops.length - 1; i++) {
              if (nextAction === "left") {
                if (offsetTops[i] < currentTop && offsetTops[i + 1] >= currentTop) {
                  containerScrollTo(offsetTops[i], true);
                  break;
                }
              }
              if (nextAction === "right") {
                if (offsetTops[i] <= currentTop && offsetTops[i + 1] > currentTop) {
                  containerScrollTo(offsetTops[i + 1]);
                  break;
                }
              }
            }
          } else if (that.mode === ComicDirection.TTB) {
            let nextTop = nextAction === "left" ? containerElement.scrollTop - element.clientHeight : containerElement.scrollTop + element.clientHeight;
            nextTop += that.headerHeight;
            nextTop = Math.max(0, nextTop);
            containerScrollTo(nextTop, true);
          }
        }
      }
    });
  };

  // src/monkey/copymanga-enhance/old.ts
  var getCurrentCount = () => $(".comicContent-list > li > img").length;
  var getTotalCount = () => Number(document.getElementsByClassName("comicCount")[0].innerText);
  var windowScrollTo = genScrollTo(window);
  var refreshImage = (cb) => {
    const nextTime = 15;
    let [cur, total] = [getCurrentCount(), getTotalCount()];
    console.log("Process:", getCurrentCount(), "/", getTotalCount());
    if (total === 0 || cur < total) {
      windowScrollTo(document.getElementsByClassName("comicContent")[0].clientHeight, true);
      cur = getCurrentCount();
      setTimeout(() => {
        windowScrollTo(0);
        setTimeout(() => refreshImage(cb), nextTime);
      }, nextTime);
      return;
    }
    cb();
  };
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

  // src/monkey/copymanga-enhance.ts
  setTimeout(() => {
    refreshImage(() => {
      windowScrollTo(0);
      render({
        info: getPageInfo(),
        preFn: () => {
          document.body.innerHTML = copymanga_enhance_default2;
          GM_addStyle(copymanga_enhance_default);
        }
      });
    });
  }, 25);
})();
