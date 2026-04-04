---
name: native-binding-repair
description: '排查并修复缺失环境 native binding、optionalDependencies 或 package-lock 跨平台漂移问题。Use when CI fails on Ubuntu/Linux, act fails on Linux containers, or errors mention missing native bindings.'
argument-hint: '可选填写失败包名、平台、错误信息、失败步骤或 CI 上下文'
user-invocable: true
---

# Native Binding Repair

## 适用场景

- GitHub Actions 在 Ubuntu/Linux 上失败，但本地 macOS/Windows 正常
- `act` 在 Linux 容器中失败，但本地开发环境正常
- 错误信息包含 `Cannot find native binding` 或 `missing native bindings`
- 错误信息包含 `npm has a bug related to optional dependencies`
- 缺少平台特定的绑定包（包名包含平台标识符如 `darwin-arm64`、`linux-x64` 等）
- `package-lock.json` 在 A 平台生成，B 平台无法加载原生二进制

## 平台标识符说明

### 必须支持的平台标识符（主要目标平台）
- **darwin-arm64** - macOS Apple Silicon
- **darwin-x64** - macOS Intel
- **linux-x64** - Linux x86_64

### 可选支持的平台标识符（可能遇到，需要识别）
- **linux-arm64** - Linux ARM64/AArch64（如Raspberry Pi 4, AWS Graviton）
- **linux-arm** - Linux ARM 32位（如Raspberry Pi 1-3）
- **win32-x64** - Windows x64
- **win32-arm64** - Windows ARM64

### 特殊变体平台标识符
- **alpine-x64** / **alpine-arm64** - Alpine Linux（musl libc）
- **musl-x64** / **musl-arm64** - 其他使用 musl libc 的 Linux 发行版

## 执行步骤

### 1. 检查 package-lock.json 的平台包识别
首先检查根目录的 `package-lock.json`，确认是否包含目标平台的平台包：
- 使用 JavaScript 工具检查平台包的存在情况
- 确认在 `packages` 区域存在对应的平台包节点

**使用 JavaScript 工具获取平台包信息：**
```bash
node .claude/skills/native-binding-repair/get-platform-packages.js <平台标识符...>
# 示例:
# node .claude/skills/native-binding-repair/get-platform-packages.js darwin-arm64 linux-x64
# node .claude/skills/native-binding-repair/get-platform-packages.js linux-arm64 linux-x64
```

**平台包节点示例：**
```json
"node_modules/@scope/platform-package": {
  "version": "x.x.x",
  "resolved": "https://registry.npmjs.org/@scope/platform-package/-/platform-package-x.x.x.tgz",
  "integrity": "sha512-...",
  "cpu": ["<cpu>"],
  "os": ["<os>"],
  "optional": true
}
```

### 2. 检查 optionalDependencies 和安装状态
检查引用平台包的父包的 `optionalDependencies`：
- 使用 JavaScript 工具查找父包和依赖关系
- 确认目标平台的平台包是否在 `optionalDependencies` 中被正确引用

**推荐：使用智能分析工具（整合检查功能）**
```bash
node .claude/skills/native-binding-repair/analyze-platform-status.js [平台标识符...]
# 示例:
# node .claude/skills/native-binding-repair/analyze-platform-status.js
# node .claude/skills/native-binding-repair/analyze-platform-status.js darwin-arm64 linux-x64 linux-arm64
```

**或使用单独工具：**
```bash
# 查找父包信息
node .claude/skills/native-binding-repair/find-parent-package.js [平台标识符...]
# 示例: node .claude/skills/native-binding-repair/find-parent-package.js darwin-arm64 linux-x64

# 检查平台包安装状态
node .claude/skills/native-binding-repair/check-installation-status.js [平台标识符...]
# 示例: node .claude/skills/native-binding-repair/check-installation-status.js darwin-arm64 darwin-x64 linux-x64

# 脚本会返回详细状态：
# ✅ 已安装 - 包目录和 package.json 均存在且有效
# ❌ 目录缺失 - 包目录不存在
# ❌ package.json 缺失 - 包目录存在但 package.json 缺失
# ❌ 文件损坏 - package.json 存在但格式错误
```

### 3. 验证安装状态并智能决策
使用分析工具全面检查平台包状态：
```bash
# 使用智能分析工具
node .claude/skills/native-binding-repair/analyze-platform-status.js [平台标识符...]
# 示例: node .claude/skills/native-binding-repair/analyze-platform-status.js darwin-arm64 darwin-x64 linux-x64
```

根据分析结果决策：

**情况 1：所有平台包已安装**
```
✅ 无需修复 - 所有平台包均已安装
```
跳过后续修复步骤，直接验证即可。

**情况 2：当前平台缺失包**
```
📝 情况 A: 当前平台 (<平台>) 有缺失包
```
执行本地重新安装以更新 package-lock.json。

**情况 3：其他平台缺失包**
```
🌐 情况 B: 其他平台有缺失包 (<平台列表>)
```
使用容器在目标平台环境中重新安装。

