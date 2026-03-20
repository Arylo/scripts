# CLAUDE.md

本文件夹下储存油猴脚本, 每个文件夹都为一个独立的子包, 每个子包仅产生一个油猴脚本.

油猴脚本只能在浏览器下运行, 所以不能/禁止使用node 相关能力.

## 子包目录基本结构

```txt
|- package.json
|- banner.json
|- config.toml (如果需要多平台发布)
|- README.md
|- tsconfig.json (如果需要用到typescript)
```

## 注意事项

1. 仅能使用本项目下的私有子包, 除白名单外的其余所有第三方npm 包一概不可使用

### 可用私有子包

- <root_path>/packages/general/*
- <root_path>/packages/browser/*
- <root_path>/packages/monkey/*
- <root_path>/packages/build-scripts/monkey-build

### 可用第三方NPM 包白名单

- classcat

### 依赖导入规范示例

- ✅ 推荐：`import { throttle } from '@scripts/throttle'`
- ✅ 推荐：`import { GM_addStyle } from '@scripts/gm-polyfill'`
- ❌ 禁止：`import _ from 'lodash'`（未在白名单）
- ❌ 禁止：`import { ref } from 'vue'`（未在白名单）

## 开发与提交流程提醒

1. 修改脚本后先执行构建，确保无报错。
2. 修改脚本后先执行Lint，确保无报错。(当`package.json` 包含lint script)
3. 提交前确认依赖符合本文件白名单约束。
