// ==UserScript==
// @name Enhance the copy manga site
// @version 12
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
  var copymanga_enhance_default = ":root{--header-label-color: rgba(255, 255, 255, .95);--header-height: 30px;--image-max-height: calc(100vh - var(--header-height));--action-btn-label-color: rgba(255, 255, 255, .95);--action-btn-bg-color: rgba(0, 0, 0, .2);--action-btn-height: 100px;--action-btn-width: 100px;--action-btn-border-radius: 100px;--action-btn-only-height: 30vh;--action-btn-only-width: 95px}#app{overflow:hidden;height:100vh}#app .header{height:var(--header-height);width:100vw;display:flex;justify-content:center;align-items:center}#app .header:hover~.hint{display:none}#app .header span{color:var(--header-label-color)}#app .header .btn{min-width:80px}#app .header .btn.no-action{visibility:hidden}#app .images{display:flex;flex-wrap:wrap;justify-content:center;overflow:auto;height:var(--image-max-height)}#app .images.rtl{flex-direction:row-reverse}#app .images div{height:var(--image-max-height)}#app .images.ttb div{height:auto;width:90vw}#app .images .white-page{visibility:hidden}#app .hint-container{position:absolute;height:var(--hint-action-zone-height, var(--image-max-height));top:var(--hint-action-zone-top, var(--header-height));display:flex;width:30vw;align-items:center;cursor:pointer;overflow:hidden}#app .hint-container.left{left:0;justify-content:flex-start}#app .hint-container.right{right:0;justify-content:flex-end}#app .hint-container.top{--hint-action-zone-top: var(--header-height);--hint-action-zone-height: calc(var(--image-max-height) * .4);align-items:flex-start}#app .hint-container.bottom{--hint-action-zone-top: calc(var(--header-height) + var(--image-max-height) * .4);--hint-action-zone-height: calc(var(--image-max-height) * .6);align-items:flex-end}#app .hint-container>div{display:none;padding:20px;border-radius:var(--action-btn-border-radius);height:var(--action-btn-height);width:var(--action-btn-width);color:var(--action-btn-label-color);background-color:var(--action-btn-bg-color);box-shadow:var(--action-btn-shadow-x, 0) var(--action-btn-shadow-y, 0) 18px var(--action-btn-bg-color)}#app .hint-container:hover>div{display:flex}#app .hint-container.left>div{--action-btn-shadow-x: 10px;justify-content:flex-start;border-top-left-radius:0;border-bottom-left-radius:0}#app .hint-container.right>div{--action-btn-shadow-x: -10px;justify-content:flex-end;border-top-right-radius:0;border-bottom-right-radius:0}#app .hint-container.top>div{--action-btn-shadow-y: 10px;align-items:flex-start;border-top-left-radius:0;border-top-right-radius:0}#app .hint-container.bottom>div{--action-btn-shadow-y: -10px;align-items:flex-end;border-bottom-left-radius:0;border-bottom-right-radius:0}#app .hint-container:not(.top):not(.bottom)>div{align-items:center;height:var(--action-btn-only-height);width:var(--action-btn-only-width)}\n";

  // src/monkey/copymanga-enhance.html
  var copymanga_enhance_default2 = `<div id="app"> <div class="header"> <a :href="prevUrl" :class="{'no-action': !prevUrl}" class="btn"><span>\u4E0A\u4E00\u8BDD</span></a> <span class="title">{{ title }}</span> <a :href="nextUrl" :class="{'no-action': !nextUrl}" class="btn"><span>\u4E0B\u4E00\u8BDD</span></a> <select v-model="mode" @change="selectMode"> <option :value="ComicDirection.LTR">\u6B63\u5E38\u6A21\u5F0F</option> <option :value="ComicDirection.RTL">\u65E5\u6F2B\u6A21\u5F0F</option> <option :value="ComicDirection.TTB">\u6761\u6F2B\u6A21\u5F0F</option> </select> <template v-if="canWhitePage"> <a v-if="!hasWhitePage" class="btn" @click="() => addWhitePage()"><span>\u589E\u52A0\u7A7A\u767D\u9875</span></a> <a v-else class="btn" @click="() => removeWhitePage()"><span>\u79FB\u9664\u7A7A\u767D\u9875</span></a> </template> </div> <div class="images" tabindex="0" :class="mode"> <div v-if="hasWhitePage"> <img :src="images[0]" class="white-page"> </div> <div v-for="(image, index) of images"> <img class="comic" :src="image" :index="index" @load="(e) => imageLoaded(e, index)"> </div> </div> <div class="hint-container" :class="zone.names" v-for="zone of ActionZones" @click="() => onActionZoneClick(zone)"> <div v-if="zone.names.includes(ClickAction.PREV_PAGE)">\u4E0A\u4E00\u9875</div> <div v-if="zone.names.includes(ClickAction.NEXT_PAGE)">\u4E0B\u4E00\u9875</div> </div> </div>`;

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
    RTL: "rtl",
    TTB: "ttb"
  };
  var ClickAction = {
    PREV_PAGE: "prev_page",
    NEXT_PAGE: "next_page"
  };
  var PrivateKey = {
    INIT: "init",
    HEADER_HEIGHT: "headerHeight"
  };
  var ActionZones = [{
    names: ["left", ClickAction.PREV_PAGE]
  }, {
    names: ["top", "right", ClickAction.PREV_PAGE]
  }, {
    names: ["bottom", "right", ClickAction.NEXT_PAGE]
  }];
  var render = ({ info, preFn = Function }) => {
    preFn();
    new Vue({
      el: "#app",
      data: {
        ...info,
        mode: GM_getValue(`${comic}.direction.mode`, ComicDirection.RTL),
        actionZones: [],
        [PrivateKey.HEADER_HEIGHT]: 0,
        imageInfos: Array(info.images.length).fill(void 0),
        hasWhitePage: false
      },
      computed: {
        ComicDirection: () => ComicDirection,
        ClickAction: () => ClickAction,
        ActionZones: () => ActionZones,
        canWhitePage() {
          const that = this;
          if (![ComicDirection.LTR, ComicDirection.RTL].includes(that.mode)) {
            return false;
          }
          return that.imageInfos.filter(Boolean).length === info.images.length;
        }
      },
      methods: {
        async imageLoaded(e, index) {
          const that = this;
          const el = e.target;
          that.imageInfos.splice(index, 1, {
            width: el.width,
            height: el.height
          });
          if (that.mode === ComicDirection.LTR) {
          }
        },
        addWhitePage() {
          const that = this;
          that.hasWhitePage = true;
        },
        removeWhitePage() {
          const that = this;
          that.hasWhitePage = false;
        },
        selectMode(evt) {
          const that = this;
          const value = evt.target?.value;
          that.switchMode(value);
          GM_setValue(`${comic}.direction.mode`, value);
        },
        switchMode(mode) {
          const that = this;
          that.mode = mode;
        },
        onActionZoneClick(zone) {
          const that = this;
          const element = document.body;
          const containerElement = document.getElementsByClassName("images")[0];
          const containerScrollTo = genScrollTo(containerElement);
          const { names } = zone;
          const nextAction = [
            names.includes(ClickAction.PREV_PAGE) ? ClickAction.PREV_PAGE : void 0,
            names.includes(ClickAction.NEXT_PAGE) ? ClickAction.NEXT_PAGE : void 0
          ].filter(Boolean)[0];
          if ([ComicDirection.LTR, ComicDirection.RTL].includes(that.mode)) {
            const offsetTops = [...document.getElementsByClassName("comic")].map((el) => el.offsetTop - that[PrivateKey.HEADER_HEIGHT]);
            const currentTop = containerElement.scrollTop;
            for (let i = 0; i < offsetTops.length - 1; i++) {
              if (nextAction === ClickAction.PREV_PAGE) {
                if (offsetTops[i] < currentTop && offsetTops[i + 1] >= currentTop) {
                  containerScrollTo(offsetTops[i], true);
                  break;
                }
              }
              if (nextAction === ClickAction.NEXT_PAGE) {
                if (offsetTops[i] <= currentTop && offsetTops[i + 1] > currentTop) {
                  containerScrollTo(offsetTops[i + 1], true);
                  break;
                }
              }
            }
          } else if (that.mode === ComicDirection.TTB) {
            let nextTop = nextAction === ClickAction.PREV_PAGE ? containerElement.scrollTop - element.clientHeight : containerElement.scrollTop + element.clientHeight;
            nextTop += that[PrivateKey.HEADER_HEIGHT];
            nextTop = Math.max(0, nextTop);
            containerScrollTo(nextTop, true);
          }
        },
        [PrivateKey.INIT]() {
          const that = this;
          that[PrivateKey.HEADER_HEIGHT] = document.getElementsByClassName("header")[0].clientHeight;
        }
      },
      mounted() {
        const that = this;
        window.onresize = () => {
          that[PrivateKey.INIT]();
        };
        that[PrivateKey.INIT]();
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
