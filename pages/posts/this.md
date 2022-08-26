---

title: this
desc: 总结
date: 2021-06-22
tags: this
duration: 40min
---

## this 是什么

`this`试在运行时进行绑定的，并不是在编写时绑定的，它的上下文取决于函数调用时的各种条件。this 的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。

当一个函数被调用时，会创建一个调用栈，里面会记录函数在哪里调用，函数的调用方法，传入的参数等信息。`this`就是调用栈中的一个属性，会在函数执行的过程中找到

> `this`既不指向函数自身也不指向函数的词法作用域
>
> `this` 在 [类](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes) 中的表现与在函数中类似，因为类本质上也是函数，但也有一些区别和注意事项。在类的构造函数中，`this` 是一个常规对象。类中所有非静态的方法都会被添加到 `this` 的原型中：

## 调用位置

```js
function baz() {
    // 当前调用栈时:baz
    // 所以，当前的调用位置是全局作用域
    console.log('baz')
    bar() // bar的调用位置
}

function bar() {
    // 当前调用栈时:baz -> bar
    // 所以，当前的调用位置是baz
    console.log('bar')
    foo() // foo的调用位置
}

function foo() {
    // 当前调用栈时:baz -> bar -> foo
    // 所以，当前的调用位置是bar
    console.log('foo')
}

baz()
```

## 绑定规则

### 1. 默认绑定

> 首先要介绍的是最常用的函数调用类型：独立函数调用。可以把这条规则看作是无法应用其他规则时的默认规则

```js
function foo() {
    console.log(this.a)
}

var a = 2

foo() // 2
```

那么我们怎么知道这里应用了默认绑定呢？可以通过分析调用位置来看看 foo() 是如何调用的。在代码中，foo() 是直接使用不带任何修饰的函数引用进行调用的，因此只能使用默认绑定，无法应用其他规则。
如果使用严格模式（strict mode），那么全局对象将无法使用默认绑定，因此 this 会绑定到 undefined：

```js
function foo() { 
 "use strict"
 	console.log( this.a )
}

var a = 2

foo(); // TypeError: this is undefined
```

**非常微妙又是十分重要的细节，虽然 this 的绑定规则完全取决于调用位置，但是只有 foo() 运行在非 strict mode 下时，默认绑定才能绑定到全局对象；严格模式下与 foo()的调用位置无关：** 

```js
function foo() {
 console.log( this.a )
}

var a = 2

(function(){ 
 "use strict";
 	foo(); // 2 
})();
```

### 2. 隐式绑定

```js
function foo() {
    console.log(this.a)
}

var a = 3

var obj = {
    a: 2,
    foo: foo
}

obj.foo() // 2
```

**隐式丢失**
一个最常见的 this 绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是说它会应用默认绑定，从而把 this 绑定到全局对象或者 undefined 上，取决于是否是严格模式

```js 
function foo() {
	console.log(this.a)
}

var obj = {
    a: 2,
    foo: foo
}

var bar = obj.foo
var a = 'oops, global'
bar() // 'oops, global'
```

虽然 bar 是 obj.foo 的一个引用，但是实际上，它引用的是 foo 函数本身，因此此时的bar() 其实是一个不带任何修饰的函数调用，因此应用了默认绑定

```js
function foo() {
	console.log(this.a)
}

var obj = {
    a: 2,
    foo: foo
}

var a = 'oops, global'

setTimeout(obj.foo, 100) // 'oops, global'

// JavaScript 环境中内置的 setTimeout() 函数实现和下面的伪代码类似：
function setTimeout(fn,delay) {
 // 等待 delay 毫秒
 fn(); // <-- 调用位置！
}
```

### 3. 显式绑定

> 就是语言内部提供的函数，`call` 、`apply`、`bind` 

```js
function foo(){
    console.log(this.a)
}

var obj = {
    a: 2
}

var a = 3

foo.call(obj) // 2
```

通过 `foo.call(..)`，我们可以在调用 foo 时强制把它的 this 绑定到 `obj `上。

如果你传入了一个原始值（字符串类型、布尔类型或者数字类型）来当作 this 的绑定对象，这个原始值会被转换成它的对象形式（也就是 new String(..)、new Boolean(..) 或者new Number(..)）。这通常被称为“装箱”。

可惜，显式绑定仍然无法解决我们之前提出的丢失绑定问题。

**1.硬绑定**

但是显式绑定的一个变种可以解决这个问题

```js
function foo(){
    console.log(this.a)
}

var obj = {
    a: 2
}

var a = 3

var bar = function() {
	foo.call(obj)
}

bar() // 2
setTimeout(bar, 100)

// 硬绑定的 bar 不可能再修改它的 this
bar.call( window ); // 2

```

### 4. new绑定

**使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作:**

