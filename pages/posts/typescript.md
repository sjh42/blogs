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

## 7 - Readonly
```ts
type MyReadonly<T> = {
  readonly [K in keyof T] : T[K]
} 
```

## 8 - Readonly2
```ts 
type MyReadonly2<T, K = keyof T> = {
  [P in keyof T as P extends K ? never : P] : T[P]
} & {
  readonly [P in keyof T as P extends K ? P : never] : T[P]
}
```

## 9 - deep readonly
``` ts
type DeepReadonly<T> = keyof T extends never ? T : { readonly [K in keyof T]: DeepReadonly<T[K]>}
```
