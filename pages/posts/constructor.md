---
title: 《你不知道的JavaScript》 - 构造函数
desc: 总结
date: 2021-06-23
duration: 30min
---

```js
function Foo() {}
const a = new Foo()
Foo.prototype.constructor === Foo // true
a.constructor === Foo // true
```

`Foo.prototype` 默认（在代码中第一行声明时）有一个公共并且不可枚举的属性 `.constructor`, 这个属性引用的是对象关联的函数

> 实际上 `a` 本身并没有 `.constructor` 属性，而且，虽然 `a.constructor` 确实指向 `Foo`函数， 但是这个属性并不是表示 `a` 是 `Foo` 构造的
>> 实际上， `.constructor` 引用同样被委托给了`Foo.prototype`, 而 `Foo.prototype.constructor` 默认指向Foo, 把 .constructor 属性指向 `Foo` 看作是 `a` 对象由 `Foo`“构造”非常容易理解，但这只不过是一种虚假的安全感。`a.constructor` 只是通过默认的 `[[Prototype]]` 委托指向 `Foo`，这和“构造”毫无关系。相反，对于 `.constructor` 的错误理解很容易对你自己产生误导。

举例来说，`Foo.prototype` 的 `.constructor` 属性只是 `Foo` 函数在声明时的默认属性。如果你创建了一个新对象并替换了函数默认的 `.prototype` 对象引用，那么新对象并不会自动获得 `.constructor` 属性。

```js 
function Foo() { /* .. */ }

Foo.prototype = { /* .. */ } // 创建一个新原型对象

const a1 = new Foo()

a1.constructor === Foo // false!
a1.constructor === Object // true!
```
`Object(..)` 并没有“构造”`a1`，对吧？看起来应该是 `Foo()`“构造”了它。大部分开发者都认为是 `Foo()` 执行了构造工作，但是问题在于，如果你认为“`constructor`”表示“由……构造”的话，`a1.constructor` 应该是`Foo`，但是它并不是 `Foo` ！到底怎么回事？ `a1` 并没有 `.constructor` 属性，所以它会委托 `[[Prototype]]` 链上的 `Foo.prototype`。但是这个对象也没有 `.constructor` 属性（不过默认的 `Foo.prototype` 对象有这个属性），所以它会继续委托，这次会委托给委托链顶端的 `Object.prototype`。这个对象有 `.constructor` 属性，指向内置的 `Object(..)` 函数。

#### 手动给Foo函数添加.constructor属性
```js 
function Foo() { /* ... */ }

Foo.prototype = { /* ... */ } // 创建一个新原型对象

// 需要在 Foo.prototype 上“修复”丢失的 .constructor 属性
// 新对象属性起到 Foo.prototype 的作用
Object.defineProperty(Foo.prototype, 'constructor', {
  enumerable: false, // .constructor是不可枚举的
  writable: true,
  configurable: true,
  value: Foo // 让 .constructor 指向 Foo
})
```
修复 · 需要很多手动操作。所有这些工作都是源于把“constructor”错误地理解为“由……构造”，这个误解的代价实在太高了。
实际上，对象的 `.constructor` 会默认指向一个函数，这个函数可以通过对象的 `.prototype`引用。“constructor”和“prototype”这两个词本身的含义可能适用也可能不适用。最好的办法是记住这一点“constructor 并不表示被构造”。

#### Object.setPrototypeOf
```js
function Foo(name) {
  this.name = name
}

Foo.prototype.myName = function () {
  return this.name
}

function Bar(name, label) {
  Foo.call(this, name)
  this.label = label
}
Bar.prototype.constructor === Bar

// 我们创建了一个新的 Bar.prototype 对象并关联到 Foo.prototype
Bar.prototype = Object.create(Foo.prototype)
Bar.prototype.constructor === Foo

// 注意！现在没有 Bar.prototype.constructor 了
// 如果你需要这个属性的话可能需要手动修复一下它
Bar.prototype.myLabel = function () {
  return this.label
}
const a = new Bar('a', 'obj a')
a.myName() // "a"
a.myLabel() // "obj a"
```
```js
// ES6 之前需要抛弃默认的 Bar.prototype
Bar.ptototype = Object.create(Foo.prototype)
// ES6 开始可以直接修改现有的 Bar.prototype
Object.setPrototypeOf(Bar.prototype, Foo.prototype)
```

#### __Proto__
`.__proto__ `看起来很像一个属性，但是实际上它更像一个 `getter/setter`, .__proto__ 的实现大致上是这样的:
```js 
Object.defineProperty(Object.prototype, '__proto__', {
  get() {
    return Object.getPrototypeOf(this)
  },
  set(o) {
    // ES6 中的 setPrototypeOf(..)
    Object.setPrototypeOf(this, o)
    return o
  }
})
```

### 1. 构造函数还是调用
当你在普通的函数调用前面加上 new 关键字之后，new 会劫持所有普通函数并用构造对象的形式来调用它,

```js 
function NothingSpecial() {
  console.log('nothing to me!')
}

const a = new NothingSpecial() // nothing to me!

a // NothingSpecial {}
```

```js 
function NothingSpecial() {
  return {
    a: 1,
    b: 2
  }
}

const a = NothingSpecial()

a // {a: 1, b: 2}
```
`NothingSpecial` 只是一个普通的函数，但是使用 `new` 调用时，它就会构造一个对象并赋值给 `a，这看起来像是` `new` 的一个副作用（无论如何都会构造一个对象）。`这个调用是一个构造函数调用`，但是 `NothingSpecial` 本身并不是一个`构造函数`。

换句话说，在 JavaScript 中对于“构造函数”最准确的解释是，所有带 new 的函数调用。函数不是构造函数，但是当且仅当使用 new 时，函数调用会变成“构造函数调用”。

使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。
1. 创建（或者说构造）一个全新的对象。
2. 这个新对象会被执行 [[ 原型 ]] 连接。
3. 这个新对象会绑定到函数调用的 this。
4. 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象。  

#### 手写new
```js
function new() {
  const args = Array.from(arguments)

  const constructor = args.shift()

  const target = Object.create(constructor.prototype)

  const result = constructor.apply(target, args)

  return typeof result === 'object' && result !== null ? result : target;
}
```
