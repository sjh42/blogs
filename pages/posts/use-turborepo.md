---
title: Manage Monorepo with pnpm
duration: 10min
date: 2022-10-15
tags: monorepo
desc: 总结
lang: zh
---

## 1. Setup

使用`create-turbo`去创建新repo

```bash
npx create-turbo@latest
```

然后会让你取名（默认my-turborepo），选择包管理器，其中有

- npm
- pnpm
- yarn

然后cd进入`my-turborepo`文件夹中，install

这样安装的turborepo带有模板，这不是我需要的，所以我们新建一个文件夹，进行初始化，然后`run script`

<Note desc="提示" color="border-yellow-400" icon-bg="bg-yellow-400">
  <template #title>
    安装的前提，必须要在工作区根目录中有pnpm-workspace.yaml文件
  </template>
</Note>

```bash
pnpm add turbo -Dw
```

然后创建pnpm-workspace.yaml

```yaml
packages:
  - packages/**
```



## 2. configure

创建文件turbo.json

```json
{
  "$schema": "https://turborepo.org/schema.json"
}
```

### 2.1 createa a pipeline

```json
{
  "$schema": "https://turborepo.org/schema.json",
  "pipeline": {
    "build": {
      // A package's `build` script depends on that package's
      // dependencies and devDependencies
      // `build` tasks  being completed first
      // (the `^` symbol signifies `upstream`).
      "dependsOn": ["^build"],
      // note: output globs are relative to each package's `package.json`
      // (and not the monorepo root)
      "outputs": [".next/**"]
    },
    "test": {
      // A package's `test` script depends on that package's
      // own `build` script being completed first.
      "dependsOn": ["build"],
      "outputs": [],
      // A package's `test` script should only be rerun when
      // either a `.tsx` or `.ts` file has changed in `src` or `test` folders.
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts", "test/**/*.tsx"]
    },
    "lint": {
      // A package's `lint` script has no dependencies and
      // can be run whenever. It also has no filesystem outputs.
      "outputs": []
    },
    "deploy": {
      // A package's `deploy` script depends on the `build`,
      // `test`, and `lint` scripts of the same package
      // being completed. It also has no filesystem outputs.
      "dependsOn": ["build", "test", "lint"],
      "outputs": []
    }
  }
}
```

## 3. create-`package.json`-scripts

```json
{
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "dev": "turbo run dev"
  }
}
```

配置完任务流后，可以这样执行

```bash
turbo run build test lint dev
```

### 3.1 run script

```bash
# pnpm
pnpm build --filter web...

# turbo
turbo run build --scope=web
# or (excluding packages depending on `web`, none in this case)
turbo run build --scope=web --no-deps
```
你也可以继续使用`pnpm`来运行script, 因为缓存可能并不是必须的
