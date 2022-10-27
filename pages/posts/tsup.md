---
title: tsup简单打包配置
date: 2022-10-17
duration: 5min
---

## setup

```shell
pnpm install tsup -D
```

首先需要创建一个**tsup.config.ts**文件

### tsup.config.ts
```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  // 入口文件路径
  entry: ['./src/index.ts'],
  // bundle formats
  format: ['esm', 'cjs', 'iife'],
  // 每次生成前清除输出目录
  clean: true,
  // 压缩代码
  minify: false,
  // 是否使用Esbuild进行代码拆分
  splitting: true,
  sourcemap: false,
  // 会持续监听入口文件的变化
  watch: false,
  // 摇树
  treeshake: false,
  // 传递标志以指示 esbuild 以 JSON 格式生成有关生成的一些元数据
  metafile: true,
  // 如果要支持es5，就需要安装@swc/core
  target: 'es2015',
})
```
或者直接在package.json文件中写入配置

```json
{
  "tsup": {
    "entry": "../.",
    // .....
  },
}
```
