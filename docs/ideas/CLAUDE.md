# docs/ideas 文档约定

## 目标

- `docs/ideas` 用于记录后续想法，不表示相关功能已经实现。
- 文档重点是说明想法本身的范围、变化和预期结果，而不是展开具体实现过程。

## 文件命名

- 使用 `kebab-case`。
- 文件名应直接描述想法主题，避免使用过于宽泛的名字。
- 示例：`copymanga-detail-adjacent-url-dedup.md`

## 文档结构

每篇 idea 文档默认使用以下结构：

```markdown
## Summary

...

## Scope

...

## What changes

...

## Expected Result

...
```

## 写作要求

- `Summary` 只概括想法的目标和动机，不写执行步骤。
- `Scope` 同时写清包含范围和排除范围，避免影响面扩散。
- `What changes` 说明变更发生在哪个处理阶段或业务环节，不默认指定特定文件。
- `Expected Result` 只写可理解、可验证的结果，优先使用规则描述或正反例。
- 默认强调这是 idea 记录，不涉及本次业务代码变更。
- 除非用户明确要求，否则不要把文档写成实现方案、改造计划或文件级操作说明。
