## Summary

这是一个仅面向 copymanga-enhance detail 页的后续想法：在图片列表进入 parseImages 之前，先做一层相邻重复 URL 去重。目的不是修改图片排序或做全局去重，而是消除连续重复图片 URL 对 detail 阅读流程的干扰。

## Scope

包含范围：
- 仅作用于 copymanga-enhance 的 detail 页面。
- 仅作用于 parseImages 之前的图片 URL 列表预处理。
- 仅处理“当前 URL 与前一个 URL 相同”的相邻重复场景。

排除范围：
- 不影响首页、列表页、搜索页或其他 monkey 脚本。
- 不修改 parseImages 之后的白页插入、分页方向、data-index 注入逻辑。
- 不做全局去重，不处理非相邻重复项。
- 本次不涉及业务代码，只记录这个想法。

## What changes

1. 明确这项变更发生在 detail 页图片 URL 转换为图片项之前的处理阶段。
2. 未来新增步骤应放在 parseImages 之前，而不是之后。
3. 这一步的规则是：遍历原始 URL 列表，当当前 URL 与前一个 URL 一致时，跳过当前项，仅保留一个连续副本。
4. 这一步只改变相邻重复项的数量，不改变剩余 URL 的先后顺序。
5. 这个想法将以 docs/ideas 下的一份说明文件记录下来，供后续实现时直接参考。

## Expected Result

1. 后续实现者能明确知道该改动只属于 detail 页，不会把行为外溢到其他页面。
2. 后续实现者能明确知道插入点在 parseImages 前的原始 URL 阶段。
3. 后续实现者能明确知道规则是“相邻重复去重”，不是“全部重复去重”。
4. 预期行为可以直接用示例判断：A,A,B,B,C 变为 A,B,C；A,B,A 保持不变。
