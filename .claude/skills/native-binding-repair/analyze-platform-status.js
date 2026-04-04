#!/usr/bin/env node

/**
 * 分析当前平台环境并识别缺失的平台包
 * 使用: node analyze-platform-status.js [平台标识符...]
 * 示例:
 *   node analyze-platform-status.js
 *   node analyze-platform-status.js darwin-arm64 darwin-x64 linux-x64
 * 功能:
 * 1. 检测当前运行平台
 * 2. 检查所有平台包的安装状态
 * 3. 根据当前平台智能分类缺失的平台包
 * 4. 提供修复建议
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { checkInstallationStatus } = require('./check-installation-status.js');

// 获取当前平台
function getCurrentPlatform() {
  const platform = os.platform(); // 'darwin', 'linux', 'win32'
  const arch = os.arch(); // 'x64', 'arm64', 'arm'

  if (platform === 'darwin') {
    return arch === 'arm64' ? 'darwin-arm64' : 'darwin-x64';
  } else if (platform === 'linux') {
    // Linux 支持多种架构：x64, arm64, arm
    if (arch === 'arm64') {
      return 'linux-arm64';
    } else if (arch === 'arm') {
      return 'linux-arm';
    } else {
      return 'linux-x64';
    }
  } else if (platform === 'win32') {
    return arch === 'arm64' ? 'win32-arm64' : 'win32-x64';
  }

  return 'unknown';
}

// 获取默认支持的平台标识符
function getDefaultPlatforms() {
  return ['darwin-arm64', 'darwin-x64', 'linux-x64'];
}

// 分析缺失包的分类
function analyzeMissingPackages(results, currentPlatform) {
  const missingPackages = results.packages.filter(p => !p.installed);

  const currentPlatformMissing = [];
  const otherPlatformMissing = [];

  missingPackages.forEach(pkg => {
    // 从包名中提取平台标识符
    const pkgPlatform = extractPlatformFromPackageName(pkg.name);

    if (pkgPlatform === currentPlatform) {
      currentPlatformMissing.push({ ...pkg, platform: pkgPlatform });
    } else {
      otherPlatformMissing.push({ ...pkg, platform: pkgPlatform });
    }
  });

  return {
    currentPlatformMissing,
    otherPlatformMissing,
    allMissing: missingPackages
  };
}

// 从包名中提取平台标识符
function extractPlatformFromPackageName(packageName) {
  // 所有可能的平台标识符，包括可选的 Linux ARM 架构
  const platforms = [
    'darwin-arm64', 'darwin-x64',
    'linux-x64', 'linux-arm64', 'linux-arm',
    'win32-x64', 'win32-arm64',
    'alpine-x64', 'alpine-arm64', // Alpine Linux 变体
    'musl-x64', 'musl-arm64'      // musl libc 变体
  ];

  for (const platform of platforms) {
    if (packageName.includes(platform)) {
      return platform;
    }
  }

  // 尝试从路径中提取
  for (const platform of platforms) {
    if (packageName.includes(`-${platform}`) || packageName.endsWith(platform)) {
      return platform;
    }
  }

  return 'unknown';
}

// 显示平台检测结果
function displayPlatformInfo(currentPlatform) {
  console.log('🌍 平台环境检测:');
  console.log('='.repeat(40));
  console.log(`  操作系统: ${os.platform()} (${os.type()})`);
  console.log(`  架构: ${os.arch()}`);
  console.log(`  Node.js: ${process.version}`);
  console.log(`  当前平台标识符: ${currentPlatform}`);
  console.log('');
}

// 显示缺失包分析结果
function displayMissingAnalysis(analysis, currentPlatform) {
  console.log('📊 缺失包分析结果:');
  console.log('='.repeat(40));

  if (analysis.allMissing.length === 0) {
    console.log('✅ 所有平台包均已正确安装');
    return;
  }

  console.log(`  当前平台 (${currentPlatform}) 缺失包: ${analysis.currentPlatformMissing.length}`);
  if (analysis.currentPlatformMissing.length > 0) {
    analysis.currentPlatformMissing.forEach((pkg, index) => {
      console.log(`    ${index + 1}. ${pkg.name}@${pkg.version}`);
      console.log(`       状态: ${getStatusText(pkg.status)}`);
    });
  }

  console.log(`\n  其他平台缺失包: ${analysis.otherPlatformMissing.length}`);
  if (analysis.otherPlatformMissing.length > 0) {
    const platforms = {};
    analysis.otherPlatformMissing.forEach(pkg => {
      if (!platforms[pkg.platform]) {
        platforms[pkg.platform] = [];
      }
      platforms[pkg.platform].push(pkg);
    });

    for (const [platform, packages] of Object.entries(platforms)) {
      console.log(`    📍 ${platform}: ${packages.length} 个包`);
      packages.forEach((pkg, index) => {
        console.log(`        ${index + 1}. ${pkg.name}@${pkg.version}`);
      });
    }
  }

  console.log(`\n  总计缺失包: ${analysis.allMissing.length}`);
  console.log('');
}

// 提供修复建议
function displayRepairRecommendations(analysis, currentPlatform) {
  console.log('🔧 修复建议:');
  console.log('='.repeat(40));

  if (analysis.allMissing.length === 0) {
    console.log('✅ 无需修复 - 所有平台包均已安装');
    return;
  }

  // 情况 A: 当前平台缺失
  if (analysis.currentPlatformMissing.length > 0) {
    console.log(`📝 情况 A: 当前平台 (${currentPlatform}) 有缺失包`);
    console.log('   建议直接在本地重新安装:');
    console.log('');
    console.log('   1. 重新安装所有依赖:');
    console.log('      npm ci --workspaces --include-workspace-root');
    console.log('');
    console.log('   2. 或者重建原生模块:');
    console.log('      npm rebuild');
    console.log('');
    console.log('   3. 或者强制重新安装可选依赖:');
    console.log('      npm install --include=optional');
    console.log('');
  }

  // 情况 B: 其他平台缺失
  if (analysis.otherPlatformMissing.length > 0) {
    const otherPlatforms = [...new Set(analysis.otherPlatformMissing.map(p => p.platform))];

    console.log(`🌐 情况 B: 其他平台有缺失包 (${otherPlatforms.join(', ')})`);
    console.log('   建议使用容器在目标平台环境中重新安装:');
    console.log('');
    console.log('   使用 docker (针对特定缺失平台):');
    console.log('   ---------------------------------');

    for (const platform of otherPlatforms) {
      console.log(`   # 为 ${platform} 平台重新安装:`);
      console.log(`   NODE_VERSION=$(cat .nvmrc | sed 's/^v//')`);
      console.log(`   IMAGE_TAG="\${NODE_VERSION}"`);
      console.log('');
      console.log(`   docker run --rm --platform ${platform} \\`);
      console.log('     -v "$PWD":/src:ro \\');
      console.log('     node:${IMAGE_TAG} \\');
      console.log('     bash -lc \'cp -a /src /work && cd /work && npm ci --workspaces --include-workspace-root\'');
      console.log('');
    }

    console.log('   或者使用 podman (如果 docker 不可用):');
    console.log('   -------------------------------------');
    console.log(`   podman run --rm --platform ${otherPlatforms[0]} \\`);
    console.log('     -v "$PWD":/src:ro \\');
    console.log('     node:${IMAGE_TAG} \\');
    console.log('     bash -lc \'cp -a /src /work && cd /work && npm ci --workspaces --include-workspace-root\'');
    console.log('');
  }

  // 情况 C: 同时有当前平台和其他平台缺失
  if (analysis.currentPlatformMissing.length > 0 && analysis.otherPlatformMissing.length > 0) {
    console.log('🔄 综合建议:');
    console.log('   1. 首先修复当前平台缺失包（本地安装）');
    console.log('   2. 然后修复其他平台缺失包（容器安装）');
    console.log('   3. 最后验证所有平台包是否已安装');
    console.log('');
  }

  console.log('✅ 验证修复结果:');
  console.log('   node .claude/skills/native-binding-repair/check-installation-status.js 所有平台标识符');
  console.log('');
}

function getStatusText(status) {
  const statusMap = {
    'installed': '已安装',
    'missing-directory': '目录缺失',
    'missing-package-json': 'package.json 缺失',
    'corrupted': '文件损坏',
    'unknown': '未知状态'
  };
  return statusMap[status] || status;
}

function main() {
  const args = process.argv.slice(2);
  const targetPlatforms = args.length > 0 ? args : getDefaultPlatforms();

  const currentPlatform = getCurrentPlatform();

  console.log('🔍 平台包状态分析工具');
  console.log('='.repeat(60));

  displayPlatformInfo(currentPlatform);

  console.log(`🔍 检查 ${targetPlatforms.join(', ')} 平台包的安装状态...\n`);

  const results = checkInstallationStatus(targetPlatforms);

  console.log('📊 平台包安装状态:');
  console.log(`   ✅ 已安装: ${results.installed}/${results.total}`);
  console.log(`   ❌ 缺失: ${results.missing}/${results.total}`);
  console.log(`   📊 安装率: ${((results.installed / results.total) * 100).toFixed(1)}%`);
  console.log('');

  const analysis = analyzeMissingPackages(results, currentPlatform);

  displayMissingAnalysis(analysis, currentPlatform);

  displayRepairRecommendations(analysis, currentPlatform);

  // 返回适当的退出码
  if (results.missing > 0) {
    console.log('⚠️  检测到缺失的平台包，需要修复');
    process.exit(1);
  } else {
    console.log('🎉 所有平台包均已正确安装，无需修复');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  getCurrentPlatform,
  analyzeMissingPackages,
  extractPlatformFromPackageName
};
