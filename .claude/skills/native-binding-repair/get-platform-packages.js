#!/usr/bin/env node

/**
 * 从根目录package-lock.json中获取已包含的平台包名
 * 使用: node get-platform-packages.js [平台标识符...]
 * 示例:
 *   node get-platform-packages.js linux-x64
 *   node get-platform-packages.js darwin-arm64 darwin-x64
 *   node get-platform-packages.js linux-x64 win32-x64
 * 注意: 必须至少传入一个平台标识符
 */

const fs = require('fs');
const path = require('path');

function getPlatformPackages(targetPlatforms = []) {
  // 使用当前工作目录作为根目录
  const rootDir = process.cwd();
  const lockfilePath = path.join(rootDir, 'package-lock.json');

  if (!fs.existsSync(lockfilePath)) {
    console.error('❌ package-lock.json 文件不存在');
    console.error(`   预期路径: ${lockfilePath}`);
    process.exit(1);
  }

  const lockfile = JSON.parse(fs.readFileSync(lockfilePath, 'utf8'));
  const packages = lockfile.packages || {};

  const allPlatformPackages = [];

  // 遍历所有包
  for (const pkgPath in packages) {
    const pkg = packages[pkgPath];

    // 检查包名是否包含传入的平台标识符
    for (const platform of targetPlatforms) {
      if (pkgPath.includes(platform)) {
        allPlatformPackages.push({
          path: pkgPath,
          name: pkgPath.replace('node_modules/', ''),
          version: pkg.version,
          os: pkg.os || [],
          cpu: pkg.cpu || [],
          optional: pkg.optional || false,
          resolved: pkg.resolved || '',
          pattern: platform
        });
        break;
      }
    }
  }

  return allPlatformPackages;
}

function main() {
  const args = process.argv.slice(2);
  const targetPlatforms = args.length > 0 ? args : [];

  // 检查是否传入了平台标识符
  if (targetPlatforms.length === 0) {
    console.error('❌ 请至少传入一个平台标识符');
    console.error('  支持的平台标识符: darwin-arm64, darwin-x64, linux-x64, linux-arm64, linux-arm, win32-x64, win32-arm64');
    console.error('  示例: node get-platform-packages.js linux-x64');
    console.error('  示例: node get-platform-packages.js darwin-arm64 darwin-x64 linux-x64 linux-arm64');
    process.exit(1);
  }

  const platformPackages = getPlatformPackages(targetPlatforms);

  if (platformPackages.length === 0) {
    console.log(`ℹ️  未找到 ${targetPlatforms.join(', ')} 平台包`);
    return;
  }

  console.log(`📦 找到 ${platformPackages.length} 个平台包 (${targetPlatforms.join(', ')}):`);
  console.log('');

  platformPackages.forEach((pkg, index) => {
    console.log(`${index + 1}. ${pkg.name}@${pkg.version}`);
    console.log(`   路径: ${pkg.path}`);
    console.log(`   平台: ${pkg.pattern}`);
    console.log(`   OS: ${pkg.os.join(', ') || '未指定'}`);
    console.log(`   CPU: ${pkg.cpu.join(', ') || '未指定'}`);
    console.log(`   可选: ${pkg.optional ? '是' : '否'}`);
    console.log(`   Resolved: ${pkg.resolved ? '已解析' : '未解析'}`);
    console.log('');
  });
}

if (require.main === module) {
  main();
}

module.exports = { getPlatformPackages };
