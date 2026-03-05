# 请为当前仓库执行一次 Git 提交，遵循本仓库规范

## 执行要求

1. 顺序执行命令`npm run build` `npm run lint` `npm run test`, 若任意一条命令出现错误则中断后续操作并提出解决方案
2. 先阅读 <root_path>/docs/git-commit-message-standard.md。
3. 检查当前变更（只检查staged）。
4. 若没有 staged 变更，先将当前工作区改动加入暂存区。
5. 基于暂存区差异生成 commit message，格式必须是：`<type>(<scope>): <subject>`。
6. 若用户传入了参数 `$ARGUMENTS`，将其作为 subject（仍需自动补全 type/scope）。
7. 执行提交并返回：

- 最终 commit message
- 提交 hash
- 变更文件列表

## 注意

- type 仅可使用 feat/fix/refactor/docs/style/test/chore。
- scope 优先根据 src 目录映射规则推断。
- subject 使用英文，简洁明确，不加句号。
