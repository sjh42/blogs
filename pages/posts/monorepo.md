---
title: Monorepo
duration: 3min
date: 2022-10-15
tags: monorepo
desc: 总结
---

### Setup

首先需要在根目录中执行初始化

```shell
pnpm init
```

然后创建 `pnpm-workspace.yaml` 文件，格式如下，packages文件下里包含子工程

```yaml
packages:
  - 'packages/*'
```
cd 进入packages，执行

```shell
1. pnpm create vite web
2. cd web
3. pnpm i
4. pnpm dev
```

### 简单的工作流

1. Changesets

要在 pnpm 工作空间上配置 changesets，请将 changesets 作为开发依赖项安装在工作空间的根目录中：

```shell
pnpm add -Dw @changesets/cli
```

然后进行初始化

```shell
pnpm changeset init
```

[具体内容可以查看pnpm官网](https://pnpm.io/zh/using-changesets)
