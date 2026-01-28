// ==UserScript==
// @name Enhance the copy manga site
// @version 35
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
// @require https://unpkg.com/vue@3/dist/vue.global.prod.js
// @homepage https://github.com/Arylo/scripts#readme
// @supportURL https://github.com/Arylo/scripts/issues
// @downloadURL https://raw.githubusercontent.com/Arylo/scripts/monkey/copymanga-enhance.user.js
// @updateURL https://raw.githubusercontent.com/Arylo/scripts/monkey/copymanga-enhance.meta.js
// @run-at document-end
// @grant GM_xmlhttpRequest
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==
"use strict";
(() => {
  // src/monkey/copymanga-enhance/template.html
  var template_default = '<div id="app"></div>';

  // src/monkey/copymanga-enhance/scripts/newPage/vue.ts
  var {
    createApp,
    defineComponent,
    readonly,
    ref,
    reactive,
    computed,
    isRef,
    unref,
    onMounted,
    watch,
    watchEffect,
    h,
    compile,
    Fragment
  } = Vue;
  var vue_default = Vue;

  // src/monkey/polyfill/GM_addStyle.ts
  if (typeof window.GM_addStyle === "undefined") {
    window.GM_addStyle = function GM_addStyle(cssContent) {
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
  var GM_addStyle_default = window.GM_addStyle;

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

  // src/monkey/copymanga-enhance/scripts/newPage/constant.ts
  var ACTION_GRID_MAP = {
    PREV: [1, 3, 4],
    NEXT: [6]
  };

  // src/monkey/copymanga-enhance/scripts/storage.ts
  var whitePageKey = Object.freeze([comic, chapter, "hasWhitePage"].join("."));
  var pageInfoKey = Object.freeze([comic, chapter, "info"].join("."));
  var directionModeKey = Object.freeze([comic, "direction", "mode"].join("."));
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
      cacheMap.set(key, value);
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
      sessionStorage.setItem(key, result);
      cacheMap.set(key, value);
    },
    get directionMode() {
      const key = directionModeKey;
      const result = cacheMap.get(key) ?? GM_getValue(key, "rtl" /* RTL */);
      !cacheMap.has(key) && cacheMap.set(key, result);
      return result;
    },
    set directionMode(value) {
      const key = directionModeKey;
      GM_setValue(key, value);
      cacheMap.set(key, value);
    }
  };

  // src/monkey/copymanga-enhance/scripts/newPage/hooks/usePageInfo.ts
  function usePageInfo() {
    const rawData = ref(storage_default.pageInfo);
    onMounted(() => {
      rawData.value = storage_default.pageInfo;
    });
    return readonly(rawData);
  }

  // src/monkey/copymanga-enhance/scripts/newPage/hooks/useWhitePage.ts
  var whitePageRef = ref(storage_default.whitePage);
  function useWhitePage() {
    const whitePage = readonly(whitePageRef);
    function setter(value) {
      whitePageRef.value = value;
      storage_default.whitePage = value;
    }
    onMounted(() => {
      setter(storage_default.whitePage);
    });
    return [whitePage, setter];
  }

  // src/monkey/copymanga-enhance/scripts/utils/genScrollTo.ts
  var genScrollTo = (el) => (top, isSmooth = false) => el.scrollTo({
    top,
    left: 0,
    behavior: isSmooth ? "smooth" : "auto"
  });
  var genScrollTo_default = genScrollTo;

  // src/monkey/copymanga-enhance/scripts/newPage/hooks/useScrollBy.ts
  function useScrollBy() {
    let scrollTo = null;
    const getScrollElement = () => {
      const element = document.querySelector(".direction-wrapper");
      return element;
    };
    const getScrollStep = () => {
      const appBody = getScrollElement();
      return appBody?.clientHeight ?? window.innerHeight;
    };
    const scrollBy = (delta) => {
      if (!scrollTo) return;
      scrollTo(getScrollElement()?.scrollTop + delta, true);
    };
    const scrollUp = () => {
      scrollBy(-getScrollStep());
    };
    const scrollDown = () => {
      scrollBy(getScrollStep());
    };
    onMounted(() => {
      scrollTo = genScrollTo_default(getScrollElement());
    });
    return { scrollUp, scrollDown };
  }

  // src/monkey/copymanga-enhance/scripts/newPage/hooks/useKeyWatcher.ts
  function useKeyWatcher() {
    const pageInfoRef = usePageInfo();
    const prevUrlRef = computed(() => unref(pageInfoRef).prevUrl);
    const nextUrlRef = computed(() => unref(pageInfoRef).nextUrl);
    const [_, setWhitePage] = useWhitePage();
    const { scrollUp, scrollDown } = useScrollBy();
    onMounted(() => {
      const prevUrl = unref(prevUrlRef);
      const nextUrl = unref(nextUrlRef);
      window.addEventListener("keyup", (event) => {
        const { code } = event;
        switch (code.toLowerCase()) {
          case "ArrowLeft".toLowerCase():
            prevUrl && (window.location.href = prevUrl);
            break;
          case "ArrowRight".toLowerCase():
            nextUrl && (window.location.href = nextUrl);
            break;
          case "ArrowUp".toLowerCase():
            event.preventDefault();
            scrollUp();
            break;
          case "Space".toLowerCase():
          case "ArrowDown".toLowerCase():
            event.preventDefault();
            scrollDown();
            break;
          case "MetaLeft".toLowerCase():
          case "ControlLeft".toLowerCase():
            setWhitePage(false);
            break;
          case "MetaRight".toLowerCase():
          case "ControlRight".toLowerCase():
            setWhitePage(true);
            break;
        }
      });
    });
  }

  // src/monkey/copymanga-enhance/scripts/newPage/hooks/useMouseGrid.ts
  var mouseFocusRef = ref(-1);
  function useMouseGrid() {
    const mouseGrid = readonly(mouseFocusRef);
    function setter(value) {
      mouseFocusRef.value = value;
    }
    return [mouseGrid, setter];
  }

  // src/monkey/copymanga-enhance/scripts/newPage/hooks/useMouseWatcher.ts
  function useMouseWatcher() {
    const { scrollUp, scrollDown } = useScrollBy();
    const [mouseGridRef, setMouseGrid] = useMouseGrid();
    onMounted(() => {
      const appBody = document.querySelector(".app-body");
      if (!appBody) return;
      const getGridIndex = (x, y) => {
        const COUNT_COLUMN = 3;
        const COUNT_ROW = 2;
        const rect = appBody.getBoundingClientRect();
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return -1;
        const colWidth = rect.width / COUNT_COLUMN;
        const rowHeight = rect.height / COUNT_ROW;
        const col = Math.min(COUNT_COLUMN - 1, Math.max(0, Math.floor((x - rect.left) / colWidth)));
        const row = Math.min(COUNT_ROW - 1, Math.max(0, Math.floor((y - rect.top) / rowHeight)));
        return row * COUNT_COLUMN + col + 1;
      };
      const handleGridMove = (info) => {
        const gridIndex = getGridIndex(info.x, info.y);
        const currentGridIndex = unref(mouseGridRef);
        if (gridIndex === currentGridIndex) return;
        setMouseGrid(gridIndex);
      };
      const handleGridClick = (info) => {
        const gridIndex = getGridIndex(info.x, info.y);
        if (ACTION_GRID_MAP.PREV.includes(gridIndex)) {
          return scrollUp();
        }
        if (ACTION_GRID_MAP.NEXT.includes(gridIndex)) {
          return scrollDown();
        }
      };
      appBody.addEventListener("mousemove", (event) => {
        const info = {
          x: event.clientX,
          y: event.clientY
        };
        handleGridMove(info);
      });
      appBody.addEventListener("click", (event) => {
        const info = {
          x: event.clientX,
          y: event.clientY
        };
        handleGridClick(info);
      });
      appBody.addEventListener("touchstart", (event) => {
        const touch = event.touches[0];
        if (!touch) return;
        const info = {
          x: touch.clientX,
          y: touch.clientY
        };
        handleGridClick(info);
      });
    });
    return {};
  }

  // node_modules/classcat/index.js
  function cc(names) {
    if (typeof names === "string" || typeof names === "number") return "" + names;
    let out = "";
    if (Array.isArray(names)) {
      for (let i = 0, tmp; i < names.length; i++) {
        if ((tmp = cc(names[i])) !== "") {
          out += (out && " ") + tmp;
        }
      }
    } else {
      for (let k in names) {
        if (names[k]) out += (out && " ") + k;
      }
    }
    return out;
  }

  // src/monkey/copymanga-enhance/scripts/newPage/hooks/useDirectionMode.ts
  var directionModeRef = ref(storage_default.directionMode);
  function useDirectionMode() {
    const directionMode = readonly(directionModeRef);
    function setter(mode) {
      directionModeRef.value = mode;
      storage_default.directionMode = mode;
    }
    onMounted(() => {
      setter(storage_default.directionMode);
    });
    return [directionMode, setter];
  }

  // src/monkey/copymanga-enhance/scripts/newPage/hooks/useImageInfoMap.ts
  var statusMap = ref([]);
  function useImageInfoMap() {
    return statusMap;
  }

  // src/monkey/copymanga-enhance/scripts/newPage/hooks/useImageList.ts
  function useImageList() {
    const pageInfoRef = usePageInfo();
    const imagesRef = computed(() => unref(pageInfoRef).images ?? []);
    return imagesRef;
  }

  // src/monkey/copymanga-enhance/scripts/newPage/component/Image/style.css
  var style_default = ":is(.ltr,.rtl) .comic-image{height:var(--body-height);width:auto}\n";

  // src/monkey/copymanga-enhance/scripts/newPage/component/Image/index.ts
  var Image_default = defineComponent({
    props: {
      src: {
        type: String,
        required: true
      }
    },
    setup(props, { emit }) {
      onMounted(() => {
        GM_addStyle_default(style_default);
      });
      const pageType = ref("portrait" /* PORTRAIT */);
      const imageListRef = useImageList();
      const imageInfoMapRef = useImageInfoMap();
      const onLoad = (e) => {
        const index = unref(imageListRef).indexOf(props.src);
        const element = e.target;
        const [width, height] = [element.naturalWidth, element.naturalHeight];
        const type = width > height ? "landscape" /* LANDSCAPE */ : "portrait" /* PORTRAIT */;
        imageInfoMapRef.value[index] = {
          width,
          height,
          type
        };
        pageType.value = type;
        emit("loaded");
      };
      return () => h("img", { class: `comic-image ${unref(pageType)}`, src: props.src, onLoad });
    }
  });

  // src/monkey/copymanga-enhance/scripts/newPage/component/AppBody/style.css
  var style_default2 = ".direction-wrapper{display:flex;flex-wrap:wrap;justify-content:center;width:100%;max-height:var(--body-height);overflow-y:scroll}.wrapper{display:flex;flex-basis:100%;justify-content:center;padding-top:1px;padding-bottom:1px;order:attr(data-index number)}:is(.ltr,.rtl).direction-wrapper{scroll-snap-type:y mandatory}:is(.ltr,.rtl) .wrapper{scroll-snap-align:center}@media (max-aspect-ratio: 5 / 3){.wrapper:has(>.white-page){display:none}}@media (min-aspect-ratio: 5 / 3){:is(.ltr,.rtl) .wrapper:has(>.portrait){flex-basis:50%}.ltr .wrapper:has(>.portrait):nth-of-type(odd),.rtl .wrapper:has(>.portrait):nth-of-type(2n){justify-content:flex-end;padding-left:5px}.ltr .wrapper:has(>.portrait):nth-of-type(2n),.rtl .wrapper:has(>.portrait):nth-of-type(odd){justify-content:flex-start;padding-right:5px}}@media (min-aspect-ratio: 9 / 3){:is(.ltr,.rtl) .wrapper:has(>.portrait){flex-basis:25%}}\n";

  // src/monkey/copymanga-enhance/scripts/newPage/component/WhitePage/style.css
  var style_default3 = ".white-page{height:1px;width:1px}\n";

  // src/monkey/copymanga-enhance/scripts/newPage/component/WhitePage/index.ts
  var WhitePage_default = defineComponent({
    setup() {
      onMounted(() => {
        GM_addStyle_default(style_default3);
      });
      return {};
    },
    template: '<div class="white-page portrait"></div>'
  });

  // src/monkey/copymanga-enhance/scripts/newPage/component/AppBody/index.ts
  var AppBody_default = defineComponent({
    setup() {
      const [whitePageRef2] = useWhitePage();
      const [directionModeRef2] = useDirectionMode();
      const imageListRef = useImageList();
      const infoMapRef = useImageInfoMap();
      onMounted(() => {
        GM_addStyle_default(style_default2);
        refresh();
      });
      watch(whitePageRef2, () => refresh());
      watch(directionModeRef2, () => refresh());
      watch(imageListRef, () => refresh());
      watch(infoMapRef, () => refresh());
      const onLoaded = () => {
        refresh();
      };
      const parseImages = (urls = []) => {
        const infoMap = unref(infoMapRef);
        return urls.map((src, index) => {
          const info = infoMap[index];
          const pageType = info && info.type === "landscape" /* LANDSCAPE */ ? "landscape" /* LANDSCAPE */ : "portrait" /* PORTRAIT */;
          return {
            component: Image_default,
            props: {
              src,
              onLoaded,
              key: `image-${index}`,
              pageType
            }
          };
        });
      };
      const addFirstWhitePage = (list) => {
        if (list.length === 0) return list;
        if (!unref(whitePageRef2)) return list;
        if (!["rtl" /* RTL */, "ltr" /* LTR */].includes(unref(directionModeRef2))) return list;
        let anchorIndex = -1;
        for (let index = 0; index < list.length; index++) {
          const { props } = list[index];
          if (props.pageType === "landscape" /* LANDSCAPE */) {
            anchorIndex = -1;
            continue;
          }
          if (anchorIndex === -1) {
            anchorIndex = index;
            continue;
          }
          if (index - anchorIndex > 2) {
            list.splice(anchorIndex, 0, {
              component: WhitePage_default,
              props: { key: `white-page-${anchorIndex}`, class: "manual", pageType: "portrait" /* PORTRAIT */ }
            });
            break;
          }
        }
        return list;
      };
      const injectWhitePages = (list) => {
        if (list.length === 0) return list;
        if (!["rtl" /* RTL */, "ltr" /* LTR */].includes(unref(directionModeRef2))) return list;
        const tempList = [];
        for (let index = 0; index < list.length; index++) {
          const { props: { pageType } } = list[index];
          let lastGroupPageType = tempList.length > 0 ? tempList[tempList.length - 1][0].props.pageType : null;
          if (pageType !== lastGroupPageType) {
            tempList.push([]);
          }
          tempList[tempList.length - 1].push(list[index]);
        }
        for (let groupIndex = 0; groupIndex < tempList.length; groupIndex++) {
          const group = tempList[groupIndex];
          if (group[0].props.pageType === "landscape" /* LANDSCAPE */) continue;
          if (group.length % 2 === 0) continue;
          group.push({
            component: WhitePage_default,
            props: { key: `white-page-group-${groupIndex}`, class: "auto", pageType: "portrait" /* PORTRAIT */ }
          });
        }
        return tempList.flat();
      };
      const injectDataIndex = (list) => {
        let portraitCount = 0;
        return list.map((item, index) => {
          let targetIndex = index + 1;
          if ("rtl" /* RTL */ === unref(directionModeRef2)) {
            if (item.props.pageType === "portrait" /* PORTRAIT */) {
              portraitCount++;
              if (portraitCount % 2 === 0) {
                targetIndex -= 1;
              } else {
                targetIndex += 1;
              }
            }
            if (item.props.pageType === "landscape" /* LANDSCAPE */) {
              portraitCount = 0;
            }
          }
          return {
            ...item,
            props: {
              ...item.props,
              "data-index": targetIndex
            }
          };
        });
      };
      const refresh = () => {
        let list = [];
        list = parseImages(unref(imageListRef));
        list = addFirstWhitePage(list);
        list = injectWhitePages(list);
        list = injectDataIndex(list);
        imagesRef.value = list;
      };
      const imagesRef = ref([]);
      return () => h(
        "div",
        { class: "app-body" },
        [
          h(
            "div",
            { class: cc(["direction-wrapper", unref(directionModeRef2)]) },
            unref(imagesRef).map(({ component, props }) => h("div", { class: "wrapper", "data-index": props["data-index"] }, [h(component, { ...props })]))
          )
        ]
      );
    }
  });

  // src/monkey/copymanga-enhance/scripts/newPage/component/AppHeader/style.css
  var style_default4 = ".app-header{display:grid;grid-template-columns:1fr 60px auto 60px 1fr;column-gap:5px;align-items:center}.app-header :is(.comic-title,.loading-hint,.white-page-toggle),.app-header :is(.prev-comic,.next-comic):not([disabled]){color:#fff!important;cursor:pointer}.app-header :is(.prev-comic,.next-comic)[disabled]{color:gray!important;cursor:default}.app-header :is(.prev-comic,.next-comic){text-decoration:none;text-align:center}.app-header :is(.left-space,.right-space){display:flex;flex-flow:column;justify-content:center;column-gap:5px}.app-header .left-space{align-items:flex-end}.app-header .right-space{align-items:flex-start}\n";

  // src/monkey/copymanga-enhance/scripts/newPage/component/AppHeader/index.ts
  var AppHeader_default = defineComponent({
    setup() {
      const pageInfoRef = usePageInfo();
      const titleRef = computed(() => unref(pageInfoRef).title);
      const titleUrlRef = computed(() => unref(pageInfoRef).menuUrl);
      const prevUrlRef = computed(() => unref(pageInfoRef).prevUrl);
      const nextUrlRef = computed(() => unref(pageInfoRef).nextUrl);
      const imageListRef = useImageList();
      const imageInfoMapRef = useImageInfoMap();
      const loadingStatusRef = computed(() => {
        const total = unref(imageListRef).length;
        const loaded = unref(imageInfoMapRef).filter((info) => info).length;
        return {
          total,
          loaded,
          hint: loaded === total ? "" : `\u5DF2\u52A0\u8F7D (${loaded} / ${total})`
        };
      });
      const [whitePageRef2, setWhitePage] = useWhitePage();
      onMounted(() => {
        GM_addStyle_default(style_default4);
      });
      const [directionModeRef2, setDirectionMode] = useDirectionMode();
      return () => h("div", { class: "app-header" }, [
        h(
          "div",
          { class: "left-space" },
          [
            unref(loadingStatusRef).hint ? h("div", { class: "loading-hint" }, unref(loadingStatusRef).hint) : h(Fragment),
            h("div", { class: "white-page-toggle", onClick: () => setWhitePage(!unref(whitePageRef2)) }, unref(whitePageRef2) ? "\u5DF2\u6DFB\u52A0\u7A7A\u767D\u9875" : "\u672A\u6DFB\u52A0\u7A7A\u767D\u9875")
          ]
        ),
        h(
          "a",
          { class: "prev-comic", disabled: unref(prevUrlRef) ? void 0 : "", href: unref(prevUrlRef) },
          "\u4E0A\u4E00\u9875"
        ),
        h("a", { class: "comic-title", href: unref(titleUrlRef) }, unref(titleRef)),
        h(
          "a",
          { class: "next-comic", disabled: unref(nextUrlRef) ? void 0 : "", href: unref(nextUrlRef) },
          "\u4E0B\u4E00\u9875"
        ),
        h("div", { class: "right-space" }, [
          h("select", { onChange: (event) => setDirectionMode(event.target.value) }, [
            h("option", { value: "rtl" /* RTL */, selected: unref(directionModeRef2) === "rtl" /* RTL */ }, "\u65E5\u6F2B\u6A21\u5F0F"),
            h("option", { value: "ltr" /* LTR */, selected: unref(directionModeRef2) === "ltr" /* LTR */ }, "\u666E\u901A\u6A21\u5F0F"),
            h("option", { value: "ttb" /* TTB */, selected: unref(directionModeRef2) === "ttb" /* TTB */ }, "\u56FD\u6F2B\u6A21\u5F0F")
          ])
        ])
      ]);
    }
  });

  // src/monkey/copymanga-enhance/scripts/newPage/component/App/style.css
  var style_default5 = ":root{--header-height: 30px;--body-height: calc(100dvh - var(--header-height))}*:has(>:is(.app-header,.app-body)){width:100dvw;height:100dvh;max-width:100dvw;max-height:100dvh;min-width:100dvw;min-height:100dvh;overflow:hidden;display:grid;grid-template-rows:var(--header-height) auto}:is(.app-header,.app-body){width:100%}\n";

  // src/monkey/copymanga-enhance/scripts/newPage/component/App/index.ts
  var App_default = defineComponent({
    setup() {
      useKeyWatcher();
      useMouseWatcher();
      onMounted(() => {
        GM_addStyle_default(style_default5);
      });
      return () => h(Fragment, [
        h(AppHeader_default, { class: "app-header" }),
        h(AppBody_default, { class: "app-body" }, "Comic Content")
      ]);
    }
  });

  // src/monkey/copymanga-enhance/scripts/newPage/index.ts
  var render = () => {
    const app = createApp({
      setup() {
        return () => h(App_default);
      }
    });
    app.mount("#app");
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
    GM_xmlhttpRequest({
      method: "GET",
      url: "https://unpkg.com/vue@3/dist/vue.global.prod.js",
      onload: (res) => {
        const script = document.createElement("script");
        script.textContent = res.responseText;
        document.head.appendChild(script);
        setTimeout(() => {
          render();
        }, 50);
      }
    });
  };
  setTimeout(() => {
    let cacheContent = storage_default.pageInfo;
    if (cacheContent?.images.length) {
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
