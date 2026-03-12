# CLAUDE

## 子包说明

- 子包路径：`apps/monkey/copymanga-enhance`
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
4. Vue 组件存放在`./scripts/detail/newPage/component`
5. 修改 UI 组件时，同时检查对应 `style.css` 与交互逻辑。
6. Vue hook存放在`./scripts/detail/newPage/hooks`, 请优先复用已有能力, 避免重复造轮子
7. 若HTML 元素class 使用了tailwind css, 需确保该class 在`./scripts/detail/newPage/tailwind.css`文件里存在, 若不存在请加上
8. 若HTML 元素class 为`ltr:xxx`或`rtl:xxx`或`ttb:xxx`, 则为特殊class, 例如`ltr:hidden` 实际为css`.ltr .ltr\:hidden`, 能力等同`.hidden`, 需确保该class 在`./scripts/detail/newPage/tailwind.css`文件里存在, 若不存在请加上

## 提交流程

1. 在子包目录执行 `npm run lint`。
2. 在子包目录执行 `npm run test`。
3. 在子包目录执行 `npm run build`。
4. 以上步骤全部通过后再提交。
