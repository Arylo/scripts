# 请为当前仓库执行一次 Git 提交，遵循本仓库规范

## 执行要求

1. 先阅读 <root_path>/docs/git-commit-message-standard.md。
2. 检查当前变更（只检查staged）。
3. 若没有 staged 变更，先将当前工作区改动加入暂存区。
4. 基于暂存区差异生成 commit message，格式必须是：`<type>(<scope>): <subject>`。
5. 若用户传入了参数 `$ARGUMENTS`，将其作为 subject（仍需自动补全 type/scope）。
6. 执行提交并返回：

- 最终 commit message
- 提交 hash
- 变更文件列表

## 注意

- type 仅可使用 feat/fix/refactor/docs/style/test/chore。
- scope 优先根据 src 目录映射规则推断。
- subject 使用英文，简洁明确，不加句号。
