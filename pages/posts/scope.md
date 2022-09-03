---
title: lexical scope
desc: 总结
date: 2021-06-20
tags: scope
duration: 10min
---

## 1. 作用域
> 尽管通常将 JavaScript 归类为“动态”或“解释执行”语言，但事实上它是一门编译语言。但与传统的编译语言不同，它不是提前编译的，编译结果也不能在分布式系统中进行移植。

在传统编译语言的流程中，程序中的一段源代码在执行之前会经历三个步骤，统称为“编译”。
- 分词/词法分析（Tokenizing/Lexing）
> 这个过程会将由字符组成的字符串分解成（对编程语言来说）有意义的代码块，这些代码块被称为词法单元（token）。例如，考虑程序 var a = 2;。这段程序通常会被分解成为下面这些词法单元：var、a、=、2 、;。空格是否会被当作词法单元，取决于空格在这门语言中是否具有意义。
- 解析/语法分析（Parsing）
> 这个过程是将词法单元流（数组）转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树。这个树被称为“抽象语法树”（Abstract Syntax Tree，AST）。var a = 2; 的抽象语法树中可能会有一个叫作 VariableDeclaration 的顶级节点，接下来是一个叫作 Identifier（它的值是 a）的子节点，以及一个叫作 AssignmentExpression的子节点。AssignmentExpression 节点有一个叫作 NumericLiteral（它的值是 2）的子节点。
- 代码生成
> 将 AST 转换为可执行代码的过程称被称为代码生成。这个过程与语言、目标平台等息息相关。抛开具体细节，简单来说就是有某种方法可以将 var a = 2; 的 AST 转化为一组机器指令，用来创建一个叫作 a 的变量（包括分配内存等），并将一个值储存在 a 中。

### 1.1 理解作用域
查询作用域的过程分三个角色
1. 引擎
> 从头到尾负责整个 JavaScript 程序的编译及执行过程。
2. 编译器
> 引擎的好朋友之一，负责语法分析及代码生成等脏活累活
3. 作用域
> 引擎的另一位好朋友，负责收集并维护由所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限。

引擎在查找变量的过程中会进行`LHS`和`RHS`查询
- LHS: `LHS` 查询则是试图找到变量的容器本身
- RHS: 可以将`RHS`理解成 retrieve his source value（取到它的源值），这意味着“得到某某的值”。

作用域可以理解成这样的一张图：
<img src='/scope.jpeg' alt='作用域'/>

这个建筑代表程序中的嵌套作用域链。第一层楼代表当前的执行作用域，也就是你所处的位置。建筑的顶层代表全局作用域。LHS 和 RHS 引用都会在当前楼层进行查找，如果没有找到，就会坐电梯前往上一层楼，如果还是没有找到就继续向上，以此类推。一旦抵达顶层（全局作用域），可能找到了你所需的变量，也可能没找到，但无论如何查找过程都将停止。

### 1.2 异常
- 如果 RHS 查询在所有嵌套的作用域中遍寻不到所需的变量，引擎就会抛出 ReferenceError异常
- 如果 RHS 查询找到了一个变量，但是你尝试对这个变量的值进行不合理的操作，比如试图对一个非函数类型的值进行函数调用，或着引用 null 或 undefined 类型的值中的属性，那么引擎会抛出另外一种类型的异常，叫作 TypeError。
- ReferenceError 同作用域判别失败相关，而 TypeError 则代表作用域判别成功了，但是对结果的操作是非法或不合理的。

### 总结
**作用域是一套规则，用于确定在何处以及如何查找变量（标识符）。如果查找的目的是对变量进行赋值，那么就会使用 `LHS` 查询；如果目的是获取变量的值，就会使用 `RHS` 查询。赋值操作符会导致 `LHS` 查询。＝操作符或调用函数时传入参数的操作都会导致关联作用域的赋值操作。**

**`LHS` 和 `RHS` 查询都会在当前执行作用域中开始，如果有需要（也就是说它们没有找到所需的标识符），就会向上级作用域继续查找目标标识符，这样每次上升一级作用域（一层楼），最后抵达全局作用域（顶层），无论找到或没找到都将停止。不成功的 RHS 引用会导致抛出 ReferenceError 异常。不成功的 LHS 引用会导致自动隐式地创建一个全局变量（非严格模式下），该变量使用 LHS 引用的目标作为标识符，或者抛出 ReferenceError 异常（严格模式下）。**