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

  // src/qinglong/utils/genBatchCheckFn.ts
  var genBatchCheckFn = (checkFn) => {
    return (valueOrValues, { lostExit = true } = {}) => {
      const values = (Array.isArray(valueOrValues) ? valueOrValues : [valueOrValues]).filter((key) => typeof key === "string" && key.length > 0);
      let allPass = true;
      for (const val of values) {
        const result = checkFn(val);
        if (!result) allPass = false;
      }
      if (!allPass && lostExit) process.exit(1);
      return allPass;
    };
  };

  // src/qinglong/utils/logger.ts
  var pending = (...msg) => console.log("[ ]", ...msg);
  var success = (...msg) => console.log("[\u221A]", ...msg);
  var fail = (...msg) => console.log("[x]", ...msg);
  var info = (...msg) => console.log(">>>", ...msg);
  var logger = {
    pending,
    success,
    fail,
    info
  };
  var logger_default = logger;

  // src/qinglong/utils/checkVariables.ts
  var checkVariables = genBatchCheckFn((key) => {
    const val = process.env[key];
    if (!val) {
      logger_default.fail(`Lost the environment variable (${key})`);
      return false;
    }
    logger_default.success(`Found the environment variable (${key}) => ${val}`);
    return true;
  });

  // src/qinglong/moveVideo.ts
  var ROOT_PATH_KEY = "MV_VIDEO_ROOT_PATH";
  var TARGET_PATH_KEY = "MV_VIDEO_TARGET_PATH";
  checkVariables([ROOT_PATH_KEY, TARGET_PATH_KEY]);
  var {
    [ROOT_PATH_KEY]: rootPath,
    [TARGET_PATH_KEY]: targetPath
  } = process.env;
  (0, import_js_sh2.cd)(rootPath);
  moveFiles(["./**/*.mp4", "./**/*.mkv", "./**/*.avi"], targetPath);
  console.log((0, import_js_sh2.ls)("./**/*.bt.xltd"));
})();