> 1. 创建（或者说构造）一个全新的对象。
> 2. 这个新对象会被执行 [[ 原型 ]] 连接。
> 3. 这个新对象会绑定到函数调用的 this。
> 4. 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象。

```js
function foo(a) {
	this.a = a
} 
var bar = new foo(2)
console.log(bar.a)  // 2
```

使用 new 来调用 `foo(..)` 时，我们会构造一个新对象并把它绑定到` foo(..)` 调用中的 `this`上。new 是最后一种可以影响函数调用时 this 绑定行为的方法，我们称之为 new 绑定。

## 绑定例外

### 1. 被忽略的this

如果你把 null 或者 undefined 作为 this 的绑定对象传入 call、apply 或者 bind，这些值在调用时会被忽略，实际应用的是默认绑定规则：

```js
function foo() { 
	console.log( this.a )
}
var a = 2
foo.call( null );// 2
```

那么什么情况下你会传入 null 呢？
一种非常常见的做法是使用 apply(..) 来“展开”一个数组，并当作参数传入一个函数。类似地，bind(..) 可以对参数进行柯里化（预先设置一些参数），这种方法有时非常有用：

```js
function foo(a,b) {
	console.log( "a:" + a + ", b:" + b )
}
// 把数组“展开”成参数
foo.apply( null, [2, 3] )  // a:2, b:3
// 使用 bind(..) 进行柯里化
var bar = foo.bind( null, 2 )
bar( 3 ) // a:2, b:3
```

这两种方法都需要传入一个参数当作 this 的绑定对象。如果函数并不关心 this 的话，你仍然需要传入一个占位值，这时 null 可能是一个不错的选择，就像代码所示的那样。

然而，总是使用 null 来忽略 this 绑定可能产生一些副作用。如果某个函数确实使用了this（比如第三方库中的一个函数），那默认绑定规则会把 this 绑定到全局对象（在浏览器中这个对象是 window），这将导致不可预计的后果（比如修改全局对象）。显而易见，这种方式可能会导致许多难以分析和追踪的 bug。

**一种更安全的this用法: 一个空的非委托的对象**

```js
function foo(a,b) {
	console.log( "a:" + a + ", b:" + b )
}
// 我们的 DMZ 空对象
var ø = Object.create( null )
// 把数组展开成参数
foo.apply( ø, [2, 3] ) // a:2, b:3
// 使用 bind(..) 进行柯里化
var bar = foo.bind( ø, 2 )
bar( 3 ) // a:2, b:3
```

### 2. 箭头函数

在[箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)中，`this`与封闭词法环境的`this`保持一致。在全局代码中，它将被设置为全局对象：

我们来看看箭头函数的词法作用域：

```js
function foo(){
    return (a) => {
        // this继承自foo()
        console.log(this.a)
    }
}

var obj1 = {
    a: 2
}

var obj2 = {
    a: 3
}

var bar = foo.call(obj1)
bar.call(obj2) // 2
```

`foo() `内部创建的箭头函数会捕获调用时 `foo() `的 `this`。由于 `foo()` 的 `this` 绑定到 `obj1`，`bar`（引用箭头函数）的 `this` 也会绑定到 `obj1`，箭头函数的绑定无法被修改。（`new` 也不行！）

## 其他地方的this

### 1. getter 与 setter 中的 `this`

再次，相同的概念也适用于当函数在一个 `getter` 或者 `setter` 中被调用。用作 `getter` 或 `setter` 的函数都会把 `this` 绑定到设置或获取属性的对象。

```js
function sum() {
  return this.a + this.b + this.c;
}

var o = {
  a: 1,
  b: 2,
  c: 3,
  get average() {
    return (this.a + this.b + this.c) / 3;
  }
}

Object.defineProperty(o, 'sum', {
  get: sum,
  enumerable: true,
  configurable: true,
});

console.log(o.average, o.sum) // logs 2, 6
```

### 2. [类中的 this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this#类中的_this)

和其他普通函数一样，方法中的 `this` 值取决于它们如何被调用。有时，改写这个行为，让类中的 `this` 值总是指向这个类实例会很有用。为了做到这一点，可在构造函数中绑定类方法：

```js
class Car {
  constructor() {
    // Bind sayBye but not sayHi to show the difference
    this.sayBye = this.sayBye.bind(this);
  }
  sayHi() {
    console.log(`Hello from ${this.name}`);
  }
  sayBye() {
    console.log(`Bye from ${this.name}`);
  }
  get name() {
    return 'Ferrari';
  }
}

class Bird {
  get name() {
    return 'Tweety';
  }
}

const car = new Car();
const bird = new Bird();

// The value of 'this' in methods depends on their caller
car.sayHi(); // Hello from Ferrari
bird.sayHi = car.sayHi;
bird.sayHi(); // Hello from Tweety

// For bound methods, 'this' doesn't depend on the caller
bird.sayBye = car.sayBye;
bird.sayBye();  // Bye from Ferrari
```

