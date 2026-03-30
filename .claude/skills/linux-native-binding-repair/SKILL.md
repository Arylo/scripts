---
name: linux-native-binding-repair
description: '排查并修复 Linux 环境下缺失 native binding、optionalDependencies 或 package-lock 跨平台漂移问题。Use when CI fails on Ubuntu/Linux, act fails on Linux containers, or errors mention missing native bindings.'
argument-hint: '可选填写失败包名、平台、错误信息、失败步骤或 CI 上下文'
user-invocable: true
---

# Linux Native Binding Repair

## 适用场景

- GitHub Actions 在 Ubuntu 上失败，但本地 macOS 正常
- `act` 失败，但本地 `npm run lint`、`npm run test` 或 `npm run build` 正常
- 错误信息包含 `Cannot find native binding`
- 错误信息包含 `npm has a bug related to optional dependencies`
- 缺少 `@oxlint/binding-linux-x64-gnu`、`@oxfmt/binding-linux-x64-gnu`、`@rolldown/binding-linux-x64-gnu` 或同类平台包
- `package-lock.json` 在 macOS 上生成，Linux CI 无法加载原生二进制

## 执行步骤

1. 先确认失败的包、运行环境和失败步骤。
2. 记录缺失模块名，以及失败发生在 `npm ci`、`lint`、`test` 还是 `build`。
3. 区分 `linux/amd64` 与 `linux/arm64`。
4. 确认 CI 实际平台：
   - GitHub Actions 的 `ubuntu-latest` 默认通常是 `linux/amd64`
   - Apple Silicon 上的 `act` 可能默认是 `linux/arm64`，除非显式使用 `--container-architecture linux/amd64`
5. 检查根 `package-lock.json`，不要只检查子包 lockfile。
6. 在根 lockfile 中搜索缺失 binding，并确认 `packages` 区域存在真实节点，例如 `node_modules/@scope/binding-linux-x64-gnu`，而不只是 `optionalDependencies` 引用。
7. 运行前先检查本机是否安装 `docker` 与 `act`：
   - `command -v docker`
   - `command -v act`
8. 如果缺少 Docker，明确说明无法做容器级 Linux 复现，应优先安装 Docker；缺少 `act` 时，可退化为 Docker 验证。
9. 优先使用与 CI 架构一致的 Docker 环境复现。
10. 若要与 GitHub Actions x64 Linux 对齐，优先执行：

```bash
docker run --rm --platform linux/amd64 -v "$PWD":/src:ro node:24.12.0-bookworm bash -lc 'cp -a /src /work && cd /work && npm ci --workspaces --include-workspace-root && npm run lint && npm run test'
```

11. 如果 binding 缺失，继续检查包元数据：
   - 查看失败包在 `package-lock.json` 中的 `optionalDependencies`
   - 从 npm registry 查询缺失 binding 包元数据：

```bash
npm view @scope/binding-linux-x64-gnu@<version> dist.tarball dist.integrity cpu os engines --json
```

12. 修复根 `package-lock.json`：
   - 优先在目标平台上重新生成 lockfile
   - 如果 npm 仍未生成所需 `packages` 节点，可手动补齐缺失 Linux binding 节点，至少包含：`version`、`resolved`、`integrity`、`cpu`、`os`、`engines`、`optional: true`
   - 如果父包是开发依赖，补 `dev: true`
13. 在目标平台重新验证：
   - 重新执行 `npm ci`
   - 重新执行此前失败的精确命令
   - 必要时单独验证对应 `act` job
14. 区分真实依赖问题与 `act` 兼容性限制：
   - 若 `act` 报 `runs.using key ... got node24`，这是 `act` 的运行时兼容性限制，不是 binding 缺失

## 仓库特定说明

- 此仓库已经出现过 `oxfmt`、`oxlint`、`rolldown` 的 Linux binding 缺失问题
- 修复应落在根 `package-lock.json`
- 主 CI 工作流是 `.github/workflows/push.yml`
- 相关复用工作流包括：
  - `.github/workflows/monkey_push.yml`
  - `.github/workflows/qinglong_push.yml`

## 快速检查清单

- 已确认缺失的包名
- 已确认 CI 架构
- 已检查根 lockfile
- 已确认本机存在 `docker`
- 已确认本机是否存在 `act`
- 已用 Docker 在目标平台复现
- 已从 npm 获取缺失 binding 的元数据
- 已修复或重建根 lockfile
- 已在目标平台重新验证 `npm ci`
- 已区分 `act` 限制与真实依赖故障

## 常见需要检查的包

- `@oxlint/binding-linux-x64-gnu`
- `@oxfmt/binding-linux-x64-gnu`
- `@rolldown/binding-linux-x64-gnu`
- 以及根据 runner 架构变化的其他包，例如 `binding-linux-arm64-gnu`、`binding-linux-x64-musl` 等
