#!/usr/bin/env node

/**
 * 检查平台包的安装状态
 * 使用: node check-installation-status.js [平台标识符...]
 * 示例:
 *   node check-installation-status.js linux-x64
 *   node check-installation-status.js darwin-arm64 darwin-x64
 *   node check-installation-status.js linux-x64 win32-x64
 * 注意: 必须至少传入一个平台标识符
 */

const fs = require('fs');
const path = require('path');
const { getPlatformPackages } = require('./get-platform-packages.js');

function checkInstallationStatus(targetPlatforms = []) {
  // 使用当前工作目录作为根目录
  const rootDir = process.cwd();
  const lockfilePath = path.join(rootDir, 'package-lock.json');

  if (!fs.existsSync(lockfilePath)) {
    console.error('❌ package-lock.json 文件不存在');
    console.error(`   预期路径: ${lockfilePath}`);
    process.exit(1);
  }

  // 获取所有平台包信息
  const platformPackages = getPlatformPackages(targetPlatforms);

  if (platformPackages.length === 0) {
    console.log(`ℹ️  未找到 ${targetPlatforms.join(', ')} 平台包`);
    return { success: false, packages: [] };
  }

  const results = [];
  let allInstalled = true;

  // 检查每个平台包的安装状态
  for (const pkg of platformPackages) {
    const pkgPath = path.join(rootDir, pkg.path);
    const packageJsonPath = path.join(pkgPath, 'package.json');

    let status = 'unknown';
    let installed = false;
    let packageJson = null;

    // 检查平台包目录是否存在
    if (fs.existsSync(pkgPath)) {
      // 检查 package.json 是否存在
      if (fs.existsSync(packageJsonPath)) {
        try {
          packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          installed = true;
          status = 'installed';
        } catch (err) {
          installed = false;
          status = 'corrupted';
        }
      } else {
        installed = false;
        status = 'missing-package-json';
      }
    } else {
      installed = false;
      status = 'missing-directory';
    }

    if (!installed) {
      allInstalled = false;
    }

    results.push({
      name: pkg.name,
      version: pkg.version,
      pattern: pkg.pattern,
      path: pkg.path,
      resolved: pkg.resolved || '',
      optional: pkg.optional || false,
      installed,
      status,
      packageJson: installed ? {
        name: packageJson.name,
        version: packageJson.version,
        main: packageJson.main || '',
        description: packageJson.description || ''
      } : null
    });
  }

  return {
    success: allInstalled,
    packages: results,
    total: results.length,
    installed: results.filter(p => p.installed).length,
    missing: results.filter(p => !p.installed).length
  };
}

function displayResults(results) {
  console.log(`📊 平台包安装状态检查 (共 ${results.total} 个包):`);
  console.log('');

  // 按平台分组显示
  const platforms = {};
  results.packages.forEach(pkg => {
    if (!platforms[pkg.pattern]) {
      platforms[pkg.pattern] = [];
    }
    platforms[pkg.pattern].push(pkg);
  });

  for (const [platform, packages] of Object.entries(platforms)) {
    console.log(`📍 平台: ${platform}`);
    console.log('='.repeat(40));

    packages.forEach((pkg, index) => {
      const statusIcon = pkg.installed ? '✅' : '❌';
      console.log(`${index + 1}. ${statusIcon} ${pkg.name}@${pkg.version}`);
      console.log(`   状态: ${getStatusText(pkg.status)}`);

      if (pkg.installed) {
        console.log(`   路径: ${pkg.path}`);
        if (pkg.packageJson && pkg.packageJson.description) {
          console.log(`   描述: ${pkg.packageJson.description}`);
        }
      } else {
        console.log(`   预期路径: ${pkg.path}`);
        if (pkg.resolved) {
          console.log(`   Resolved URL: ${pkg.resolved}`);
        }
      }

      console.log(`   可选依赖: ${pkg.optional ? '是' : '否'}`);
      console.log('');
    });
  }

  // 汇总信息
  console.log('📈 汇总信息:');
  console.log(`   ✅ 已安装: ${results.installed}/${results.total}`);
  console.log(`   ❌ 缺失: ${results.missing}/${results.total}`);
  console.log(`   📊 安装率: ${((results.installed / results.total) * 100).toFixed(1)}%`);

  if (!results.success) {
    console.log('\n⚠️  警告: 发现缺失的平台包，可能需要重新安装');
  } else {
    console.log('\n🎉 所有平台包均已正确安装');
  }
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
  const targetPlatforms = args.length > 0 ? args : [];

  // 检查是否传入了平台标识符
  if (targetPlatforms.length === 0) {
    console.error('❌ 请至少传入一个平台标识符');
    console.error('  支持的平台标识符: darwin-arm64, darwin-x64, linux-x64, linux-arm64, linux-arm, win32-x64, win32-arm64');
    console.error('  示例: node check-installation-status.js linux-x64');
    console.error('  示例: node check-installation-status.js darwin-arm64 darwin-x64 linux-x64 linux-arm64');
    process.exit(1);
  }

  console.log(`🔍 检查 ${targetPlatforms.join(', ')} 平台包的安装状态...\n`);

  const results = checkInstallationStatus(targetPlatforms);
  displayResults(results);

  // 返回适当的退出码
  process.exit(results.success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = { checkInstallationStatus };
