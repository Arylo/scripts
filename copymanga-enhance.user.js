// ==UserScript==
// @name Enhance the copy manga site
// @version 25
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
  // src/monkey/polyfill/GM.ts
  var thisGlobal = window;
  if (typeof thisGlobal.GM === "undefined") {
    thisGlobal.GM = {};
  }
  function getGMWindow() {
    return thisGlobal;
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

  // src/monkey/copymanga-enhance/style.css
  var style_default = ":root{--header-label-color: rgba(255, 255, 255, .95);--header-height: 30px;--image-max-height: calc(100vh - var(--header-height));--action-btn-label-color: rgba(255, 255, 255, .95);--action-btn-bg-color: rgba(0, 0, 0, .2);--action-btn-height: 100px;--action-btn-width: 100px;--action-btn-border-radius: 100px;--action-btn-only-height: 30vh;--action-btn-only-width: 95px}#app{overflow:hidden;height:100vh}#app .header{height:var(--header-height);width:100vw;display:flex;justify-content:center;align-items:center}#app .header:hover~.hint{display:none}#app .header span{color:var(--header-label-color)}#app .header .btn{min-width:80px}#app .header .btn.no-action{visibility:hidden}#app .images{display:flex;flex-wrap:wrap;justify-content:center;overflow:auto;height:var(--image-max-height)}#app .images.rtl{flex-direction:row-reverse}#app .images div{height:var(--image-max-height)}#app .images.ttb div{height:auto;width:90vw}#app .images .white-page{visibility:hidden}#app .hint-container{position:absolute;height:var(--hint-action-zone-height, var(--image-max-height));top:var(--hint-action-zone-top, var(--header-height));display:flex;width:30vw;align-items:center;cursor:pointer;overflow:hidden}#app .hint-container.left{left:0;justify-content:flex-start}#app .hint-container.right{right:0;justify-content:flex-end}#app .hint-container.windows.right{right:16px}#app .hint-container.top{--hint-action-zone-top: var(--header-height);--hint-action-zone-height: calc(var(--image-max-height) * .4);align-items:flex-start}#app .hint-container.bottom{--hint-action-zone-top: calc(var(--header-height) + var(--image-max-height) * .4);--hint-action-zone-height: calc(var(--image-max-height) * .6);align-items:flex-end}#app .hint-container>div{display:none;padding:20px;border-radius:var(--action-btn-border-radius);height:var(--action-btn-height);width:var(--action-btn-width);color:var(--action-btn-label-color);background-color:var(--action-btn-bg-color);box-shadow:var(--action-btn-shadow-x, 0) var(--action-btn-shadow-y, 0) 18px var(--action-btn-bg-color)}#app .hint-container:hover>div{display:flex}#app .hint-container.left>div{--action-btn-shadow-x: 10px;justify-content:flex-start;border-top-left-radius:0;border-bottom-left-radius:0}#app .hint-container.right>div{--action-btn-shadow-x: -10px;justify-content:flex-end;border-top-right-radius:0;border-bottom-right-radius:0}#app .hint-container.top>div{--action-btn-shadow-y: 10px;align-items:flex-start;border-top-left-radius:0;border-top-right-radius:0}#app .hint-container.bottom>div{--action-btn-shadow-y: -10px;align-items:flex-end;border-bottom-left-radius:0;border-bottom-right-radius:0}#app .hint-container:not(.top):not(.bottom)>div{align-items:center;height:var(--action-btn-only-height);width:var(--action-btn-only-width)}\n";

  // src/monkey/copymanga-enhance/template.html
  var template_default = `<div id="app"> <div class="header"> <a :href="prevUrl" :class="{'no-action': !prevUrl}" class="btn"><span>\u4E0A\u4E00\u8BDD</span></a> <a :href="menuUrl" class="title"><span>{{ title }}</span></a> <a :href="nextUrl" :class="{'no-action': !nextUrl}" class="btn"><span>\u4E0B\u4E00\u8BDD</span></a> <select v-model="mode" @change="selectMode"> <option :value="ComicDirection.LTR">\u6B63\u5E38\u6A21\u5F0F</option> <option :value="ComicDirection.RTL">\u65E5\u6F2B\u6A21\u5F0F</option> <option :value="ComicDirection.TTB">\u6761\u6F2B\u6A21\u5F0F</option> </select> <template v-if="canWhitePage"> <a v-if="!hasWhitePage" class="btn" @click="() => toggleWhitePage()"><span>\u589E\u52A0\u7A7A\u767D\u9875</span></a> <a v-else class="btn" @click="() => toggleWhitePage()"><span>\u79FB\u9664\u7A7A\u767D\u9875</span></a> </template> <template v-else> <span style="margin-left: 15px;color: white;">{{currentImageCount}} / {{ totalImageCount }}</span> </template> </div> <div class="images" tabindex="0" :class="mode"> <template v-for="(image, index) of images"> <div v-if="hasWhitePage && whitePageIndex === index"> <img :src="image" class="white-page"> </div> <div> <img class="comic" :src="image" :index="index" @load="(e) => imageLoaded(e, index)"> </div> </template> </div> <div class="hint-container" :class="zone.names" v-for="zone of ActionZones" @click="() => onActionZoneClick(zone)" @wheel.stop="onActionZoneWheel"> <div v-if="zone.names.includes(ClickAction.PREV_PAGE)">\u4E0A\u4E00\u9875</div> <div v-if="zone.names.includes(ClickAction.NEXT_PAGE)">\u4E0B\u4E00\u9875</div> </div> </div>`;

  // src/monkey/copymanga-enhance/scripts/common.ts
  var genScrollTo = (el) => (top, isSmooth = false) => el.scrollTo({
    top,
    left: 0,
    behavior: isSmooth ? "smooth" : "auto"
  });
  var comic = globalThis.location?.pathname.split("/")[2];
  var chapter = globalThis.location?.pathname.split("/")[4];
  var findIndex = (list, predicate, opts) => {
    const { startIndex = 0 } = opts || {};
    const targetList = list.slice(startIndex);
    const nextIndex = targetList.findIndex(predicate);
    if (nextIndex === -1) return nextIndex;
    return nextIndex + startIndex;
  };
  var group = (list, groupFn) => {
    return list.reduce((acc, item, index) => {
      if (index === 0) {
        acc.push([item]);
        return acc;
      }
      const lastList = acc[acc.length - 1];
      const lastKey = groupFn(lastList[0]);
      const curKey = groupFn(item);
      if (lastKey === curKey) {
        lastList.push(item);
      } else {
        acc.push([item]);
      }
      return acc;
    }, []);
  };

  // src/monkey/copymanga-enhance/scripts/constant.ts
  var ComicDirection = /* @__PURE__ */ ((ComicDirection2) => {
    ComicDirection2["LTR"] = "ltr";
    ComicDirection2["RTL"] = "rtl";
    ComicDirection2["TTB"] = "ttb";
    return ComicDirection2;
  })(ComicDirection || {});
  var ClickAction = /* @__PURE__ */ ((ClickAction2) => {
    ClickAction2["PREV_PAGE"] = "prev_page";
    ClickAction2["NEXT_PAGE"] = "next_page";
    return ClickAction2;
  })(ClickAction || {});
  var ActionZones = [{
    names: ["left", "prev_page" /* PREV_PAGE */]
  }, {
    names: ["top", "right", "prev_page" /* PREV_PAGE */]
  }, {
    names: ["bottom", "right", "next_page" /* NEXT_PAGE */]
  }];

  // src/monkey/copymanga-enhance/scripts/new-vue-mixin/action.ts
  var ActionMixin = () => ({
    computed: {
      ClickAction: () => ClickAction,
      ActionZones: () => ActionZones.map(
        (zone) => ({
          names: zone.names.concat($.isWindow(window) ? ["windows"] : []).filter(Boolean)
        })
      )
    },
    methods: {
      onJumpPage(nextAction) {
        const that = this;
        const element = document.body;
        const containerElement = document.getElementsByClassName("images")[0];
        const containerScrollTo = genScrollTo(containerElement);
        const headerHeight = document.getElementsByClassName("header")[0].clientHeight;
        if (["ltr" /* LTR */, "rtl" /* RTL */].includes(that.mode)) {
          const offsetTops = [...document.getElementsByClassName("comic")].map((el) => el.offsetTop - headerHeight);
          const currentTop = containerElement.scrollTop;
          for (let i = 0; i < offsetTops.length - 1; i++) {
            if (nextAction === "prev_page" /* PREV_PAGE */) {
              if (offsetTops[i] < currentTop && offsetTops[i + 1] >= currentTop) {
                containerScrollTo(offsetTops[i], true);
                break;
              }
            }
            if (nextAction === "next_page" /* NEXT_PAGE */) {
              if (offsetTops[i] <= currentTop && offsetTops[i + 1] > currentTop) {
                containerScrollTo(offsetTops[i + 1], true);
                break;
              }
            }
          }
        } else if (that.mode === "ttb" /* TTB */) {
          let nextTop = nextAction === "prev_page" /* PREV_PAGE */ ? containerElement.scrollTop - element.clientHeight : containerElement.scrollTop + element.clientHeight;
          nextTop += headerHeight;
          nextTop = Math.max(0, nextTop);
          containerScrollTo(nextTop, true);
        }
      },
      onActionZoneClick(zone) {
        const that = this;
        const { names } = zone;
        const nextAction = [
          names.includes("prev_page" /* PREV_PAGE */) ? "prev_page" /* PREV_PAGE */ : void 0,
          names.includes("next_page" /* NEXT_PAGE */) ? "next_page" /* NEXT_PAGE */ : void 0
        ].filter(Boolean)[0];
        that.onJumpPage(nextAction);
      },
      onActionZoneWheel(event) {
        const containerElement = document.getElementsByClassName("images")[0];
        const containerScrollTo = genScrollTo(containerElement);
        containerScrollTo(containerElement.scrollTop - event.wheelDeltaY * 2, true);
      }
    },
    mounted() {
      const that = this;
      window.addEventListener("keyup", ({ code }) => {
        switch (code.toLowerCase()) {
          case "ArrowLeft".toLowerCase():
            that.prevUrl && (window.location.href = that.prevUrl);
            break;
          case "ArrowRight".toLowerCase():
            that.nextUrl && (window.location.href = that.nextUrl);
            break;
          case "ArrowUp".toLowerCase():
            that.onJumpPage("prev_page" /* PREV_PAGE */);
            break;
          case "Space".toLowerCase():
          case "ArrowDown".toLowerCase():
            that.onJumpPage("next_page" /* NEXT_PAGE */);
            break;
          case "MetaLeft".toLowerCase():
          case "ControlLeft".toLowerCase():
            that.hasWhitePage = false;
            break;
          case "MetaRight".toLowerCase():
          case "ControlRight".toLowerCase():
            that.hasWhitePage = true;
            break;
        }
      });
    }
  });
  var action_default = ActionMixin;

  // src/monkey/copymanga-enhance/scripts/new-vue-mixin/image.ts
  var ImageMixin = (info) => ({
    data: {
      hasWhitePage: JSON.parse(sessionStorage.getItem(`${comic}.hasWhitePage.${chapter}`) || "false")
    },
    computed: {
      currentImageCount() {
        const that = this;
        return that.imageInfos.filter(Boolean).length;
      },
      totalImageCount() {
        const that = this;
        return that.imageInfos.length;
      },
      isAllImagesLoaded() {
        const that = this;
        return that.currentImageCount === that.totalImageCount;
      },
      canWhitePage() {
        const that = this;
        if (!["ltr" /* LTR */, "rtl" /* RTL */].includes(that.mode)) {
          return false;
        }
        return that.isAllImagesLoaded;
      },
      whitePageIndex() {
        const that = this;
        if (!that.hasWhitePage || !that.isAllImagesLoaded) return -1;
        const groupList = group(that.imageInfos, (info2) => info2?.type);
        if (groupList.length === 1) return 0;
        if (groupList.length >= 2) {
          const [firstList] = groupList;
          if (firstList.length !== 1 && firstList[0].type === "portrait" /* PORTRAIT */) return 0;
        }
        if (groupList.length >= 3) {
          const [firstList, secondList] = groupList;
          if (firstList.length === 1 && firstList[0].type === "portrait" /* PORTRAIT */) {
            return findIndex(
              that.imageInfos,
              (info2) => info2?.type === "portrait" /* PORTRAIT */,
              { startIndex: firstList.length + secondList.length }
            );
          }
        }
        return findIndex(that.imageInfos, (info2) => info2?.type === "portrait" /* PORTRAIT */);
      }
    },
    methods: {
      imageLoaded(e, index) {
        const that = this;
        const el = e.target;
        that.imageInfos.splice(index, 1, {
          width: el.width,
          height: el.height,
          type: el.width > el.height ? "landscape" /* LANDSCAPE */ : "portrait" /* PORTRAIT */
        });
        if (that.mode === "ltr" /* LTR */) {
        }
      },
      toggleWhitePage() {
        const that = this;
        that.hasWhitePage = !that.hasWhitePage;
      }
    },
    watch: {
      hasWhitePage(val) {
        sessionStorage.setItem(`${comic}.hasWhitePage.${chapter}`, JSON.stringify(val));
      }
    }
  });
  var image_default = ImageMixin;

  // src/monkey/copymanga-enhance/scripts/new-vue-mixin/init.ts
  var InitMixin = (info) => ({
    data: {
      ...info,
      imageInfos: Array(info.images.length).fill(void 0)
    }
  });
  var init_default = InitMixin;

  // src/monkey/copymanga-enhance/scripts/new-vue-mixin/mode.ts
  var ModeMixin = () => ({
    data: {
      mode: GM_getValue(`${comic}.direction.mode`, "rtl" /* RTL */)
    },
    computed: {
      ComicDirection: () => ComicDirection
    },
    methods: {
      selectMode(evt) {
        const value = evt.target?.value;
        this.switchMode(value);
        GM_setValue(`${comic}.direction.mode`, value);
      },
      switchMode(mode) {
        const that = this;
        that.mode = mode;
      }
    }
  });
  var mode_default = ModeMixin;

  // src/monkey/copymanga-enhance/scripts/new.ts
  var render = ({ info, preFn = Function }) => {
    preFn();
    new Vue({
      el: "#app",
      mixins: [
        init_default(info),
        mode_default(),
        action_default(),
        image_default(info)
      ]
    });
  };

  // src/monkey/copymanga-enhance/scripts/old.ts
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
    const info = {
      images: list,
      title: $(".header").get(0)?.innerText,
      menuUrl: footerElements.get(3)?.href,
      prevUrl: footerElements.get(1)?.className.includes("prev-null") ? void 0 : footerElements.get(1)?.href,
      nextUrl: footerElements.get(2)?.className.includes("prev-null") ? void 0 : footerElements.get(2)?.href
    };
    console.log("PageInfo:", info);
    return info;
  };

  // src/monkey/copymanga-enhance/index.ts
  var sessionStorageKey = `${comic}.info.${chapter}`;
  var renderNewPage = (info) => render({
    info,
    preFn: () => {
      document.body.innerHTML = template_default;
      GM_addStyle(style_default);
    }
  });
  setTimeout(() => {
    let cacheContent = sessionStorage.getItem(sessionStorageKey);
    if (cacheContent) {
      const info = {
        prevUrl: void 0,
        nextUrl: void 0,
        menuUrl: void 0,
        ...JSON.parse(cacheContent)
      };
      return renderNewPage(info);
    }
    refreshImage(() => {
      windowScrollTo(0);
      const info = getPageInfo();
      sessionStorage.setItem(sessionStorageKey, JSON.stringify(info));
      renderNewPage(info);
    });
  }, 25);
})();
