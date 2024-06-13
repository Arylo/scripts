"use strict";
(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // src/qinglong/moveVideo.ts
  var import_js_sh2 = __require("@js-sh/js-sh");

  // src/qinglong/utils/moveFiles.ts
  var import_js_sh = __require("@js-sh/js-sh");
  var moveFiles = (targetFilters, targetPath2) => {
    const pendingFilepaths = targetFilters.reduce((list, filter) => list.concat((0, import_js_sh.ls)(filter)), []);
    if (pendingFilepaths.length === 0) return false;
    console.log(pendingFilepaths);
    pendingFilepaths.forEach((p) => (0, import_js_sh.mv)(p, targetPath2));
  };

  // src/qinglong/moveVideo.ts
  var ROOT_PATH_KEY = "MV_VIDEO_ROOT_PATH";
  var TARGET_PATH_KEY = "MV_VIDEO_TARGET_PATH";
  var checkVariables = () => {
    let hasLostVariable = false;
    for (const key of [ROOT_PATH_KEY, TARGET_PATH_KEY]) {
      const val = process.env[key];
      if (!val) {
        console.error(`[x] Lost the environment variable (${key})`);
        hasLostVariable = true;
      } else {
        console.info(`[\u221A] Found the environment variable (${key}) => ${val}`);
      }
    }
    if (hasLostVariable) process.exit(1);
  };
  checkVariables();
  var {
    [ROOT_PATH_KEY]: rootPath,
    [TARGET_PATH_KEY]: targetPath
  } = process.env;
  (0, import_js_sh2.cd)(rootPath);
  moveFiles(["./**/*.mp4", "./**/*.mkv"], targetPath);
  console.log((0, import_js_sh2.ls)("./**/*.bt.xltd"));
})();
