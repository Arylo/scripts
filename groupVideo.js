"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/qinglong/groupVideo.ts
  var import_fs = __toESM(__require("fs"));
  var import_path = __toESM(__require("path"));
  var import_js_sh = __require("@js-sh/js-sh");

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

  // src/qinglong/groupVideo.ts
  var ROOT_PATH_KEY = "GROUP_VIDEO_ROOT_PATH";
  var TARGET_PATH_KEY = "GROUP_VIDEO_TARGET_PATH";
  var FOLDER_PREFIX = "tag_";
  var FILE_EXT = [".mp4", ".mkv", ".avi"];
  var TAG_FILTER_FNS = [
    (file) => {
      return file.stat.ctime.getFullYear().toString();
    },
    (file) => {
      const matches = [
        matchText(file.name, /^(FC2\s?PPV)\s+\d+$/i, "FC2PPV"),
        matchText(file.name, /^(HEYZO)\s+\d+$/i),
        matchText(file.name, /^\d+-\d+-(carib)$/i),
        matchText(file.name, /^\d+_\d+-(10mu)$/i),
        matchText(file.name, /^(\d*[A-Z]+)-\d+$/i)
      ];
      return matches.filter(Boolean)[0];
    }
  ];
  function matchText(text, reg, commonText) {
    const matched = text.match(reg);
    return matched ? commonText ?? matched[1] : void 0;
  }
  checkVariables([ROOT_PATH_KEY, TARGET_PATH_KEY]);
  var {
    [ROOT_PATH_KEY]: rootPath,
    [TARGET_PATH_KEY]: targetPath
  } = process.env;
  var devNode;
  genBatchCheckFn((p) => {
    const stat = import_fs.default.statSync(p);
    if (!stat.isDirectory()) {
      logger_default.fail(`The path (${p}) is not a directory`);
      return false;
    }
    if (!devNode) {
      devNode = stat.dev;
    }
    logger_default.info(`The device node of the path (${p}) is ${stat.dev}`);
    if (devNode !== stat.dev) {
      logger_default.fail(`The device node of the path (${p}) is different from the other path`);
      return false;
    }
    return true;
  })([rootPath, targetPath]);
  var fileListMap = FILE_EXT.reduce((acc, ext) => {
    return [
      ...acc,
      ...(0, import_js_sh.ls)(import_path.default.resolve(rootPath, `./*${ext}`))
    ];
  }, []).map((p) => {
    const stat = import_fs.default.statSync(p);
    const basename = import_path.default.basename(p);
    const baseObj = Object.freeze({
      realPath: p,
      basename,
      name: import_path.default.basename(p, import_path.default.extname(p)),
      stat,
      ino: stat.ino
    });
    const { stat: _, ...restObj } = baseObj;
    return {
      ...restObj,
      tags: TAG_FILTER_FNS.map((fn) => fn(baseObj)).filter(Boolean).map((tag) => tag?.toUpperCase())
    };
  });
  var tagSet = fileListMap.reduce((set, { tags }) => {
    for (const tag of tags) {
      set.add(tag.toString());
    }
    return set;
  }, /* @__PURE__ */ new Set());
  for (const tag of [...tagSet].sort()) {
    logger_default.info(`Start to process the tag (${tag}) ...`);
    const targetFolderPath = import_path.default.resolve(targetPath, `${FOLDER_PREFIX}${tag}`);
    if (!import_fs.default.existsSync(targetFolderPath)) {
      logger_default.pending(`Create the folder (${targetFolderPath}) ...`);
      import_fs.default.mkdirSync(targetFolderPath, { recursive: true });
      logger_default.success(`Create the folder (${targetFolderPath}) ... Done`);
    } else {
      logger_default.info(`The folder (${targetFolderPath}) has been created`);
    }
    const pendingFiles = fileListMap.filter((file) => file.tags.includes(tag));
    import_fs.default.readdirSync(targetFolderPath).filter((filename) => filename !== pendingFiles.find((file) => file.basename === filename)?.basename).forEach((filename) => {
      const targetFilePath = import_path.default.resolve(targetFolderPath, filename);
      logger_default.pending(`Unlink the file (${targetFilePath}) ...`);
      import_fs.default.unlinkSync(targetFilePath);
      logger_default.success(`Unlink the file (${targetFilePath}) ... Done`);
    });
    for (const file of pendingFiles) {
      const targetFilePath = import_path.default.resolve(targetFolderPath, file.basename);
      if (!import_fs.default.existsSync(targetFilePath)) {
        logger_default.pending(`Link the file (${file.realPath}) to ${targetFilePath} ...`);
        import_fs.default.linkSync(file.realPath, targetFilePath);
        logger_default.success(`Link the file (${file.realPath}) to ${targetFilePath} ... Done`);
      } else if (file.ino === import_fs.default.statSync(targetFilePath).ino) {
        logger_default.info(`The file (${file.realPath}) has been linked to ${targetFilePath}`);
      } else if (file.ino !== import_fs.default.statSync(targetFilePath).ino) {
        logger_default.pending(`Unlink the file (${targetFilePath}) ...`);
        import_fs.default.unlinkSync(targetFilePath);
        logger_default.success(`Unlink the file (${targetFilePath}) ... Done`);
        logger_default.pending(`Link the file (${file.realPath}) to ${targetFilePath} ...`);
        import_fs.default.linkSync(file.realPath, targetFilePath);
        logger_default.success(`Link the file (${file.realPath}) to ${targetFilePath} ... Done`);
      }
    }
    logger_default.info(`Finish to process the tag (${tag})`);
  }
})();
