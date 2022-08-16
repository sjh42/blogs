---
title: Type Challenge
date: 2022-08-16
tags: typescript
desc: 文档
---

## 2 - Get Return Type
```ts
type MyReturnType<T> = T extends (...args: any[]) => infer T ? T: never
```

## 5 - Get Readonly Keys
```ts
type GetReadonlyKeys<T> = {
  [K in keyof T as Equal<{ [P in K] : T[P]}, { readonly [P in K] : T[P]}> extends true ? K : never] : T[K]
} extends infer F ? keyof F : never
```
