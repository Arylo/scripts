#!/usr/bin/env node

/**
 * 查找平台包的父包，并获取父包下 optionalDependencies 包含指定平台包的信息
 * 使用: node find-parent-package.js [平台标识符...]
 * 示例:
 *   node find-parent-package.js linux-x64
 *   node find-parent-package.js darwin-arm64 darwin-x64
 *   node find-parent-package.js linux-x64 win32-x64
 * 注意: 必须至少传入一个平台标识符
 */

const fs = require('fs');
const path = require('path');
const { getPlatformPackages } = require('./get-platform-packages.js');

function findParentPackages(targetPlatforms = []) {
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

  // 先获取所有平台包
  const platformPackages = getPlatformPackages(targetPlatforms);

  if (platformPackages.length === 0) {
    if (targetPlatforms.length > 0) {
      console.log(`ℹ️  未找到 ${targetPlatforms.join(', ')} 平台包`);
    } else {
      console.log('ℹ️  未找到任何平台包');
    }
    return [];
  }

  const results = [];

  // 为每个平台包查找父包
  for (const platformPkg of platformPackages) {
    const platformPkgName = platformPkg.name;
    const shortPkgName = platformPkgName.replace(/@[^/]+\/(binding-)?/, '');

    // 遍历所有包，查找包含该平台包作为 optionalDependency 的父包
    for (const pkgPath in packages) {
      const pkg = packages[pkgPath];

      // 跳过平台包本身
      if (pkgPath === platformPkg.path) {
        continue;
      }

      // 检查 optionalDependencies
      if (pkg.optionalDependencies) {
        for (const depName in pkg.optionalDependencies) {
          // 检查依赖名是否匹配平台包名或包含平台标识符
          if (depName === platformPkgName || depName.includes(shortPkgName)) {
            results.push({
              platformPackage: platformPkgName,
              parentPackage: pkgPath.replace('node_modules/', ''),
              parentPackagePath: pkgPath,
              optionalDependency: depName,
              optionalVersion: pkg.optionalDependencies[depName],
              hasPlatformPackageInDeps: true
            });
            break;
          }
        }
      }

      // 也检查 dependencies 和 devDependencies
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
        ...pkg.peerDependencies
      };

      for (const depName in allDeps) {
        if (depName === platformPkgName || depName.includes(shortPkgName)) {
          const depType = pkg.dependencies && depName in pkg.dependencies ? 'dependencies' :
                         pkg.devDependencies && depName in pkg.devDependencies ? 'devDependencies' :
                         'peerDependencies';

          // 检查是否已有记录（避免重复）
          const existing = results.find(r =>
            r.platformPackage === platformPkgName &&
            r.parentPackage === pkgPath.replace('node_modules/', '')
          );

          if (!existing) {
            results.push({
              platformPackage: platformPkgName,
              parentPackage: pkgPath.replace('node_modules/', ''),
              parentPackagePath: pkgPath,
              dependency: depName,
              dependencyVersion: allDeps[depName],
              dependencyType: depType,
              hasPlatformPackageInDeps: true
            });
          }
          break;
        }
      }
    }

    // 如果没有找到父包，记录这个事实
    const hasParent = results.some(r => r.platformPackage === platformPkgName);
    if (!hasParent) {
      results.push({
        platformPackage: platformPkgName,
        parentPackage: null,
        parentPackagePath: null,
        hasPlatformPackageInDeps: false,
        note: '未找到引用此平台包的父包'
      });
    }
  }

  return results;
}

function main() {
  const args = process.argv.slice(2);
  const targetPlatforms = args.length > 0 ? args : [];

  // 检查是否传入了平台标识符
  if (targetPlatforms.length === 0) {
    console.error('❌ 请至少传入一个平台标识符');
    console.error('  支持的平台标识符: darwin-arm64, darwin-x64, linux-x64, win32-x64, win32-arm64');
    console.error('  示例: node find-parent-package.js linux-x64');
    console.error('  示例: node find-parent-package.js darwin-arm64 darwin-x64');
    process.exit(1);
  }

  const parentPackages = findParentPackages(targetPlatforms);

  if (parentPackages.length === 0) {
    console.log('ℹ️  未找到任何平台包的父包信息');
    return;
  }

  // 按平台包分组
  const grouped = {};
  parentPackages.forEach(item => {
    if (!grouped[item.platformPackage]) {
      grouped[item.platformPackage] = [];
    }
    grouped[item.platformPackage].push(item);
  });

  console.log(`🔍 平台包的父包信息 (${targetPlatforms.join(', ')}):`);
  console.log('');

  Object.keys(grouped).forEach((platformPkg, pkgIndex) => {
    console.log(`${pkgIndex + 1}. ${platformPkg}`);

    const items = grouped[platformPkg];
    const hasParent = items.some(item => item.parentPackage);

    if (!hasParent) {
      console.log('   ❌ 未找到引用此平台包的父包');
      console.log('');
      return;
    }

    items.forEach((item, itemIndex) => {
      if (!item.parentPackage) return;

      console.log(`   ${itemIndex + 1}. 父包: ${item.parentPackage}`);
      console.log(`      路径: ${item.parentPackagePath}`);

      if (item.optionalDependency) {
        console.log(`      optionalDependencies: ${item.optionalDependency}@${item.optionalVersion}`);
      } else if (item.dependency) {
        console.log(`      ${item.dependencyType}: ${item.dependency}@${item.dependencyVersion}`);
      }

      console.log(`      包含平台包: ${item.hasPlatformPackageInDeps ? '是' : '否'}`);
      console.log('');
    });
  });
}

if (require.main === module) {
  main();
}

module.exports = { findParentPackages };
