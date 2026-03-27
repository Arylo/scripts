---
name: commit
description: '根据当前仓库改动生成并执行规范化 Git 提交。Use when committing current changes, generating a conventional commit message, or preparing a repo commit after validation.'
argument-hint: '可选填写 subject，skill 会继续自动推断 type 和 scope'
user-invocable: true
---

# Commit Skill

## 适用场景

- 需要为当前仓库执行一次规范化 Git 提交
- 需要根据暂存区差异自动生成 commit message
- 用户只给出 subject，希望自动补全 type 和 scope

## 执行步骤

1. 顺序执行 `npm run build`、`npm run lint`、`npm run test`。
2. 如果任意命令失败，停止提交，说明失败点，并给出修复建议。
3. 阅读仓库规范文件 [docs/git-commit-message-standard.md](../../../docs/git-commit-message-standard.md)。
4. 检查当前 staged 变更。
5. 如果没有 staged 变更，先将当前工作区改动加入暂存区。
6. 如果 staged 或当前工作区改动中包含 `package.json` 或 `package-lock.json`，需要检查变更内容：
   - 如果 `package-lock.json` 有修改 **或者** `package.json` 的 `dependencies` 或 `devDependencies` 部分有修改，必须先执行 `/linux-native-binding-repair`，确认不存在 Linux native binding、optionalDependencies 或 lockfile 跨平台漂移问题。
   - 如果只有 `package.json` 的其他部分（如 scripts、workspaces 等）修改，且 `package-lock.json` 没有修改，则不需要执行 `/linux-native-binding-repair`。
7. 基于暂存区差异生成 commit message，格式必须是 `<type>(<scope>): <subject>`。
8. 如果用户传入参数，将其作为 subject，仍需自动补全 type 和 scope。
9. 执行 git 提交。
10. 返回以下结果：

- 最终 commit message
- 提交 hash
- 变更文件列表

## 约束

- `type` 仅可使用 `feat`、`fix`、`refactor`、`docs`、`style`、`test`、`chore`
- `scope` 优先根据 `src` 目录映射规则推断
- `subject` 使用英文，简洁明确，不加句号
- 不要跳过验证步骤，除非用户显式要求
