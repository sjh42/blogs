---
title: 前端工程化
date: 2023-03-22
tags: bundler
desc: 收集
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
