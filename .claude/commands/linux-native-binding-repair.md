# 请排查并修复当前仓库中的 Linux 原生 binding 缺失问题

## 输入

- 用户可通过 `$ARGUMENTS` 提供失败的包名、平台、错误信息、失败步骤，或 CI/act 上下文。

## 适用场景

1. GitHub Actions 在 Ubuntu 上失败，但本地 macOS 正常。
2. `act` 失败，但本地的 `npm run lint` 或 `npm run test` 可以通过。
3. 错误信息包含 `Cannot find native binding`。
4. 错误信息包含 `npm has a bug related to optional dependencies`。
5. 错误信息包含缺少 `@oxlint/binding-linux-x64-gnu`、`@oxfmt/binding-linux-x64-gnu`、`@rolldown/binding-linux-x64-gnu` 或类似的平台包。
6. `package-lock.json` 在 macOS 上生成，Linux CI 无法加载原生二进制。

## 执行要求

1. 先确认具体失败的包和运行环境。
2. 记录缺失的模块名，以及失败步骤是 `npm ci`、`lint`、`test` 还是 `build`。
3. 区分 `linux/amd64` 与 `linux/arm64`。
4. 确认 CI 实际使用的平台：
   - GitHub Actions 的 `ubuntu-latest` 通常表示 `linux/amd64`，除非工作流显式修改过架构。
   - 在 Apple Silicon 上，`act` 可能默认使用 `linux/arm64`，除非显式传入 `--container-architecture linux/amd64`。
5. 检查根 `package-lock.json`，而不是只看子包 lockfile。
6. 在根 lockfile 中搜索缺失 binding，并确认 `packages` 区域中存在真实节点，例如 `node_modules/@scope/binding-linux-x64-gnu`，而不只是 `optionalDependencies` 名字引用。
7. 运行前先检查本机是否安装 `docker` 和 `act`：
   - 执行 `command -v docker`，确认可以使用 Docker 做 Linux 容器复现。
   - 执行 `command -v act`，确认可以使用 act 做 GitHub Actions 本地复现。
   - 如果缺少 `docker`，明确说明无法做容器级 Linux 复现，应优先安装 Docker，或退化为只做 lockfile 静态检查。
   - 如果缺少 `act`，明确说明无法做工作流级本地复现，但这不影响继续使用 Docker 验证依赖与命令本身。
8. 优先使用与 CI 架构一致的 Docker 环境复现。
9. 如果要与 GitHub Actions 的 x64 Linux 对齐，优先使用：

```bash
docker run --rm --platform linux/amd64 -v "$PWD":/src:ro node:24.12.0-bookworm bash -lc 'cp -a /src /work && cd /work && npm ci --workspaces --include-workspace-root && npm run lint && npm run test'
```

10. 如果 binding 缺失，继续检查包元数据：
   - 查看失败包在 `package-lock.json` 中的 `optionalDependencies`。
   - 从 npm registry 查询缺失 binding 包的元数据：

```bash
npm view @scope/binding-linux-x64-gnu@<version> dist.tarball dist.integrity cpu os engines --json
```

11. 修复根 `package-lock.json`：
    - 优先在目标平台上重新生成 lockfile。
    - 如果 npm 仍然没有生成所需的 `packages` 节点，则手动补齐缺失的 Linux binding 节点，至少包含：
      - `version`
      - `resolved`
      - `integrity`
      - `cpu`
      - `os`
      - `engines`
      - `optional: true`
      - 如果父包是开发依赖，则补 `dev: true`

   12. 在目标平台上重新验证：
    - 重新执行 `npm ci`
    - 重新执行之前失败的精确命令
    - 如果使用 `act`，需要时单独验证对应 job

   13. 区分依赖问题与 `act` 兼容性问题：
    - 如果 `act` 报 `runs.using key ... got node24`，这属于 `act` 的运行时兼容性限制，不是 binding 缺失。
    - 这种情况下，应改用 `act -j code_check --container-architecture linux/amd64` 验证主检查 job，或者直接使用 Docker 复现。

## 仓库特定说明

1. 这个仓库已经实际遇到过 `oxfmt`、`oxlint` 和 `rolldown` 的 Linux binding 缺失问题。
2. 修复应落在根 `package-lock.json`，因为主工作流是在 workspace 根目录执行安装。
3. 主 CI 工作流是 `<root_path>/.github/workflows/push.yml`。
4. 相关复用工作流是：
   - `<root_path>/.github/workflows/monkey_push.yml`
   - `<root_path>/.github/workflows/qinglong_push.yml`

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
