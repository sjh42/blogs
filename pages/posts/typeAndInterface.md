---
title: type and interface
date: 2025-02-20
duration: 6min
---

```ts
interface A {
  name: string;
  age: number;
}

interface B extends A {
  gender: string;
}

interface C extends A, B {
  address: string;
}
```

> interface 可以多次声明，但是类型会合并。

> interface 使用 extends 关键字来进行拓展。

> interface 主要针对对象的结构。

```ts
interface C {
  phone: string;
}

const c: C = {
  name: "John",
  age: 20,
  gender: "male",
  address: "123 Main St",
  phone: "1234567890",
}
```

>type 不能多次声明，会报错。

>type 可以通过通过交叉类型 （&） 来组合多个类型。

>type 可以定义更复杂的类型，比如联合类型、元组，或者使用条件类型、映射类型之类。

```ts
联合类型：type Result = Success | Failure
元组：type Pair = [number, string]
条件类型：type IsString<T> = T extends string ? true : false
映射类型：type Readonly<T> = { readonly [K in keyof T]: T[K] }
```

> 都可以被类实现

```ts
type C1 = B & { address: string };

const c1: C1 = {
  age: 2,
  name: '123',
  gender: '男',
  address: '北京'
}

class C2 implements C1 {
  name: string;
  age: number;
  gender: string;
  address: string
  constructor(name: string, age: number, gender: string, address: string) {
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.address = address
  }
}


const c1: C1 = {
  name: "John",
  age: 20,
  gender: "male",
  address: "123 Main St",
};

// 都可以被类实现
class X implements C {
  name: string;
  age: number;
  gender: string;
  address: string;
  phone: string;

  constructor(name: string, age: number, gender: string, address: string, phone: string) {
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.address = address;
    this.phone = phone;
  }

  getName() {
    return this.name;
  }
}

const x = new X("John", 20, "male", "123 Main St", "1234567890");
x.getName();
```
