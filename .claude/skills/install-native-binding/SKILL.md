---
name: install-native-binding
description: '安装 npm 依赖并确保 Linux native binding 正确生成。在非 Linux 系统上通过 docker/podman 以 linux/amd64 容器执行安装，保证 lockfile 中包含跨平台 native binding。Use when installing dependencies, fixing missing native bindings, or syncing package-lock.json for Linux environments.'
user-invocable: true
---

# Install Native Binding Skill

## 适用场景

- 安装/更新 npm 依赖后需要确保 Linux native binding 正确写入 lockfile
- 在 macOS / Windows 开发机上需要为 Linux 生产环境生成正确的 lockfile
- CI 报告缺少 native binding 或 optionalDependencies 平台条目

## 执行步骤

### 1. 检测当前操作系统

运行 `uname -s` 获取系统类型。

- 若输出为 `Linux`，进入**步骤 2（Linux 路径）**。
- 否则（macOS、Windows 等），进入**步骤 3（非 Linux 路径）**。

### 2. Linux 路径

直接在当前环境运行：

```bash
npm i --include-workspace-root -ws
```

完成后跳至**步骤 5**。

### 3. 非 Linux 路径 —— 检测容器运行时

依次检查以下命令是否可用：

```bash
command -v docker
command -v podman
```

- 若两者均不可用，**停止执行**，告知用户需要安装 Docker 或 Podman 后重试。
- 优先使用 `docker`；若 `docker` 不可用则使用 `podman`（以下统称 `<runtime>`）。

### 4. 非 Linux 路径 —— 读取 Node 版本并在容器中安装

#### 4a. 读取 Node 版本

读取仓库根目录的 `.nvmrc` 文件，获取版本号（去掉前缀 `v`），作为镜像 tag。

例如 `.nvmrc` 内容为 `v24.12.0`，则镜像为 `node:24.12.0`。

#### 4b. 在容器中执行安装

```bash
<runtime> run --rm --platform linux/amd64 \
  -v "$PWD":/src \
  --tmpfs /src/node_modules:exec \
  node:<version> \
  bash -lc 'cd /src && npm i --include-workspace-root -ws'
```

- 挂载当前工作目录为 `/src`（读写，不加 `:ro`），使安装结果（`node_modules`、`package-lock.json`）直接写回宿主机。
- `--tmpfs /src/node_modules:exec` 将容器内的根 `node_modules` 挂载为内存文件系统，避免宿主机的 `node_modules` 被覆盖，同时加速安装；`:exec` 允许 postinstall 脚本执行二进制文件（Docker tmpfs 默认带 `noexec`）。
- `--platform linux/amd64` 确保 native binding 以 Linux x64 平台编译/下载。

## 约束

- 容器挂载目录为当前工作区根目录（即含 `package.json` 和 `package-lock.json` 的目录）
- 不要在容器内部 `cp` 文件；直接挂载读写以避免权限问题
- Node 镜像版本必须严格来自 `.nvmrc`，不得硬编码或猜测
