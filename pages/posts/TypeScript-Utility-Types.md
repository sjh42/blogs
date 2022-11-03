---
title: TypeScript Utility Types
date: 2022-07-01
tags: typescript
desc: 记录
---

## [1. Awaited](https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype)

表示一个 `Promise` 的 `resolve` 值类型，可以递归的执行拆箱

```ts
type A = Awaited<Promise<string>> // type A = string
type B = Awaited<Promise<Promise<number>>> // type B = number
type C = Awaited<boolean | Promise<number>>  // type C = boolean | number
```

## [2. Partial](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)

返回一个表示给定类型的所有子集可选的类型
```ts
interface Todo {
  title: string
  description: string
}

type P = Partial<Todo>

/**
  type P = {
    title?: string | undefined
    description?: string | undefined
  }
*/

```

## [3. Required](https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype)

跟 `Partial` 相反， 可选变必选

```ts
interface Props {
  a?: number
  b?: string
}

const obj2: Required<Props> = { a: 5 }  // no pass

//Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.

const obj2: Required<Props> = { a: 5， b: '123' } // pass

```

## [4. Readonly](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)

构造一个类型，类型的所有属性都设置为只读，这意味着无法重新分配构造类型的属性。

```ts
interface Todo {
  title: string
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
}

todo.title = "Hello" // no pass
// Cannot assign to 'title' because it is a read-only property.
```

## [5. Record<T,K>](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)

构建一个 `object type`, 其 key 为 `T`， value 为 `K`。可用于将一个类型的属性映射到另一个类型

```ts
interface CatInfo {
  age: number
  breed: string
}

type CatName = "miffy" | "boris" | "mordred"

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
}

cats.boris // const cats: Record<CatName, CatInfo>
```

## [6. Pick<T,K>](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)

从`T`中选择一组属性键`K`来构造类型

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = Pick<Todo, "title" | "completed">

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
}
```

## [7. Omit<T,K>](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)

通过从 `T` 中选取所有属性，然后移除 `K` 来构造类型。

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
  createdAt: number
}

type TodoPreview = Omit<Todo, "description"> // type TodoPreview = { completed: boolean createdAt: number title: string }

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  createdAt: 1615544252770,
}

type TodoInfo = Omit<Todo, "completed" | "createdAt"> // // type TodoInfo = { description: string title: string }
 
const todoInfo: TodoInfo = {
  title: "Pick up kids",
  description: "Kindergarten closes at 5pm",
}
```

## [8. Exclude<UnionType, ExcludedMembers>](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers)

通过从 `UnionType` 中排除可分配给 `ExcludedMembers` 的所有联合类型来构造类型。

```ts
type T0 = Exclude<"a" | "b" | "c", "a"> // type T0 = "b" | "c"

type T1 = Exclude<"a" | "b" | "c", "a" | "b"> // type T1 = "c"

type T2 = Exclude<string | number | (() => void), Function> // type T2 = string | number
```

## [9. Extract<T, Union>](https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union)

通过从 `T` 中提取可分配给 `Union` 的所有联合类型来构造类型

```ts
type T0 = Extract<"a" | "b" | "c", "a" | "f"> // type T0 = "a"

type T1 = Extract<string | number | (() => void), Function> // type T1 = () => void
```

## [10. NonNullable](https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype)

通过从 `T` 中排除 `null` 和 `undefined` 来构造类型。

```ts
type T0 = NonNullable<string | number | undefined> // type T0 = string | number

type T1 = NonNullable<string[] | null | undefined> // type T1 = string[]
```
