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

## 10 -Tuple to Union
```ts
type TupleToUnion<T extends any[]> = T[number]
```

## 11 - Tuple to Object
```ts
type TupleToObject<T extends readonly (keyof any)[]> = {
  [K in T[number]] : K
}
```

## 12 - Chainable Options
```ts
type Chainable<T = {}> = {
  option:<K extends string, V>(key: K extends keyof T ? V extends T[K] ? never : K : K, value: V) => Chainable<Omit<T,K> & Record<K,V>>
  get: () => T
}
```

## 14 - First of Array
```ts 
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never
```

## 15 - Last of Array
```ts 
type Last<T extends any[]> = T extends [...any[], infer F] ? F : never
```

## 16 - Pop
```ts 
type Pop<T extends any[]> = T extends [...infer F, any] ? F : never
```

## 17 - Currying 1
```ts 
type getParams<T> = T extends  (...args : [ ...infer F ]) => any ? F : never

type Shift<T extends any[]> = T extends [any, ...infer F] ? F : never

type Gen<Tuple extends unknown[]> = Shift<Tuple>['length'] extends 0 ? (a: Tuple[0]) => true : (a: Tuple[0]) => Gen<Shift<Tuple>>

declare function Currying<T extends (...args : any[]) => any>(fn: T):Gen<getParams<T>> 
```

## 18 - Length of Tuple
```ts
type Length<T extends readonly any[]> =  T['length']
```

## 20 - Promise.all
```ts 
declare function PromiseAll<T extends unknown[]>(values: readonly [...T]): Promise<{[ P in keyof T]: T[P] extends Promise<infer R> ? R : T[P]}>
```

## 42 - Exclude
```ts
type MyExclude<T, U> = T extends U ? never : T
```

## 62 - Type Lookup
```ts
type LookUp<U, T> = U extends { type: infer F} 
  ? F extends T ? U : never 
  : never
```

## 106 - Trim Left
```ts
type TrimLeft<S extends string> = S extends `${' ' | '\n' | '\t'}${ infer R}` ? TrimLeft<R> : S
```

## 108 - Trim
```ts 
type WhiteSpace = " " | "\n" | "\t"

type Trim<S extends string> =  S extends | `${WhiteSpace}${infer R}` | `${infer R}${WhiteSpace}` ? Trim<R> : S  
```

## 110 - Capitalize
```ts 
type MyCapitalize<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S
```

## 116 - Replace
```ts
type Replace<S extends string, From extends string, To extends string> = From extends '' 
  ? S 
  : S extends `${infer Start}${From}${infer End}`
    ? `${Start}${To}${End}`
    : S
```

## 119 - ReplaceAll
```ts 
type ReplaceAll<S extends string, From extends string, To extends string> = S extends `${infer Start}${From}${infer End}`
  ? `${Start}${From extends '' ? From : To}${ReplaceAll<End, From, To>}`
  : S
```

## 189 - Awaited
```ts
type MyAwaited<T extends Promise<unknown>> = T extends Promise<infer R>
 ? R extends Promise<unknown>
  ? MyAwaited<R>
  : R
: never
```

## 191 - Append Argument
```ts
type AppendArgument<T extends (...args: any[]) => any, U> 
  = T extends (...args: infer A) 
  => infer B ? (...args: [...A, U]) 
  => B : never
```

## 296 - Permutation
```ts
type Permutation<T, K = T> = K[] extends never[] ? [] : K extends K ? [K, ...Permutation<Exclude<T,K>>] : never
```

## 298 - Length of String
```ts
type StringToArray<S extends string> = S extends `${infer F}${infer R}`
  ? [F, ...StringToArray<R>]
  : []

type LengthOfString<S extends string> = StringToArray<S>['length']
```

## 459 - Flatten
```ts
type Flatten<T extends unknown[]> = T extends [infer F, ...infer R] 
  ? [...(F extends any[] 
    ? Flatten<F> 
    : [F]), ...Flatten<R>] 
  : []
```

# 527 - Append to object
```ts
type AppendToObject<T, K extends PropertyKey, V> = {
  [P in keyof T | K] : P extends keyof T ? T[P]: V
}
```
