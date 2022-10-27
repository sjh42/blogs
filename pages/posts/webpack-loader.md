---
title: webpack简单loader实现
duration: 5min
date: 2021-08-23
---

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

module.exports = function(source) {
  try {
    const doc = yaml.load(source)
    return `${JSON.stringify(doc, null, 2)}`;
  } catch(error) {
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
          loader:'babel-loader',
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
