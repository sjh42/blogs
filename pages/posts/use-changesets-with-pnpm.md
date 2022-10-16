---
title: Using Changesets with pnpm
date: 2022-10-15
duration: 15min
lang: zh
desc: 翻译
---

## Setup

<Note desc="提示" color="border-yellow-400">
  <template #title>
    安装的前提，必须要在工作区根目录中有pnpm-workspace.yaml文件指定目录
  </template>
</Note>

**pnpm-workspace.yaml**
```yaml
packages: 
 - packages/*
```

要在pnpm工作区上设置changesets，请将changesets作为开发依赖项安装在工作区的根目录中：

```shell
pnpm add -Dw @changesets/cli
```
然后 changesets 的初始化命令：

```shell
pnpm changeset init
```
## Adding new changesets

要生成新的 changesets，请在仓库的根目录中执行 pnpm changeset。 .changeset 目录中生成的 markdown 文件需要被提交到到仓库。


## Releasing changes

1. 运行 pnpm changeset version。 这将提高先前使用 pnpm changeset （以及它们的任何依赖项）的版本，并更新变更日志文件。
2. 运行 pnpm install。 这将更新锁文件并重新构建包。
3. 提交更改。
4. 运行 pnpm publish -r。 此命令将发布所有包含被更新版本且尚未出现在包注册源中的包。

## Using GitHub Actions

要自动执行此过程，您可以将 changeset version 与 GitHub actions 一起使用。

### Bump up package versions

当检测到 changeset 文件被合并到 main 分支时，该 action 将创建一个新的 PR，列出所有应该变更版本号的包。 合并后，包将被更新，您可以通过添加 publish 属性来决定是否发布。

## Publishing

通过添加 publish: pnpm ci:publish 这个执行 changeset publish 的脚本，一旦 PR 是由 changeset version 打开，就会发布到包注册源。