**情况 4：混合缺失**
```
🔄 综合建议: 先本地安装当前平台包，再容器安装其他平台包
```
按照建议的步骤执行修复。

### 4. 确认容器运行时环境
检查本地是否安装了容器运行时工具：
```bash
# 检查 docker
command -v docker

# 检查 podman（替代方案）
command -v podman
```
- 如果两者都未安装，建议用户先安装容器运行时
- 优先使用 `docker`，如果不可用则使用 `podman`

### 5. 智能判断并执行修复安装
根据平台包的安装状态和当前平台环境，智能选择修复方式：

#### 5.1 首先，确定当前平台环境
```bash
# 检测当前操作系统和架构
CURRENT_PLATFORM=""
if [[ "$(uname -s)" == "Darwin" ]]; then
  if [[ "$(uname -m)" == "arm64" ]]; then
    CURRENT_PLATFORM="darwin-arm64"
  else
    CURRENT_PLATFORM="darwin-x64"
  fi
elif [[ "$(uname -s)" == "Linux" ]]; then
  # Linux 支持多种架构：x64, arm64, arm
  if [[ "$(uname -m)" == "arm64" || "$(uname -m)" == "aarch64" ]]; then
    CURRENT_PLATFORM="linux-arm64"
  elif [[ "$(uname -m)" == "arm" || "$(uname -m)" == "armv7l" || "$(uname -m)" == "armv6l" ]]; then
    CURRENT_PLATFORM="linux-arm"
  else
    CURRENT_PLATFORM="linux-x64"
  fi
elif [[ "$(uname -s)" == "Windows_NT" ]]; then
  if [[ "$(uname -m)" == "arm64" ]]; then
    CURRENT_PLATFORM="win32-arm64"
  else
    CURRENT_PLATFORM="win32-x64"
  fi
else
  echo "⚠️  无法识别当前平台，将使用容器重新安装所有缺失平台包"
  CURRENT_PLATFORM="unknown"
fi
echo "当前平台: $CURRENT_PLATFORM"
```

#### 5.2 分析缺失的平台包状态
使用 JavaScript 工具获取缺失的平台包列表：
```bash
node .claude/skills/native-binding-repair/check-installation-status.js [平台标识符...]
# 示例: node .claude/skills/native-binding-repair/check-installation-status.js darwin-arm64 darwin-x64 linux-x64 linux-arm64
```

根据检查结果，平台包分为三类：
1. **当前平台缺失** - 缺失的平台包属于当前运行平台
2. **其他平台缺失** - 缺失的平台包属于其他平台
3. **全部缺失** - 所有平台包均缺失

#### 5.3 根据缺失情况选择修复策略

**情况 A：当前平台缺失**
如果当前平台环境有缺失的平台包，直接使用 npm 重新安装以更新 package-lock.json：
```bash
npm ci --workspaces --include-workspace-root
```
或者针对特定包重新安装：
```bash
npm rebuild
npm install --include=optional
```

**情况 B：其他平台缺失**
如果缺失的平台包属于其他平台环境（如当前是 macOS，缺失 Linux 包），使用容器在目标平台环境下重新安装：

**从 .nvmrc 获取 Node 版本：**
```bash
# 读取 .nvmrc 文件中的 Node 版本
NODE_VERSION=$(cat .nvmrc | sed 's/^v//')
# 或者直接使用（如果 .nvmrc 包含 v24.12.0）
NODE_VERSION="24.12.0"

# 确定镜像标签
IMAGE_TAG="${NODE_VERSION}"
```

**使用 docker（针对特定缺失平台）：**
```bash
# 假设缺失 linux-x64 平台包
MISSING_PLATFORM="linux-x64"
NODE_VERSION=$(cat .nvmrc | sed 's/^v//')
IMAGE_TAG="${NODE_VERSION}"

docker run --rm --platform $MISSING_PLATFORM \
  -v "$PWD":/src:ro \
  node:${IMAGE_TAG} \
  bash -lc 'cp -a /src /work && cd /work && npm ci --workspaces --include-workspace-root'
```

**使用 podman（如果 docker 不可用）：**
```bash
podman run --rm --platform $MISSING_PLATFORM \
  -v "$PWD":/src:ro \
  node:${IMAGE_TAG} \
  bash -lc 'cp -a /src /work && cd /work && npm ci --workspaces --include-workspace-root'
```

**情况 C：全部缺失或未知平台**
如果所有平台包均缺失或当前平台无法识别，使用容器重新安装所有必须支持的平台：
```bash
# 对所有必须支持的平台标识符逐一安装
for PLATFORM in darwin-arm64 darwin-x64 linux-x64; do
  NODE_VERSION=$(cat .nvmrc | sed 's/^v//')
  IMAGE_TAG="${NODE_VERSION}"

  echo "正在为 $PLATFORM 平台重新安装..."
  docker run --rm --platform $PLATFORM \
    -v "$PWD":/src:ro \
    node:${IMAGE_TAG} \
    bash -lc 'cp -a /src /work && cd /work && npm ci --workspaces --include-workspace-root'
done
```

