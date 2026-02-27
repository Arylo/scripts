// ==UserScript==
// @name Enhance the copy manga site
// @name:en Enhance the copy manga site
// @name:zh 快乐看拷贝
// @name:zh-Hans 快乐看拷贝
// @name:zh-Hant 快樂看拷貝
// @name:zh-CN 快乐看拷贝
// @name:zh-HK 快樂看拷貝
// @name:zh-MO 快樂看拷貝
// @name:zh-TW 快樂看拷貝
// @name:zh-SG 快乐看拷贝
// @name:zh-MY 快乐看拷贝
// @description support ultra-wide screen, adaptive image height, quick page turning, keyboard operation
// @description:en support ultra-wide screen, adaptive image height, quick page turning, keyboard operation
// @description:zh 对开布局、支持带鱼屏、自适应图片高度、快捷翻页、支持键盘操作
// @description:zh-Hans 对开布局、支持带鱼屏、自适应图片高度、快捷翻页、支持键盘操作
// @description:zh-Hant 對開佈局、支持帶魚屏、自適應圖片高度、快捷翻頁、支持鍵盤操作
// @description:zh-CN 对开布局、支持带鱼屏、自适应图片高度、快捷翻页、支持键盘操作
// @description:zh-HK 對開佈局、支持帶魚屏、自適應圖片高度、快捷翻頁、支持鍵盤操作
// @description:zh-MO 對開佈局、支持帶魚屏、自適應圖片高度、快捷翻頁、支持鍵盤操作
// @description:zh-TW 對開佈局、支持帶魚屏、自適應圖片高度、快捷翻頁、支持鍵盤操作
// @description:zh-SG 对开布局、支持带鱼屏、自适应图片高度、快捷翻页、支持键盘操作
// @description:zh-MY 对开布局、支持带鱼屏、自适应图片高度、快捷翻页、支持键盘操作
// @version 51
// @author Arylo Yeung <arylo.open@gmail.com>
// @connect unpkg.com
// @license MIT
// @match https://copymanga.com/comic/*
// @match https://*.copymanga.com/comic/*
// @match https://copymanga.org/comic/*
// @match https://*.copymanga.org/comic/*
// @match https://copymanga.net/comic/*
// @match https://*.copymanga.net/comic/*
// @match https://copymanga.info/comic/*
// @match https://*.copymanga.info/comic/*
// @match https://copymanga.site/comic/*
// @match https://*.copymanga.site/comic/*
// @match https://copymanga.tv/comic/*
// @match https://*.copymanga.tv/comic/*
// @match https://mangacopy.com/comic/*
// @match https://*.mangacopy.com/comic/*
// @match https://copy-manga.com/comic/*
// @match https://*.copy-manga.com/comic/*
// @match https://copy20.com/comic/*
// @match https://*.copy20.com/comic/*
// @match https://copy2000.site/comic/*
// @match https://*.copy2000.site/comic/*
// @match https://2025copy.com/comic/*
// @match https://*.2025copy.com/comic/*
// @match https://2026copy.com/comic/*
// @match https://*.2026copy.com/comic/*
// @require https://unpkg.com/vue@3/dist/vue.global.prod.js
// @resource vue https://unpkg.com/vue@3/dist/vue.global.prod.js
// @homepage https://github.com/Arylo/scripts#readme
// @supportURL https://github.com/Arylo/scripts/issues
// @downloadURL https://raw.githubusercontent.com/Arylo/scripts/monkey/copymanga-enhance.user.js
// @updateURL https://raw.githubusercontent.com/Arylo/scripts/monkey/copymanga-enhance.meta.js
// @run-at document-end
// @grant GM_getResourceText
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==
"use strict";
(() => {
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

  // src/monkey/copymanga-enhance/scripts/detail/newPage/constant.ts
  var GRID_CELL_TYPE = {
    PREV: "PREV",
    NEXT: "NEXT",
    SPACE: "SPACE"
  };
  var GRID_MAP = (() => {
    const P = GRID_CELL_TYPE.PREV;
    const N = GRID_CELL_TYPE.NEXT;
    const S = GRID_CELL_TYPE.SPACE;
    return [
      [P, P, P, P, P, P, P],
      [P, P, P, P, P, P, P],
      [P, P, S, S, N, N, N],
      [P, P, S, S, N, N, N],
      [P, P, S, S, N, N, N]
    ];
  })();
  var GRID_COLUMN = Math.max(...GRID_MAP.map((row) => row.length));
  var GRID_ROW = GRID_MAP.length;
  var ACTION_GRID_MAP = GRID_MAP.reduce((acc, row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      acc[cell] = acc[cell] || [];
      acc[cell].push(rowIndex * GRID_COLUMN + cellIndex + 1);
    });
    return acc;
  }, {});

  // packages/monkey/gm-polyfill/GM_addStyle.ts
  function GM_addStyle(...args) {
    if (typeof window.GM_addStyle === "function") {
      return window.GM_addStyle(...args);
    }
    const [cssContent] = args;
    const head = document.getElementsByTagName("head")[0];
    if (head) {
      const styleElement = document.createElement("style");
      styleElement.setAttribute("type", "text/css");
      styleElement.textContent = cssContent;
      head.appendChild(styleElement);
      return styleElement;
    }
    return null;
  }

  // packages/monkey/gm-polyfill/GM_getResourceText.ts
  function GM_getResourceText(...args) {
    if (typeof window.GM_getResourceText !== "function") {
      throw new Error("GM_getResourceText is not available");
    }
    return window.GM_getResourceText(...args);
  }

  // packages/monkey/gm-polyfill/GM_getValue.ts
  function GM_getValue(...args) {
    if (typeof window.GM_getValue !== "function") {
      throw new Error("GM_getValue is not available");
    }
    return window.GM_getValue(...args);
  }

  // packages/monkey/gm-polyfill/GM_setValue.ts
  function GM_setValue(...args) {
    if (typeof window.GM_setValue !== "function") {
      throw new Error("GM_setValue is not available");
    }
    return window.GM_setValue(...args);
  }

  // packages/general/genStorage/shared.ts
  function defaultSerializer(value) {
    return JSON.stringify(value);
  }
  function defaultDeserializer(value) {
    return JSON.parse(value);
  }
  function resolveStorageOptions(options) {
    const {
      serializer = defaultSerializer,
      deserializer = defaultDeserializer,
      useCache = true
    } = options || {};
    return {
      serializer,
      deserializer,
      useCache,
      cacheMap: /* @__PURE__ */ new Map()
    };
  }
  function getCachedValue(cacheMap, useCache, key) {
    return useCache ? cacheMap.get(key) : null;
  }
  function setCachedValue(cacheMap, useCache, key, value) {
    if (useCache) {
      cacheMap.set(key, value);
    }
  }
  function hasStorageValue(value) {
    return typeof value !== "undefined" && value !== null;
  }

  // packages/general/genStorage/genStorage.ts
  function genStorage(options) {
    const { serializer, deserializer, useCache, cacheMap } = resolveStorageOptions(options);
    function getter(key, defaultValue) {
      const cached = getCachedValue(cacheMap, useCache, key);
      const result = hasStorageValue(cached) ? cached : options?.load(key);
      if (hasStorageValue(result)) {
        return deserializer(result);
      }
      return defaultValue;
    }
    return {
      get: getter,
      set(key, value) {
        const result = serializer(value);
        options?.save(key, result);
        setCachedValue(cacheMap, useCache, key, result);
      }
    };
  }

  // src/monkey/copymanga-enhance/storages/directionMode.ts
  var getDirectionModeKey = () => {
    const comic2 = parseConstant_default(location?.pathname).comic;
    return Object.freeze([comic2, "direction", "mode"].join("."));
  };
  var directionModeStorage = genStorage({
    save: (key, value) => GM_setValue(key, value),
    load: (key) => GM_getValue(key, null)
  });

  // src/monkey/copymanga-enhance/scripts/table/index.ts
  var hasJapanese = (text) => /[\u0800-\u4e00]/.test(text);
  var table_default = () => {
    const directionModeKey = getDirectionModeKey();
    const directionMode = directionModeStorage.get(directionModeKey);
    if (directionMode) return;
    const changeTiaoTag = $('a[href^="/comics?theme=changtiao"]');
    if (changeTiaoTag.length) {
      directionModeStorage.set(directionModeKey, "ttb" /* TTB */);
      return;
    }
    const bookName = $("h6").text();
    if (hasJapanese(bookName)) {
      console.log("Found Japanese book name");
      directionModeStorage.set(directionModeKey, "rtl" /* RTL */);
      return;
    }
    const bookAliasName = $("li:has(h6) + li > p").text();
    if (hasJapanese(bookAliasName)) {
      console.log("Found Japanese book alias name");
      directionModeStorage.set(directionModeKey, "rtl" /* RTL */);
      return;
    }
    const authors = $('a[href^="/author"]').text();
    if (hasJapanese(authors)) {
      console.log("Found Japanese author");
      directionModeStorage.set(directionModeKey, "rtl" /* RTL */);
      return;
    }
  };

  // src/monkey/copymanga-enhance/scripts/detail/template.html
  var template_default = '<div id="app" class="grid h-dvh max-h-dvh max-w-dvw min-h-dvh min-w-dvw overflow-hidden w-dvw"></div>';

  // packages/monkey/gm-vue/shared.ts
  function getVueValue(key) {
    return Vue[key];
  }

  // packages/monkey/gm-vue/global.ts
  var createApp = /* @__PURE__ */ getVueValue("createApp");
  var defineComponent = /* @__PURE__ */ getVueValue("defineComponent");

  // packages/monkey/gm-vue/render.ts
  var h = /* @__PURE__ */ getVueValue("h");
  var mergeProps = /* @__PURE__ */ getVueValue("mergeProps");

  // packages/monkey/gm-vue/component.ts
  var Fragment = /* @__PURE__ */ getVueValue("Fragment");

  // packages/monkey/gm-vue/composition-api.ts
  var readonly = /* @__PURE__ */ getVueValue("readonly");
  var ref = /* @__PURE__ */ getVueValue("ref");
  var computed = /* @__PURE__ */ getVueValue("computed");
  var watch = /* @__PURE__ */ getVueValue("watch");
  var unref = /* @__PURE__ */ getVueValue("unref");
  var onMounted = /* @__PURE__ */ getVueValue("onMounted");

  // src/monkey/copymanga-enhance/scripts/detail/storages/imageWidth.ts
  var getImageWidthKey = () => {
    const comic2 = parseConstant_default(location?.pathname).comic;
    return Object.freeze([comic2, "image", "width"].join("."));
  };
  var imageWidthStorage = genStorage({
    save: (key, value) => GM_setValue(key, value),
    load: (key) => GM_getValue(key, null)
  });

  // src/monkey/copymanga-enhance/scripts/detail/storages/whitePage.ts
  var getWhitePageKey = () => {
    const comic2 = parseConstant_default(location?.pathname).comic;
    const chapter2 = parseConstant_default(location?.pathname).chapter;
    return Object.freeze([comic2, chapter2, "hasWhitePage"].join("."));
  };
  var whitePageStorage = genStorage({
    save: (key, value) => localStorage.setItem(key, value),
    load: (key) => localStorage.getItem(key)
  });

  // src/monkey/copymanga-enhance/scripts/detail/storages/pageInfo.ts
  var getPageInfoKey = () => {
    const comic2 = parseConstant_default(location?.pathname).comic;
    const chapter2 = parseConstant_default(location?.pathname).chapter;
    return Object.freeze([comic2, chapter2, "info"].join("."));
  };
  var pageInfoStorage = genStorage({
    save: (key, value) => sessionStorage.setItem(key, value),
    load: (key) => sessionStorage.getItem(key)
  });

  // src/monkey/copymanga-enhance/scripts/detail/storage.ts
  var storage_default = {
    get imageWidth() {
      const imageWidthKey = getImageWidthKey();
      return imageWidthStorage.get(imageWidthKey, 70);
    },
    set imageWidth(value) {
      const imageWidthKey = getImageWidthKey();
      imageWidthStorage.set(imageWidthKey, value);
    },
    get whitePage() {
      const whitePageKey = getWhitePageKey();
      return whitePageStorage.get(whitePageKey, false);
    },
    set whitePage(value) {
      const whitePageKey = getWhitePageKey();
      whitePageStorage.set(whitePageKey, value);
    },
    get pageInfo() {
      const pageInfoKey = getPageInfoKey();
      const defaultValue = {
        images: [],
        title: void 0,
        prevUrl: void 0,
        nextUrl: void 0,
        menuUrl: void 0
      };
      return pageInfoStorage.get(pageInfoKey, defaultValue);
    },
    set pageInfo(value) {
      const pageInfoKey = getPageInfoKey();
      pageInfoStorage.set(pageInfoKey, value);
    },
    get directionMode() {
      const directionModeKey = getDirectionModeKey();
      return directionModeStorage.get(directionModeKey, "rtl" /* RTL */);
    },
    set directionMode(value) {
      const directionModeKey = getDirectionModeKey();
      directionModeStorage.set(directionModeKey, value);
    }
  };

  // src/monkey/copymanga-enhance/scripts/detail/newPage/hooks/usePageInfo.ts
  function usePageInfo() {
    const rawData = ref(storage_default.pageInfo);
    onMounted(() => {
      rawData.value = storage_default.pageInfo;
    });
    return readonly(rawData);
  }

  // src/monkey/copymanga-enhance/scripts/detail/newPage/hooks/useWhitePage.ts
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

  // packages/browser/genScrollTo/index.ts
  var genScrollTo = (el) => (top, isSmooth = false) => el.scrollTo({
    top,
    left: 0,
    behavior: isSmooth ? "smooth" : "auto"
  });
  var genScrollTo_default = genScrollTo;

  // src/monkey/copymanga-enhance/scripts/detail/newPage/hooks/useScrollBy.ts
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

  // src/monkey/copymanga-enhance/scripts/detail/newPage/hooks/useKeyWatcher.ts
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
            if (prevUrl) window.location.href = prevUrl;
            break;
          case "ArrowRight".toLowerCase():
            if (nextUrl) window.location.href = nextUrl;
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

  // packages/general/throttle/index.ts
  function throttle(fn, wait = 300, options = {}) {
    const { leading = true, trailing = true } = options;
    let timer = null;
    let lastInvokeTime = 0;
    let lastArgs = null;
    let lastThis;
    const invoke = (time) => {
      lastInvokeTime = time;
      const args = lastArgs;
      const thisArg = lastThis;
      lastArgs = null;
      lastThis = void 0;
      fn.apply(thisArg, args);
    };
    const shouldInvoke = (time) => {
      if (lastInvokeTime === 0) return true;
      return time - lastInvokeTime >= wait;
    };
    const remainingWait = (time) => {
      const elapsed = time - lastInvokeTime;
      return Math.max(wait - elapsed, 0);
    };
    const timerExpired = () => {
      timer = null;
      if (trailing && lastArgs) {
        invoke(Date.now());
      }
    };
    const throttled = function(...args) {
      const now = Date.now();
      if (!leading && lastInvokeTime === 0) {
        lastInvokeTime = now;
      }
      lastArgs = args;
      lastThis = this;
      if (shouldInvoke(now)) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        invoke(now);
        return;
      }
      if (!timer && trailing) {
        timer = setTimeout(timerExpired, remainingWait(now));
      }
    };
    throttled.cancel = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastInvokeTime = 0;
      lastArgs = null;
      lastThis = void 0;
    };
    throttled.flush = () => {
      if (!timer || !lastArgs) return;
      clearTimeout(timer);
      timer = null;
      invoke(Date.now());
    };
    return throttled;
  }

  // src/monkey/copymanga-enhance/scripts/detail/newPage/hooks/useMouseGrid.ts
  var mouseFocusRef = ref(-1);
  function useMouseGrid() {
    const mouseGrid = readonly(mouseFocusRef);
    function setter(value) {
      mouseFocusRef.value = value;
    }
    return [mouseGrid, setter];
  }

  // src/monkey/copymanga-enhance/scripts/detail/newPage/hooks/useMouseWatcher.ts
  function useMouseWatcher() {
    const { scrollUp, scrollDown } = useScrollBy();
    const [mouseGridRef, setMouseGrid] = useMouseGrid();
    onMounted(() => {
      const appBody = document.querySelector(".app-body");
      if (!appBody) return;
      const getGridIndex = (x, y) => {
        const COUNT_COLUMN = GRID_COLUMN;
        const COUNT_ROW = GRID_ROW;
        const rect = appBody.getBoundingClientRect();
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return -1;
        const colWidth = rect.width / COUNT_COLUMN;
        const rowHeight = rect.height / COUNT_ROW;
        const col = Math.min(COUNT_COLUMN - 1, Math.max(0, Math.floor((x - rect.left) / colWidth)));
        const row = Math.min(COUNT_ROW - 1, Math.max(0, Math.floor((y - rect.top) / rowHeight)));
        return row * COUNT_COLUMN + col + 1;
      };
      const handleGridMove = throttle((info) => {
        const gridIndex = getGridIndex(info.x, info.y);
        const currentGridIndex = unref(mouseGridRef);
        if (gridIndex === currentGridIndex) return;
        setMouseGrid(gridIndex);
      }, 25);
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
      appBody.addEventListener("mouseleave", () => {
        setMouseGrid(-1);
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

  // src/monkey/copymanga-enhance/scripts/detail/newPage/hooks/useDirectionMode.ts
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

  // src/monkey/copymanga-enhance/scripts/detail/newPage/component/AppBody/style.css
  var style_default = ".direction-wrapper{max-height:var(--body-height);overflow-y:scroll}.wrapper{flex-basis:100%;justify-content:center}@media (max-aspect-ratio: 5 / 3){.wrapper:has(>.white-page){display:none}}@media (min-aspect-ratio: 5 / 3){:is(.ltr,.rtl) .wrapper:has(>.portrait){flex-basis:50%}.wrapper{order:attr(data-index number)}.wrapper[data-side=L]{justify-content:flex-end;padding-left:5px}.wrapper[data-side=R]{justify-content:flex-start;padding-right:5px}}@media (min-aspect-ratio: 5 / 3) and (max-aspect-ratio: 9 / 3){:is(.ltr,.rtl) .wrapper:has(>.white-page):nth-last-child(2),:is(.ltr,.rtl) .wrapper:has(>.white-page):nth-last-child(2)+.wrapper:has(>.white-page){display:none}}@media (min-aspect-ratio: 9 / 3){:is(.ltr,.rtl) .wrapper:has(>.portrait){flex-basis:25%}}\n";

  // src/monkey/copymanga-enhance/scripts/detail/newPage/component/WhitePage/index.ts
  var WhitePage_default = defineComponent({
    props: {
      class: {
        type: String,
        default: () => void 0
      }
    },
    setup(props) {
      return () => h(
        "div",
        mergeProps({
          class: "white-page portrait size-px"
        }, props)
      );
    }
  });

  // packages/general/flow/index.ts
  function flow(source, ...fns) {
    return fns.reduce((prev, fn) => fn(prev), source);
  }

  // src/monkey/copymanga-enhance/scripts/detail/newPage/hooks/useImageInfoMap.ts
  var statusMap = ref([]);
  function useImageInfoMap() {
    return statusMap;
  }

  // src/monkey/copymanga-enhance/scripts/detail/newPage/hooks/useRawImageList.ts
  function useRawImageList() {
    const pageInfoRef = usePageInfo();
    const imagesRef = computed(() => unref(pageInfoRef).images ?? []);
    return imagesRef;
  }

  // src/monkey/copymanga-enhance/scripts/detail/newPage/hooks/useImageWidth.ts
  var imageWidthRef = ref(100);
  function useImageWidth() {
    const imageWidth = readonly(imageWidthRef);
    function setter(value) {
      imageWidthRef.value = value;
      storage_default.imageWidth = value;
    }
    onMounted(() => {
      setter(storage_default.imageWidth);
    });
    return [imageWidth, setter];
  }

  // src/monkey/copymanga-enhance/scripts/detail/newPage/component/Image/index.ts
  var Image_default = defineComponent({
    props: {
      src: {
        type: String,
        required: true
      }
    },
    setup(props, { emit }) {
      const pageType = ref("portrait" /* PORTRAIT */);
      const rawImageListRef = useRawImageList();
      const imageInfoMapRef = useImageInfoMap();
      const [directionModeRef2] = useDirectionMode();
      const [imageWidthRef2] = useImageWidth();
      const onLoad = (e) => {
        const index = unref(rawImageListRef).indexOf(props.src);
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
      return () => h(
        "img",
        {
          class: `comic-image ${unref(pageType)} ltr:w-auto ltr:h-(--body-height) rtl:w-auto rtl:h-(--body-height)`,
          style: unref(directionModeRef2) === "ttb" /* TTB */ ? { "max-width": `${unref(imageWidthRef2)}%` } : {},
          src: props.src,
          onLoad
        }
      );
    }
  });

  // src/monkey/copymanga-enhance/scripts/detail/newPage/hooks/useImageList.ts
  function useImageList() {
    const rawImageListRef = useRawImageList();
    const infoMapRef = useImageInfoMap();
    const [whitePageRef2] = useWhitePage();
    const [directionModeRef2] = useDirectionMode();
    onMounted(() => refresh());
    watch(
      [
        whitePageRef2,
        directionModeRef2,
        rawImageListRef,
        infoMapRef
      ],
      () => refresh()
    );
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
      if (tempList[tempList.length - 1][0].props.pageType === "portrait" /* PORTRAIT */ && tempList[tempList.length - 1].length % 4 !== 0) {
        const groupIndex = tempList.length - 1;
        const group = tempList[groupIndex];
        Array.from({ length: 4 - group.length % 4 }).forEach((_, index) => {
          group.push({
            component: WhitePage_default,
            props: { key: `white-page-group-${groupIndex + index}-end`, class: "auto end", pageType: "portrait" /* PORTRAIT */ }
          });
        });
      }
      return tempList.flat();
    };
    const injectDataIndex = (list) => {
      let portraitCount = 0;
      return list.map((item, index) => {
        let targetIndex = index + 1;
        let side = "A";
        if (item.props.pageType === "landscape" /* LANDSCAPE */) {
          portraitCount = 0;
          side = "A";
        } else {
          portraitCount++;
          if ("rtl" /* RTL */ === unref(directionModeRef2)) {
            if (portraitCount % 2 === 0) {
              targetIndex -= 1;
            } else {
              targetIndex += 1;
            }
            side = portraitCount % 2 === 1 ? "R" : "L";
          }
          if ("ltr" /* LTR */ === unref(directionModeRef2)) {
            side = portraitCount % 2 === 1 ? "L" : "R";
          }
        }
        return {
          ...item,
          props: {
            ...item.props,
            "data-index": targetIndex,
            "data-side": side
          }
        };
      });
    };
    const imagesRef = ref([]);
    function refresh() {
      const list = flow(
        unref(rawImageListRef),
        parseImages,
        addFirstWhitePage,
        injectWhitePages,
        injectDataIndex
      );
      imagesRef.value = list;
    }
    return [readonly(imagesRef), refresh];
  }

  // src/monkey/copymanga-enhance/scripts/detail/newPage/component/AppBody/index.ts
  var AppBody_default = defineComponent({
    setup() {
      onMounted(() => {
        GM_addStyle(style_default);
      });
      const [imagesRef] = useImageList();
      const [directionModeRef2] = useDirectionMode();
      const [mouseGridRef] = useMouseGrid();
      return () => h(
        "div",
        {
          class: cc([
            "app-body max-w-dvw",
            unref(directionModeRef2),
            { "cursor-pointer": [...ACTION_GRID_MAP.PREV, ...ACTION_GRID_MAP.NEXT].includes(unref(mouseGridRef)) }
          ])
        },
        [
          h(
            "div",
            {
              class: cc([
                "direction-wrapper",
                "w-dvw",
                "flex flex-wrap justify-center",
                "snap-mandatory ltr:snap-y rtl:snap-y"
              ])
            },
            unref(imagesRef).map(({ component, props }) => h(
              "div",
              {
                class: cc([
                  "wrapper",
                  "ltr:h-(--body-height) rtl:h-(--body-height)",
                  "ltr:snap-center rtl:snap-center",
                  "flex",
                  { "hidden": unref(directionModeRef2) === "ttb" /* TTB */ && component === WhitePage_default }
                ]),
                ...Object.fromEntries(Object.entries(props).filter(([k]) => k.startsWith("data-")))
              },
              [h(component, { ...props })]
            ))
          )
        ]
      );
    }
  });

  // src/monkey/copymanga-enhance/scripts/detail/newPage/component/AppHeader/style.css
  var style_default2 = ".app-header{grid-template-columns:1fr 60px auto 60px 1fr}\n";

  // src/monkey/copymanga-enhance/scripts/detail/newPage/component/AppHeader/index.ts
  var ImageWidths = [
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20
  ].sort((a, b) => b - a);
  var AppHeader_default = defineComponent({
    setup() {
      const pageInfoRef = usePageInfo();
      const titleRef = computed(() => unref(pageInfoRef).title);
      const titleUrlRef = computed(() => unref(pageInfoRef).menuUrl);
      const prevUrlRef = computed(() => unref(pageInfoRef).prevUrl);
      const nextUrlRef = computed(() => unref(pageInfoRef).nextUrl);
      const rawImageListRef = useRawImageList();
      const imageInfoMapRef = useImageInfoMap();
      const loadingStatusRef = computed(() => {
        const total = unref(rawImageListRef).length;
        const loaded = unref(imageInfoMapRef).filter((info) => info).length;
        return {
          total,
          loaded,
          hint: loaded === total ? "" : `\u5DF2\u52A0\u8F7D (${loaded} / ${total})`
        };
      });
      const [whitePageRef2, setWhitePage] = useWhitePage();
      onMounted(() => {
        GM_addStyle(style_default2);
      });
      const [directionModeRef2, setDirectionMode] = useDirectionMode();
      const [imageWidthRef2, setImageWidth] = useImageWidth();
      return () => h(
        "div",
        {
          class: cc([
            "app-header",
            "max-w-dvw",
            "grid items-center gap-x-[5px]"
          ])
        },
        [
          h(
            "div",
            {
              class: cc([
                "left-space",
                "flex flex-row justify-end items-center gap-x-[5px]"
              ])
            },
            [
              unref(loadingStatusRef).hint ? h("div", { class: "loading-hint text-white" }, unref(loadingStatusRef).hint) : h(Fragment),
              h("select", { onChange: (event) => setDirectionMode(event.target.value) }, [
                h("option", { value: "rtl" /* RTL */, selected: unref(directionModeRef2) === "rtl" /* RTL */ }, "\u65E5\u6F2B\u6A21\u5F0F"),
                h("option", { value: "ltr" /* LTR */, selected: unref(directionModeRef2) === "ltr" /* LTR */ }, "\u666E\u901A\u6A21\u5F0F"),
                h("option", { value: "ttb" /* TTB */, selected: unref(directionModeRef2) === "ttb" /* TTB */ }, "\u56FD\u6F2B\u6A21\u5F0F")
              ])
            ]
          ),
          h(
            "a",
            {
              class: cc([
                "prev-comic",
                "text-center",
                {
                  "text-white cursor-pointer": unref(prevUrlRef),
                  "text-gray!": !unref(prevUrlRef)
                }
              ]),
              href: unref(prevUrlRef)
            },
            "\u4E0A\u4E00\u9875"
          ),
          h("a", { class: "comic-title text-white cursor-pointer", href: unref(titleUrlRef) }, unref(titleRef)),
          h(
            "a",
            {
              class: cc([
                "next-comic",
                "text-center",
                {
                  "text-white cursor-pointer": unref(nextUrlRef),
                  "text-gray!": !unref(nextUrlRef)
                }
              ]),
              href: unref(nextUrlRef)
            },
            "\u4E0B\u4E00\u9875"
          ),
          h(
            "div",
            {
              class: cc([
                "right-space",
                "flex flex-row justify-start items-center gap-x-[5px]"
              ])
            },
            [
              ["rtl" /* RTL */, "ltr" /* LTR */].includes(unref(directionModeRef2)) ? h("div", { class: "white-page-toggle text-white cursor-pointer", onClick: () => setWhitePage(!unref(whitePageRef2)) }, unref(whitePageRef2) ? "\u5DF2\u52A0\u7A7A\u767D\u9875" : "\u672A\u52A0\u7A7A\u767D\u9875") : h(Fragment),
              ["ttb" /* TTB */].includes(unref(directionModeRef2)) ? h("select", { onChange: (event) => setImageWidth(Number(event.target.value)) }, ImageWidths.map((v) => {
                return h("option", { value: v, selected: unref(imageWidthRef2) === v }, `${v}%`);
              })) : h(Fragment)
            ]
          )
        ]
      );
    }
  });

  // src/monkey/copymanga-enhance/scripts/detail/newPage/component/App/style.css
  var style_default3 = ":root{--header-height: 30px;--body-height: calc(100dvh - var(--header-height))}#app{grid-template-rows:var(--header-height) auto}\n";

  // src/monkey/copymanga-enhance/scripts/detail/newPage/component/App/index.ts
  var App_default = defineComponent({
    setup() {
      useKeyWatcher();
      useMouseWatcher();
      onMounted(() => {
        GM_addStyle(style_default3);
      });
      return () => h(Fragment, [
        h(AppHeader_default, { class: "app-header" }),
        h(AppBody_default, { class: "app-body" }, "Comic Content")
      ]);
    }
  });

  // src/monkey/copymanga-enhance/scripts/detail/newPage/tailwind.css
  var tailwind_default = ".cursor-pointer{cursor:pointer}.size-px{width:1px;height:1px}.w-dvw{width:100dvw}.min-w-dvw{min-width:100dvw}.max-w-dvw{max-width:100dvw}.h-dvh{height:100dvh}.min-w-dvw{min-height:100dvh}.max-h-dvh{max-height:100dvh}.h-\\(--body-height\\){height:var(--body-height)}.max-h-\\(--body-height\\){max-height:var(--body-height)}.grid{display:grid}.flex{display:flex}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.justify-start{justify-content:flex-start}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.items-center{align-items:center}.basic-\\[33\\%\\]{flex-basis:33%}.basic-\\[50\\%\\]{flex-basis:50%}.basic-\\[100\\%\\]{flex-basis:100%}.gap-x-\\[5px\\]{column-gap:5px}.hidden{display:none}.overflow-hidden{overflow:hidden}.overflow-auto{overflow:auto}.overflow-x-hidden{overflow-x:hidden}.overflow-y-auto{overflow-y:auto}.text-white{color:#fff}.text-gray{color:gray}.text-gray\\!{color:gray!important}.text-center{text-align:center}.snap-mandatory{--scroll-snap-strictness: mandatory}.ttb .ttb\\:block,.ltr .ltr\\:block,.rtl .rtl\\:block{display:block}.ttb .ttb\\:flex,.ltr .ltr\\:flex,.rtl .rtl\\:flex{display:flex}.ttb .ttb\\:hidden,.ltr .ltr\\:hidden,.rtl .rtl\\:hidden{display:none}.ltr .ltr\\:snap-y,.rtl .rtl\\:snap-y{scroll-snap-type:y var(--scroll-snap-strictness)}.ltr .ltr\\:snap-center,.rtl .rtl\\:snap-center{scroll-snap-align:center}.ltr .ltr\\:w-auto,.rtl .rtl\\:w-auto{width:auto}.ltr .ltr\\:h-\\(--body-height\\),.rtl .rtl\\:h-\\(--body-height\\){height:var(--body-height)}\n";

  // src/monkey/copymanga-enhance/scripts/detail/newPage/index.ts
  var render = () => {
    const app = createApp({
      setup() {
        GM_addStyle(tailwind_default);
        return () => h(App_default);
      }
    });
    app.mount("#app");
  };

  // src/monkey/copymanga-enhance/scripts/detail/old.ts
  var getCurrentCount = () => $(".comicContent-list > li > img").length;
  var getTotalCount = () => Number(document.getElementsByClassName("comicCount")[0].innerText);
  var windowScrollTo = genScrollTo_default(window);
  var pre = -1;
  var refreshImage = (cb) => {
    const nextTime = 15;
    let [cur, total] = [getCurrentCount(), getTotalCount()];
    if (pre !== cur) console.log("Process:", getCurrentCount(), "/", getTotalCount());
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

  // src/monkey/copymanga-enhance/scripts/detail/index.ts
  var renderNewPage = async () => {
    console.info("PageInfo:", storage_default.pageInfo);
    windowScrollTo(0);
    document.body.innerHTML = template_default;
    console.info("Start request vue library");
    const textContent = await GM_getResourceText("vue");
    const script = document.createElement("script");
    script.textContent = textContent;
    document.head.appendChild(script);
    setTimeout(() => {
      console.info("Start render new page");
      render();
    }, 50);
  };
  var detail_default = () => {
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
  };

  // src/monkey/copymanga-enhance/index.ts
  var { comic, chapter } = parseConstant_default(location?.pathname);
  if (comic && chapter) {
    console.log("start detail mode");
    detail_default();
  } else if (comic) {
    console.log("start table mode");
    table_default();
  }
})();
