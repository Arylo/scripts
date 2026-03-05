# Changesets

## 说明

本项目使用 [Changesets](https://github.com/changesets/changesets) 管理版本发布和 changelog。

## 创建 changeset

在提交 PR 前，请运行以下命令创建一个 changeset 文件来记录你的改动：

```bash
npm run changeset
```

系统会提示你选择需要发布的包、版本号和简要描述。

## 提交和发布

当 changeset 文件准备好后：

1. 提交到 PR
2. Maintainer 审核后合并到主分支
3. 运行发布脚本完成版本更新和发布

更多信息请查看 [Changesets 文档](https://github.com/changesets/changesets)。