### 6. 验证修复结果
验证修复安装是否成功：
```bash
# 使用 JavaScript 工具验证平台包是否已安装
node .claude/skills/native-binding-repair/check-installation-status.js [平台标识符...]
# 示例: node .claude/skills/native-binding-repair/check-installation-status.js darwin-arm64 darwin-x64 linux-x64 linux-arm64
node .claude/skills/native-binding-repair/get-platform-packages.js [平台标识符...]
node .claude/skills/native-binding-repair/find-parent-package.js [平台标识符...]

# 运行之前失败的命令进行验证
npm run lint
npm run test
npm run build
```

## 仓库特定说明

- 此仓库已经出现过 `oxfmt`、`oxlint`、`rolldown` 的 Linux binding 缺失问题
- 修复应始终在根目录的 `package-lock.json` 中进行
- 主 CI 工作流是 `.github/workflows/push.yml`
- 相关复用工作流包括：
  - `.github/workflows/monkey_push.yml`
  - `.github/workflows/qinglong_push.yml`

## 快速检查清单

### 分析阶段
- [ ] 已使用智能分析工具检查平台包状态
  ```bash
  node .claude/skills/native-binding-repair/analyze-platform-status.js
  ```
- [ ] 已确认当前平台环境和缺失包分类（当前平台/其他平台）
- [ ] 已检查根目录 `package-lock.json` 的平台包识别
- [ ] 已验证 `optionalDependencies` 引用

### 修复阶段（根据分析结果选择）
#### 情况 A：当前平台缺失包
- [ ] 已在本地重新安装依赖
  ```bash
  npm ci --workspaces --include-workspace-root
  ```
- [ ] 或已重建原生模块
  ```bash
  npm rebuild
  ```

#### 情况 B：其他平台缺失包
- [ ] 已检查本地容器运行时（docker/podman）
- [ ] 已使用容器在目标平台环境中重新安装
  ```bash
  docker run --rm --platform <目标平台> ...
  ```

#### 情况 C：混合缺失
- [ ] 已先本地修复当前平台包
- [ ] 已使用容器修复其他平台包

### 验证阶段
- [ ] 已验证修复后的安装状态
  ```bash
  node .claude/skills/native-binding-repair/check-installation-status.js
  ```
- [ ] 已运行之前失败的命令进行验证
  ```bash
  npm run lint && npm run test && npm run build
  ```

## JavaScript 工具使用指南

### 分析平台状态（推荐）
智能分析当前平台环境，识别缺失的平台包并提供修复建议：
```bash
node .claude/skills/native-binding-repair/analyze-platform-status.js [平台标识符...]
```

**示例：**
```bash
# 分析所有默认支持的平台（darwin-arm64, darwin-x64, linux-x64）
node .claude/skills/native-binding-repair/analyze-platform-status.js

# 分析指定平台
node .claude/skills/native-binding-repair/analyze-platform-status.js darwin-arm64 linux-x64
```

**输出包含：**
- 当前平台环境检测
- 平台包安装状态统计
- 缺失包分类（当前平台/其他平台）
- 智能修复建议
- 具体的修复命令

### 检查安装状态
```bash
node .claude/skills/native-binding-repair/check-installation-status.js [平台标识符...]
# 示例:
# node .claude/skills/native-binding-repair/check-installation-status.js darwin-arm64 darwin-x64 linux-x64
# node .claude/skills/native-binding-repair/check-installation-status.js linux-arm64 linux-x64
```

**输出包含：**
- 包名和版本
- 安装状态（✅ 已安装 / ❌ 缺失）
- 状态详细信息
- 安装率统计
- 返回退出码（0=成功，1=有缺失包）

### 获取平台包信息
```bash
node .claude/skills/native-binding-repair/get-platform-packages.js [平台标识符...]
# 示例:
# node .claude/skills/native-binding-repair/get-platform-packages.js darwin-arm64 linux-x64 linux-arm64
```

### 查找父包信息
```bash
node .claude/skills/native-binding-repair/find-parent-package.js [平台标识符...]
# 示例:
# node .claude/skills/native-binding-repair/find-parent-package.js darwin-arm64 darwin-x64 linux-x64
```

### 平台包识别
平台包通常具有以下特征：
1. 包名包含平台标识符（如 `darwin-arm64`、`linux-x64` 等）
2. 在 `package-lock.json` 中有 `cpu` 和 `os` 字段
3. 通常是 `optional: true`
4. 被父包的 `optionalDependencies` 引用

## 故障排除

### 如果平台包在 npm registry 中不存在
检查包是否支持目标平台：
```bash
npm view @scope/package-name os cpu engines --json
```

### 手动添加平台包到 package-lock.json
如果自动修复失败，可手动添加（最后手段）：
```json
"node_modules/@scope/platform-package": {
  "version": "x.x.x",
  "resolved": "https://registry.npmjs.org/@scope/platform-package/-/platform-package-x.x.x.tgz",
  "integrity": "sha512-...",
  "cpu": ["<cpu>"],
  "os": ["<os>"],
  "optional": true
}
```
