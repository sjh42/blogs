--- 
title: Object.assign(...) 与 JSON.parse(JSON.stringify(...))的拷贝区别
date: 2021-10-01
lang: zh
duration: 8min
--- 

## [Object.assign(...)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
> `Object.assign()`方法将所有可枚举（`Object.propertyIsEnumerable()` 返回 `true`）和自有（`Object.hasOwnProperty()` 返回 `true`）属性从一个或多个源对象复制到目标对象，返回修改后的对象


如果目标对象与源对象具有相同的 key，则目标对象中的属性将被源对象中的属性覆盖，后面的源对象的属性将类似地覆盖前面的源对象的属性。

`Object.assign` 方法只会拷贝源对象 可枚举的 和 自身的 属性到目标对象。该方法使用源对象的 [[Get]] 和目标对象的 [[Set]]，它会调用 getters 和 setters。故它分配属性，而不仅仅是复制或定义新的属性。如果合并源包含 getters，这可能使其不适合将新属性合并到原型中。

为了将属性定义（包括其可枚举性）复制到原型，应使用 `Object.getOwnPropertyDescriptor()` 和 `Object.defineProperty()`，基本类型 `String` 和 `Symbol` 的属性会被复制。

如果赋值期间出错，例如如果属性不可写，则会抛出 `TypeError`；如果在抛出异常之前添加了任何属性，则会修改 `target` 对象（换句话说，`Object.assign()` 没有“回滚”之前赋值的概念，它是一个尽力而为、可能只会完成部分复制的方法）。

**Object.assign() 不会在 source 对象值为 null 或 undefined 时抛出错误。**

**Object.assign(...)**
```js
const options = {
  obj: {
    a: 1,
    b: 2,
    c: 3,
    arr: [1, 2, 3, 4],
    d: {
      str: 1,
    },
    func: () => {
      console.log(1);
    },
    time: new Date(),
    reg: new RegExp(),
  },
  number: 1,
  length: 2,
};

const str = Object.assign({}, options);

str.number = 2;
str.obj.b = '修改了';
str.obj.d.str = '也修改了';

options.obj.d.str = '修改回来';

console.log(`str`, str);  //str
/*
length: 2
number: 2
obj:
a: 1
arr: (4) [1, 2, 3, 4]
b: "修改了"
c: 3
d: {str: '修改回来'}
func: () => { console.log(1); }
reg: /(?:)/
time: Fri Aug 26 2022 22:36:02 GMT+0800 (中国标准时间) {}
*/
console.log('options', options); // options 
/* 
length: 2
number: 1
obj:
a: 1
arr: (4) [1, 2, 3, 4]
b: "修改了"
c: 3
d: {str: '修改回来'}
func: () => { console.log(1); }
reg: /(?:)/
time: Fri Aug 26 2022 22:36:02 GMT+0800 (中国标准时间) {}
*/
```

## [JSON.stringify(...)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

JSON.stringify()将值转换为相应的 JSON 格式：

> - 转换值如果有 toJSON() 方法，该方法定义什么值将被序列化。
> - 非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中。
> - 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。
> - undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）。函数、undefined 被单独转换时，会返回 undefined，如JSON.stringify(function(){}) or JSON.stringify(undefined).
> - 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。
> - 所有以 symbol 为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们。
> - Date 日期调用了 toJSON() 将其转换为了 string 字符串（同 Date.toISOString()），因此会被当做字符串处理。
> - NaN 和 Infinity 格式的数值及 null 都会被当做 null。
> - 其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性

**JSON.parse(JSON.stringify(...))**

```js
const set = new Set([1, 2, 3, 4]);

const options = {
  obj: {
    a: 1,
    b: 2,
    c: 3,
    arr: [1, 2, 3, 4],
    d: {
      str: 1,
    },
    func: () => {
      console.log(1);
    },
    time: new Date(),
    reg: new RegExp(),
  },
  number: 1,
  length: 2,
  set
};

const str = JSON.parse(JSON.stringify(options));

str.number = 2;
str.obj.b = '修改了';
str.obj.d.str = '也修改了';

options.obj.d.str = '修改回来';

console.log(`str`, str); // str
/*
length: 2
number: 2
obj:
a: 1
arr: (4) [1, 2, 3, 4]
b: "修改了"
c: 3
d: {str: '也修改了'}
reg: {}
set: {},
time: "2022-08-26T15:14:23.910Z"
*/
console.log('options', options); // options
/*
length: 2
number: 1
obj:
a: 1
arr: (4) [1, 2, 3, 4]
b: 2
c: 3
d: {str: '修改回来'}
func: () => { console.log(1); }
reg: /(?:)/
set: Set(4) {1, 2, 3, 4}
time: Fri Aug 26 2022 23:14:23 GMT+0800 (中国标准时间) {}
*/
```

**Object.defineProperty(...)**

```js
const options = {
  obj: {
    a: 1,
    b: 2,
    c: 3,
    arr: [1, 2, 3, 4],
    d: {
      str: 1,
    },
    func: () => {
      console.log(1);
    },
    time: new Date(),
    reg: new RegExp(),
  },
  number: 1,
  length: 2,
};

Object.defineProperty(options, 'obj', {
  enumerable: false
});

// const str = JSON.parse(JSON.stringify(options));
// const str = Object.assign({}, options);

// Object.assign(...) 和 JSON.stringify(...) 都无法拷贝到obj
// str {number: 2, length: 2}
```
