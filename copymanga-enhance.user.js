// ==UserScript==
// @name Enhance the copy manga site
// @version 6
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
  var copymanga_enhance_default = ":root{--header-label-color: rgba(255, 255, 255, .95);--header-height: 30px;--image-max-height: calc(100vh - var(--header-height));--action-btn-label-color: rgba(255, 255, 255, .95);--action-btn-bg-color: rgba(0, 0, 0, .2);--action-btn-height: 100px;--action-btn-width: 100px;--action-btn-border-radius: 100px;--action-btn-only-height: 30vh;--action-btn-only-width: 75px}#app{overflow:hidden;height:100vh}#app .header{height:var(--header-height);width:100vw;display:flex;justify-content:center;align-items:center}#app .header span{color:var(--header-label-color)}#app .header .btn{min-width:80px}#app .images{display:flex;flex-wrap:wrap;justify-content:center;overflow:auto;height:var(--image-max-height)}#app .images div{height:var(--image-max-height)}#app .images.ttb div{height:auto;width:90vw}#app .hint{position:absolute;display:flex;align-items:center;padding:15px;height:var(--action-btn-height);width:var(--action-btn-width);background-color:var(--action-btn-bg-color);border-radius:var(--action-btn-border-radius);box-shadow:var(--action-btn-shadow-x, 0) var(--action-btn-shadow-y, 0) 18px var(--action-btn-bg-color)}#app .hint.top{--action-btn-shadow-y: 10px;top:var(--header-height);align-items:flex-start;border-top-left-radius:0;border-top-right-radius:0}#app .hint.bottom{--action-btn-shadow-y: -10px;bottom:0;align-items:flex-end;border-bottom-left-radius:0;border-bottom-right-radius:0}#app .hint:not(.top):not(.bottom){height:var(--action-btn-only-height);width:var(--action-btn-only-width);top:calc((100vh - var(--action-btn-only-height)) / 2)}#app .hint.left{--action-btn-shadow-x: 10px;left:0;justify-content:flex-start;border-top-left-radius:0;border-bottom-left-radius:0}#app .hint.right{--action-btn-shadow-x: -10px;right:0;justify-content:flex-end;border-top-right-radius:0;border-bottom-right-radius:0}#app .hint div{color:var(--action-btn-label-color)}\n";

  // src/monkey/copymanga-enhance.html
  var copymanga_enhance_default2 = `<div id="app"> <div class="header"> <a :href="prevUrl" :disable="!prevUrl" class="btn"><span>\u4E0A\u4E00\u8BDD</span></a> <span class="title">{{ title }}</span> <a :href="nextUrl" :disable="!nextUrl" class="btn"><span>\u4E0B\u4E00\u8BDD</span></a> <a @click="() => switchMode(ComicDirection.TTB)" class="btn" v-if="mode !== 'ttb'"><span>\u6B63\u5E38\u6A21\u5F0F</span></a> <a @click="() => switchMode(ComicDirection.LTR)" class="btn" v-else><span>\u6761\u6F2B\u6A21\u5F0F</span></a> </div> <div class="images" tabindex="0" :class="mode" @click="onClick" @mousemove="onMouseMove" @blue="onBlur"> <div v-for="(image, index) of images"> <img :src="image" :index="index" ref="images" @load="(e) => imageLoaded(e, index)"> </div> </div> <div class="hint" :class="hintClasses"> <div v-if="hintClasses.includes(ClickAction.PREV)">\u4E0A\u4E00\u9875</div> <div v-if="hintClasses.includes(ClickAction.NEXT)">\u4E0B\u4E00\u9875</div> </div> </div>`;

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
  var ClickAction = {
    PREV: "prev",
    NEXT: "next"
  };
  var render = ({ info, preFn = Function }) => {
    preFn();
    new Vue({
      el: "#app",
      data: {
        ...info,
        mode: GM_getValue(`${comic}.direction.mode`, "ltr"),
        hintClasses: []
      },
      computed: {
        headerHeight: () => document.getElementsByClassName("header")[0].clientHeight,
        actionZones() {
          const that = this;
          const element = document.body;
          const actionWidth = element.clientWidth * 0.3;
          return [{
            left: 0,
            top: 0,
            width: actionWidth,
            height: element.clientHeight - that.headerHeight,
            names: ["left", ClickAction.PREV]
          }, {
            top: 0,
            left: element.clientWidth - actionWidth,
            width: actionWidth,
            height: (element.clientHeight - that.headerHeight) * 0.4,
            names: ["top", "right", ClickAction.PREV]
          }, {
            top: (element.clientHeight - that.headerHeight) * 0.4,
            left: element.clientWidth - actionWidth,
            width: actionWidth,
            height: (element.clientHeight - that.headerHeight) * 0.6,
            names: ["bottom", "right", ClickAction.NEXT]
          }];
        },
        ComicDirection: () => ComicDirection,
        ClickAction: () => ClickAction
      },
      methods: {
        async imageLoaded(e, index) {
          const that = this;
          if (that.mode === ComicDirection.LTR) {
          }
        },
        switchMode(mode) {
          const that = this;
          that.mode = mode;
          GM_setValue(`${comic}.direction.mode`, mode);
        },
        getActionZone(evt) {
          const that = this;
          if (evt.clientY < that.headerHeight) {
            return;
          }
          const zone = that.actionZones.find((zone2) => {
            return evt.clientX >= zone2.left && evt.clientX <= zone2.left + zone2.width && evt.clientY >= zone2.top && evt.clientY <= zone2.top + zone2.height;
          });
          return zone;
        },
        onClick(evt) {
          const that = this;
          const zone = that.getActionZone(evt);
          if (!zone) {
            return;
          }
          const element = document.body;
          const containerElement = document.getElementsByClassName("images")[0];
          const containerScrollTo = genScrollTo(containerElement);
          const nextAction = [
            zone.names.includes(ClickAction.PREV) ? ClickAction.PREV : void 0,
            zone.names.includes(ClickAction.NEXT) ? ClickAction.NEXT : void 0
          ].filter(Boolean)[0];
          if (that.mode === ComicDirection.LTR) {
            const offsetTops = [...document.getElementsByTagName("img")].map((el) => el.offsetTop - that.headerHeight);
            const currentTop = containerElement.scrollTop;
            for (let i = 0; i < offsetTops.length - 1; i++) {
              if (nextAction === ClickAction.PREV) {
                if (offsetTops[i] < currentTop && offsetTops[i + 1] >= currentTop) {
                  containerScrollTo(offsetTops[i], true);
                  break;
                }
              }
              if (nextAction === ClickAction.NEXT) {
                if (offsetTops[i] <= currentTop && offsetTops[i + 1] > currentTop) {
                  containerScrollTo(offsetTops[i + 1], true);
                  break;
                }
              }
            }
          } else if (that.mode === ComicDirection.TTB) {
            let nextTop = nextAction === ClickAction.PREV ? containerElement.scrollTop - element.clientHeight : containerElement.scrollTop + element.clientHeight;
            nextTop += that.headerHeight;
            nextTop = Math.max(0, nextTop);
            containerScrollTo(nextTop, true);
          }
        },
        onMouseMove(evt) {
          const that = this;
          const zone = that.getActionZone(evt);
          if (!zone) {
            return;
          }
          that.hintClasses.splice(0, that.hintClasses.length);
          if (zone) {
            that.hintClasses.push(...zone.names);
          }
        },
        onBlur() {
          const that = this;
          that.hintClasses.splice(0, that.hintClasses.length);
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
