// ==UserScript==
// @name Enhance the copy manga site
// @version 32
// @author Arylo Yeung <arylo.open@gmail.com>
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
// @require https://unpkg.com/vue@2.7.16/dist/vue.min.js
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
  var style_default = ":root{--header-label-color: rgba(255, 255, 255, .95);--header-height: 30px;--image-max-height: calc(100vh - var(--header-height));--action-btn-label-color: rgba(255, 255, 255, .95);--action-btn-bg-color: rgba(0, 0, 0, .2);--action-btn-height: 100px;--action-btn-width: 100px;--action-btn-border-radius: 100px;--action-btn-only-height: 30vh;--action-btn-only-width: 95px}#app{overflow:hidden;height:100vh}#app .header{height:var(--header-height);width:100vw;display:flex;justify-content:center;align-items:center}#app .header:hover~.hint{display:none}#app .header span{color:var(--header-label-color)}#app .header .btn{min-width:80px}#app .header .btn.no-action{visibility:hidden}#app .images,#app .images>div{display:flex;flex-wrap:wrap;justify-content:center;overflow:auto;height:var(--image-max-height)}#app .images{width:100vw;justify-content:space-evenly;column-gap:10px}#app .images>div{min-width:calc((100% - 10px)/4)}#app .images>div:has(.landscape),#app .images>div:has(.portrait+.portrait),#app .images>div:has(.white_page+.portrait){min-width:calc((100% - 10px)/2)}#app .images.rtl>div{flex-direction:row-reverse}#app .images.rtl img,#app .images.ltr img{height:100%}#app .images div>div{height:var(--image-max-height)}#app .images.ttb div>div{height:auto;width:90vw}#app .images .white_page{visibility:hidden}#app .hint-container{position:absolute;height:var(--hint-action-zone-height, var(--image-max-height));top:var(--hint-action-zone-top, var(--header-height));display:flex;width:30vw;align-items:center;cursor:pointer;overflow:hidden}#app .hint-container.left{left:0;justify-content:flex-start}#app .hint-container.right{right:0;justify-content:flex-end}#app .hint-container.windows.right{right:16px}#app .hint-container.top{--hint-action-zone-top: var(--header-height);--hint-action-zone-height: calc(var(--image-max-height) * .4);align-items:flex-start}#app .hint-container.bottom{--hint-action-zone-top: calc(var(--header-height) + var(--image-max-height) * .4);--hint-action-zone-height: calc(var(--image-max-height) * .6);align-items:flex-end}#app .hint-container>div{display:none;padding:20px;border-radius:var(--action-btn-border-radius);height:var(--action-btn-height);width:var(--action-btn-width);color:var(--action-btn-label-color);background-color:var(--action-btn-bg-color);box-shadow:var(--action-btn-shadow-x, 0) var(--action-btn-shadow-y, 0) 18px var(--action-btn-bg-color)}#app .hint-container:hover>div{display:flex}#app .hint-container.left>div{--action-btn-shadow-x: 10px;justify-content:flex-start;border-top-left-radius:0;border-bottom-left-radius:0}#app .hint-container.right>div{--action-btn-shadow-x: -10px;justify-content:flex-end;border-top-right-radius:0;border-bottom-right-radius:0}#app .hint-container.top>div{--action-btn-shadow-y: 10px;align-items:flex-start;border-top-left-radius:0;border-top-right-radius:0}#app .hint-container.bottom>div{--action-btn-shadow-y: -10px;align-items:flex-end;border-bottom-left-radius:0;border-bottom-right-radius:0}#app .hint-container:not(.top):not(.bottom)>div{align-items:center;height:var(--action-btn-only-height);width:var(--action-btn-only-width)}\n";

  // src/monkey/copymanga-enhance/template.html
  var template_default = '<div id="app"> <div class="header"> <a :href="prevUrl" :class="{\'no-action\': !prevUrl}" class="btn"><span>\u4E0A\u4E00\u8BDD</span></a> <a :href="menuUrl" class="title"><span>{{ title }}</span></a> <a :href="nextUrl" :class="{\'no-action\': !nextUrl}" class="btn"><span>\u4E0B\u4E00\u8BDD</span></a> <select v-model="mode" @change="selectMode"> <option :value="ComicDirection.LTR">\u6B63\u5E38\u6A21\u5F0F</option> <option :value="ComicDirection.RTL">\u65E5\u6F2B\u6A21\u5F0F</option> <option :value="ComicDirection.TTB">\u6761\u6F2B\u6A21\u5F0F</option> </select> <template v-if="canWhitePage"> <a v-if="!hasWhitePage" class="btn" @click="() => toggleWhitePage()"><span>\u589E\u52A0\u7A7A\u767D\u9875</span></a> <a v-else class="btn" @click="() => toggleWhitePage()"><span>\u79FB\u9664\u7A7A\u767D\u9875</span></a> </template> <template v-else> <span style="margin-left: 15px;color: white;">{{currentImageCount}} / {{ totalImageCount }}</span> </template> </div> <div class="images" tabindex="0" :class="mode"> <div v-for="(group, index) of imageGroups" :key="`group-${index}`"> <div v-for="obj of group" :class="[obj.type]" :key="`image-${obj.index}`"> <img class="comic" :src="obj.url" @load="(e) => !imageInfos[obj.index] && imageLoaded(e, obj.index)"> </div> </div> </div> <div class="hint-container" :class="zone.names" v-for="zone of ActionZones" @click="() => onActionZoneClick(zone)" @wheel.stop="onActionZoneWheel"> <div v-if="zone.names.includes(ClickAction.PREV_PAGE)">\u4E0A\u4E00\u9875</div> <div v-if="zone.names.includes(ClickAction.NEXT_PAGE)">\u4E0B\u4E00\u9875</div> </div> </div>';

  // src/monkey/copymanga-enhance/scripts/utils/genScrollTo.ts
  var genScrollTo = (el) => (top, isSmooth = false) => el.scrollTo({
    top,
    left: 0,
    behavior: isSmooth ? "smooth" : "auto"
  });
  var genScrollTo_default = genScrollTo;

  // src/monkey/copymanga-enhance/scripts/new-vue-mixin/constant.ts
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

  // src/monkey/copymanga-enhance/scripts/utils/parseConstant.ts
  var parseConstant = (pathname) => {
    const match = pathname.match(/\/comic\/(\w+)(?:\/chapter\/(\w+))?/);
    if (!match) {
      return {};
    }
    return {
      comic: match[1],
      chapter: match[2]
    };
  };
  var parseConstant_default = parseConstant;

  // src/monkey/copymanga-enhance/scripts/constant.ts
  var comic = parseConstant_default(globalThis.location?.pathname).comic;
  var chapter = parseConstant_default(globalThis.location?.pathname).chapter;

  // src/monkey/copymanga-enhance/scripts/storage.ts
  var whitePageKey = Object.freeze([comic, chapter, "hasWhitePage"].join("."));
  var pageInfoKey = Object.freeze([comic, chapter, "info"].join("."));
  var cacheMap = /* @__PURE__ */ new Map();
  var storage_default = {
    get whitePage() {
      const key = whitePageKey;
      const result = cacheMap.get(key) ?? JSON.parse(localStorage.getItem(key) || "false");
      !cacheMap.has(key) && cacheMap.set(key, result);
      return result;
    },
    set whitePage(value) {
      const key = whitePageKey;
      const result = JSON.stringify(value);
      localStorage.setItem(key, result);
      cacheMap.set(key, result);
    },
    get pageInfo() {
      const defaultValue = {
        images: [],
        title: void 0,
        prevUrl: void 0,
        nextUrl: void 0,
        menuUrl: void 0
      };
      const key = pageInfoKey;
      const result = cacheMap.get(key) ?? JSON.parse(sessionStorage.getItem(key) ?? JSON.stringify(defaultValue));
      !cacheMap.has(key) && cacheMap.set(key, result);
      return result;
    },
    set pageInfo(value) {
      const key = pageInfoKey;
      const result = JSON.stringify(value);
      localStorage.setItem(key, result);
      cacheMap.set(key, result);
    }
  };

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
        const containerScrollTo = genScrollTo_default(containerElement);
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
        const containerScrollTo = genScrollTo_default(containerElement);
        containerScrollTo(containerElement.scrollTop - event.wheelDeltaY * 2, true);
      }
    },
    mounted() {
      const that = this;
      const { prevUrl, nextUrl } = storage_default.pageInfo ?? {};
      window.addEventListener("keyup", ({ code }) => {
        switch (code.toLowerCase()) {
          case "ArrowLeft".toLowerCase():
            prevUrl && (window.location.href = prevUrl);
            break;
          case "ArrowRight".toLowerCase():
            nextUrl && (window.location.href = nextUrl);
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

  // src/monkey/copymanga-enhance/scripts/new-vue-mixin/utils.ts
  function imagesToImageGroups({
    imageUrls = [],
    imageInfos = [],
    needWhitePage = false
  }) {
    const groupList = [];
    let useWhitePage = !needWhitePage;
    const currentImageList = imageUrls.map((imageUrl, index) => {
      const currentImageInfo = imageInfos[index];
      const currentImageObject = { index, url: imageUrl, type: currentImageInfo?.type ?? "loading" /* LOADING */ };
      return currentImageObject;
    });
    if (needWhitePage) {
      currentImageList.forEach((imageObject, index) => {
        if (useWhitePage) return;
        if (imageObject.type !== "portrait" /* PORTRAIT */) return;
        if (currentImageList[index + 1]?.type === "portrait" /* PORTRAIT */) {
          currentImageList.splice(index, 0, {
            ...imageObject,
            index: index - 0.5,
            type: "white_page" /* WHITE_PAGE */
          });
          useWhitePage = true;
        }
      });
    }
    currentImageList.forEach((imageObject) => {
      const latestGroup = groupList[groupList.length - 1];
      if (groupList.length === 0 || latestGroup.length === 2 || ["landscape" /* LANDSCAPE */, "loading" /* LOADING */].includes(latestGroup?.[0].type) || imageObject.type === "landscape" /* LANDSCAPE */) {
        groupList.push([]);
      }
      groupList[groupList.length - 1].push(imageObject);
    });
    return groupList;
  }

  // src/monkey/copymanga-enhance/scripts/new-vue-mixin/image.ts
  var ImageMixin = () => ({
    data: {
      hasWhitePage: storage_default.whitePage
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
      imageGroups() {
        const that = this;
        return imagesToImageGroups({
          imageUrls: that.images || [],
          imageInfos: that.imageInfos || [],
          needWhitePage: that.hasWhitePage
        });
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
        storage_default.whitePage = val;
      }
    }
  });
  var image_default = ImageMixin;

  // src/monkey/copymanga-enhance/scripts/new-vue-mixin/init.ts
  var InitMixin = () => ({
    data: {
      imageInfos: []
    },
    computed: {
      pageInfo() {
        return storage_default.pageInfo ?? {};
      },
      images() {
        const that = this;
        return that.pageInfo?.images || [];
      },
      prevUrl() {
        const that = this;
        return that.pageInfo?.prevUrl;
      },
      menuUrl() {
        const that = this;
        return that.pageInfo?.menuUrl;
      },
      title() {
        const that = this;
        return that.pageInfo?.title;
      },
      nextUrl() {
        const that = this;
        return that.pageInfo?.nextUrl;
      }
    },
    mounted() {
      const that = this;
      that.imageInfos = Array(that.pageInfo?.images.length).fill(void 0);
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
  var render = () => {
    new Vue({
      el: "#app",
      mixins: [
        init_default(),
        mode_default(),
        action_default(),
        image_default()
      ]
    });
  };

  // src/monkey/copymanga-enhance/scripts/old.ts
  var getCurrentCount = () => $(".comicContent-list > li > img").length;
  var getTotalCount = () => Number(document.getElementsByClassName("comicCount")[0].innerText);
  var windowScrollTo = genScrollTo_default(window);
  var pre = -1;
  var refreshImage = (cb) => {
    const nextTime = 15;
    let [cur, total] = [getCurrentCount(), getTotalCount()];
    pre !== cur && console.log("Process:", getCurrentCount(), "/", getTotalCount());
    if (total === 0 || cur < total) {
      windowScrollTo(document.getElementsByClassName("comicContent")[0].clientHeight, true);
      cur = getCurrentCount();
      pre = cur;
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
    return info;
  };

  // src/monkey/copymanga-enhance/index.ts
  var renderNewPage = () => {
    console.log("PageInfo:", storage_default.pageInfo);
    windowScrollTo(0);
    document.body.innerHTML = template_default;
    GM_addStyle(style_default);
    render();
  };
  setTimeout(() => {
    let cacheContent = storage_default.pageInfo;
    if (cacheContent) {
      console.info("Found cache");
      return renderNewPage();
    }
    console.info("Non found cache");
    refreshImage(() => {
      const info = getPageInfo();
      storage_default.pageInfo = Object.assign({
        prevUrl: void 0,
        nextUrl: void 0,
        menuUrl: void 0
      }, info);
      renderNewPage();
    });
  }, 25);
})();
