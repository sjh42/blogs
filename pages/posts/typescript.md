---
title: TypeScript 面试题
desc: 收集
date: 2023-03-17
tags: TypeScript
---

### 1. 有了解过 TypeScript 吗，讲一下泛型？

  1. TypeScript中的泛型（Generics）指的是一种可以在定义函数、类和接口时使用的占位符类型，它可以用来表示函数、类和接口中的参数类型或返回值类型，以及定义复杂数据结构中的数据类型。

  使用泛型可以提高代码的复用性和灵活性，使代码更加通用。在定义泛型时，使用尖括号 < > 来声明泛型参数，例如：

  ```ts
  function identity<T>(arg: T): T {
    return arg;
  }
  ```
  总之，泛型是 TypeScript 中非常重要的特性，它可以提高代码的灵活性和复用性，使代码更加通用和易于维护

### 2. infer
  1. infer 是 TypeScript 4.1 新增的关键字，它可以用来推断泛型的类型，例如：

  ```ts
  type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) =>   infer R ? R : any;
  ```

### 3. any 和 unknow 的区别

  1. `any` 表示任意类型，一旦一个变量被声明为 `any` 类型，就可以随意赋值任何类型的值给它，而且不会被 `TypeScript` 编译器检查类型的正确性。在一些情况下，使用 `any` 类型可以方便地处理一些类型不明确的情况，但是过多地使用 `any` 类型会破坏 `TypeScript` 类型检查的作用，不利于代码的维护和扩展。

  2. `unknown` 表示未知类型，它与 `any` 类型类似，但是有一个重要的区别，那就是不能随意将 `unknown` 类型的值赋给其他类型的变量，因为编译器无法确定这个变量的类型是否兼容。如果要将 `unknown` 类型的值赋给其他类型的变量，需要使用类型断言或者进行类型检查。

  `总的来说，unknown` 类型比 `any` 类型更加安全，因为它可以防止不安全的类型转换。在使用 `TypeScript` 编写程序时，应该尽可能地使用确定的类型，避免使用 `any` 类型，而是使用 `unknown` 类型来进行类型推断。
