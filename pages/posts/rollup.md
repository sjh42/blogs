---
title: rollup简单打包配置
date: 2022-07-26
duration: 3min
---

## rollup 配置

```js
import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import liverreload from 'rollup-plugin-livereload'
import typescript from '@rollup/plugin-typescript'

export default {
  // 入口文件
  input: 'src/index.ts',
  // 打包产生的文件配置
  output: {
    // 打包产物
    file: '.output/index.js',
    // 生成包的格式
    // 将软件包保存为 ES 模块文件，在现代浏览器中可以通过 <script type=module> 标签引入
    format: 'esm',
    sourcemap: false
  },
  plugins: [
    // 开启本地服务器
    serve({
      host: 'localhost',
      port: 8001,
      open: true,
      openPage: '/public/index.html'
    }),
    // 编译ts文件 --- 此插件会读取当前项目下的tsconfig
    typescript({
      sourceMap: true
    }),
    nodeResolve(),
    // 压缩打包产物
    terser(),
    // 热更新
    liverreload()
  ]
}
```

## packages 配置

```json
{
  "script": {
    // -c 读取本地rollup.config.js文件
    // -w 监听源文件是否有改动，如果有改动，重新打包
    "dev": "rollup -c -w",
    "build": "rollup -c"
  },
  "devDependencies": {
    "@rollup/plugin-node-resolve": "^13.3.0",
    "@rollup/plugin-replace": "^4.0.0",
    "@rollup/plugin-typescript": "^8.3.3",
    "@types/fs-extra": "^9.0.13",
    "@types/node": "^18.0.6",
    "cross-env": "^7.0.3",
    "fast-glob": "^3.2.11",
    "fs-extra": "^10.1.0",
    "rollup": "^2.77.1",
    "rollup-plugin-livereload": "^2.0.5",
    "rollup-plugin-serve": "^2.0.0",
    "rollup-plugin-terser": "^7.0.2",
    "tslib": "^2.4.0",
    "typescript": "^4.7.4"
  }
}
```
