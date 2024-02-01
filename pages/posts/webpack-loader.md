---
title: webpack
duration: 5min
date: 2021-08-23
---

### 1. webpack工作流程

  webpack是一个模块打包工具，可以将各类资源，例如css，图片，js等，转译组合为js格式的bundle文件

  webpack构建的核心任务是完成内容的转换和资源的合并，主要有以下3个阶段：

    1. 初始化阶段
      - 初始化参数：从配置文件，配置对象和Shell参数中读取并与默认参数合并，组成最终使用的参数
      - 创建预编译对象：用上一步得来的配置参数创建Compiler对象
      - 初始化编译环境: 包括注入内置插件，注册各种模块工厂，初始化RuleSet集合，加载配置的插件等
    2. 构建阶段：
      - 开始编译：执行Compiler对象的run方法，创建Compilation对象
      - 确定编译入口： 进入entryOption阶段，读取配置的Entires，递归遍历所有文件的入口，调用Compilation.addEntry将入口文件转换为Dependency对象
      - 编译模块：调用 normalModule 中的 build 开启构建，从 entry 文件开始，调用 loader 对模块进行转译处理，然后调用 JS 解释器（acorn）将内容转化为 AST 对象，然后递归分析依赖，依次处理全部文件。
      - 完成模块编译：在上一步处理好所有模块后，得到模块编译产物和依赖关系图。
    3. 生成阶段
      - 输入资源： 根据入口和模块之间的依赖关系，组装成多个包含多个模块的 Chunk，再把每个 Chunk 转换成一个 Asset 加入到输出列表，这步是可以修改输出内容的最后机会。
      - 写入文件系统（emitAssets）：确定好输出内容后，根据配置的 output 将内容写入文件系统。

遵循Webpack对于loader的定义:
- 简单易用。
- 使用链式传递。
- 模块化的输出。
- 确保无状态。
- 使用 loader utilities。
- 记录 loader 的依赖。
- 解析模块依赖关系。
- 提取通用代码。
- 避免绝对路径。
- 使用 peer dependencies。

## 第一步
```js
npm install js-yaml json-loader -D
```

### yaml-loader.js
```js 
const yaml = require('js-yaml')

module.exports = function (source) {
  try {
    const doc = yaml.load(source)
    return `${JSON.stringify(doc, null, 2)}`
  }
  catch (error) {
    console.error(error)
  }
}
```

### webpack.config.js

```js
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].cjs'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              '@babel/preset-env',
            ],
          }
        }
      },
      {
        test: /\.yaml$/,
        exclude: /node_modules/,
        use: [
          'json-loader', // 接收yaml-loader返回的值
          {
            loader: `${path.resolve(__dirname, './loaders/yaml-loader.js')}` // 最先调用
          }
        ]
      },
    ]
  }
}

```
当链式调用多个 loader 的时候，请记住它们会以相反的顺序执行。取决于数组写法格式，从右向左或者从下向上执行。

- 最后的 loader 最早调用，将会传入原始资源内容。
- 第一个 loader 最后调用，期望值是传出 JavaScript 和 source map（可选）。
- 中间的 loader 执行时，会传入前一个 loader 传出的结果。
