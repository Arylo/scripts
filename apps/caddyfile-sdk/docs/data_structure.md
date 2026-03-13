# Data Structure

## Block Hierarchy

```text
root
├── global block (0..1)
├── snippet block (0..n)
├── site block (0..n)
└── comment block (0..n)

global/snippet/site/matcher block
└── directive block (0..n)

site block
└── matcher block (0..n)

directive block
└── subdirective block (0..n)
```

## Constraints

### Root level

1. Root 下最多只能有 1 个 `global block`。
2. Root 下可以有 0 到多个 `snippet block`，但 `snippet block.name` 不能重复。
3. Root 下可以有 0 到多个 `site block`。

### Site block

1. `site block` 会有 1 到多个 `name`。
2. `site block` 下可以有 0 到多个 `matcher block`。
3. 同一个 `site block` 下，`matcher block.name` 不能重复。

### Directive block containers

以下 block 都可以直接包含 0 到多个 `directive block`：

- `global block`
- `snippet block`
- `site block`
- `matcher block`

但在同一个父 block 下，`directive block.name` 不能重复。

### Subdirective

1. `directive block` 下可以有 0 到多个 `subdirective block`。
2. 同一个 `directive block` 下，`subdirective block.name` 不能重复。

## Notes

- `matcher block` 只允许出现在 `site block` 下。
- `subdirective block` 本质上是嵌套在 `directive block` 内的 `directive block`。
- 上述约束描述的是 Caddyfile SDK 的目标数据结构约定，用于建模和生成配置时保持结构一致性。

