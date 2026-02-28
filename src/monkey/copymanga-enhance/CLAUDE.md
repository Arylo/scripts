# CLAUDE

## 子包说明

- 子包路径：`src/monkey/copymanga-enhance`
- 包名：`@scripts/monkey-copymanga-enhance`
- 目标：增强拷贝漫画阅读页体验

## 修改约束与目录说明

本油猴脚本分开两部分相应

1. 列表页 `./scripts/table/**`
2. 详细页 `./scripts/detail/**`

### 列表页修改规范

1. 本页面只能使用原生JS API, 浏览器自带的JS API 和油猴脚本自带的API, 不含任何第三方框架
2. 油猴脚本自带的API应使用私有包`@scripts/gm-polyfill`

### 详细页修改规范

1. 本页面只能使用原生JS API, 浏览器自带的JS API, Vue 框架API 和油猴脚本自带的API, 不含任何第三方框架
2. 油猴脚本自带的API应使用私有包`@scripts/gm-polyfill`
3. Vue 框架API 应使用私有包`@scripts/gm-vue`
4. Vue 组件存放在`./detail/newPage/component`
5. 修改 UI 组件时，同时检查对应 `style.css` 与交互逻辑。
6. Vue hook存放在`./detail/newPage/hooks`, 请优先复用已有能力, 避免重复造轮子

## 提交流程

1. 在子包目录执行 `npm run lint`。
2. 在子包目录执行 `npm run test`。
3. 在仓库根目录执行 `npm run build:monkey`。
4. 以上步骤全部通过后再提交。
