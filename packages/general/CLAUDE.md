# CLAUDE.md

本文件夹下储存通用Javascript 库, 该库皆能在浏览器环境下或node.js 环境下使用.

## 项目约束

### 项目文件结构

```txt
|- package.json
|- tsconfig.json (如果需要用到typescript, 参照`./MdGenerator/tsconfig.json`)
|- .oxfmtrc.json (参照`./MdGenerator/oxfmtrc.json`)
|- .oxlintrc.json (参照`./MdGenerator/oxlintrc.json`)
|- src/ (该目录存放源码)
```

### 默认npm 脚本命令

```json
"scripts": {
  "build": "tsc -p tsconfig.json",
  "lint": "concurrently npm:lint:*",
  "lint:type-check": "tsc -p tsconfig.json --noEmit",
  "lint:formatter": "oxfmt --check",
  "lint:oxlint": "oxlint",
  "fix:formatter": "oxfmt",
  "test": "vitest run"
}
```

### 子包导出约束

package.json 文件需要加上"exports": { ... }, 详细可参考`./MdGenerator/package.json`
