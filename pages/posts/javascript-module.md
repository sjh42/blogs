---
title: JS Module
date: 2022-04-12
duration: 30min
---

## 前言

在 ES6 之前，为了弥补 JavaScript 一直没有模块（module）体系的缺陷，社区指定一些模块加载方案，主要有 CommonJS（cjs）和 AMD，其中 cjs 运用于服务器，AMD 运用于浏览器。（还有个为了兼容 cjs 和 AMD 的 UMD 模块）

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

```js
// CommonJS module
let { stat, readfile } = require('fs')

// 等同于
const _fs = require('fs')
let stat = _fs.stat
let readfile = _fs.readfile
```

上面代码的实质是加载了整个**fs**模块，生成了一个对象，然后再从**\_fs**这个对象上读取 3 个方法。这种加载被称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。

ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，再通过 import 命令输入。

```js
import { readFile, stat } from 'fs'
```

上面代码的实质是从 fs 模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。

## ESModule

### export 命令

模块的功能主要由两个命令构成： **export** 和 **import**。**export**命令用于规定模块的对外接口，**import**命令用于输入其他模块提供的功能

一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量，就必须使用 export 关键字输出该变量。下面是一个 JS 文件，里面使用 export 命令输出变量。

```js
export const foo = 'bar'
export const bar = 'foo'
export const year = 2022

// or

const foo = 'bar'
const bar = 'foo'
const year = 2022

export { foo, bar, year }

// 对外输出的三个变量
```

输出**function**或者**class**

```js
// export.js
export function foo() {}

export class Bar {}

// 通常情况下，export输出的变量就是本来的名字，但是可以使用as关键字重命名。

export {
  foo as Foo,
  Bar as bar
}

// 报错
export 1

// 报错
var m = 1
export m

// 写法一
export var m = 1

// 写法二
var m = 1
export { m }

// 写法三
var n = 1
export { n as m }
```

它们的实质是，在接口名与模块内部变量之间，建立了一一对应的关系。

另外，export 语句输出的接口，与其对应的值是[动态绑定关系](https://juejin.cn/post/7071895576337448990?share_token=c10e56a6-381e-4d2c-90fd-8e1de7d0a749)，即通过该接口，可以取到模块内部实时的值。

这一点与 CommonJS 规范完全不同。CommonJS 模块输出的是值的缓存，不存在动态更新

最后，export 命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，下一节的 import 命令也是如此。这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。

### import 命令

使用 export 命令定义了模块的对外接口以后，其他 JS 文件就可以通过 import 命令加载这个模块。

如果想为输入的变量重新取一个名字，import 命令要使用 as 关键字，将输入的变量重命名。

注意，import 命令具有提升效果，会提升到整个模块的头部，首先执行。

```js
// import.js
import { foo as Foo, m } from './export.js'

Foo()

// 报错 TypeError: Assignment to constant variable
m = {}
```

上面的代码不会报错，因为 import 的执行早于 foo 的调用。这种行为的本质是，import 命令是编译阶段执行的，在代码运行之前

import 命令输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里面，改写接口。

## export default

export default 是默认导出，在加载默认导出的模块是，import 命令可以为该匿名函数指定任意名字

```js
// exportdefault.js
// index.js
import custom from './export'

export default function () {}
```

上面代码的 import 命令，可以用任意名称指向 export-default.js 输出的方法，这时就不需要知道原模块输出的函数名。需要注意的是，这时 import 命令后面，不使用大括号。

export default 命令用在非匿名函数前，也是可以的。

```js
// export-default.js
export default function foo() {
  console.log('foo')
}

// 或者写成

function foo() {
  console.log('foo')
}

export default foo
```

上面代码中，foo 函数的函数名 foo，在模块外部是无效的。加载的时候，视同匿名函数加载。

下面比较一下默认输出和正常输出。

```js
// 第一组
// 输出
import crc32 from 'crc32'

import { crc32 } from 'crc32'

export default function crc32() {} // 输入

// 第二组
// 输出
export function crc32() {} // 输入
```

上面代码的两组写法，第一组是使用 export default 时，对应的 import 语句不需要使用大括号；第二组是不使用 export default 时，对应的 import 语句需要使用大括号。

export default 命令用于指定模块的默认输出。显然，一个模块只能有一个默认输出，因此 export default 命令只能使用一次。所以，import 命令后面才不用加大括号，因为只可能唯一对应 export default 命令。

本质上，export default 就是输出一个叫做 default 的变量或方法，然后系统允许你为它取任意名字。所以，下面的写法是有效的。

```js
// modules.js
// 等同于
// export default add;

// app.js
import { default as foo } from 'modules'
function add(x, y) {
  return x * y
}
export { add as default }
// 等同于
// import foo from 'modules';
```

正是因为 export default 命令其实只是输出一个叫做 default 的变量，所以它后面不能跟变量声明语句。

```js
// 正确
export var a = 1;

// 正确
var a = 1;
export default a;

// 错误
export default var a = 1;
```

## 浏览器加载

#### defer 与 async

defer 与 async 的区别是：defer 要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；async 一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。一句话，defer 是“渲染完再执行”，async 是“下载完就执行”。另外，如果有多个 defer 脚本，会按照它们在页面出现的顺序加载，而多个 async 脚本是不能保证加载顺序的。

### 加载规则

浏览器对于 ESModule 的加载是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，等同于打开了 `<script>` 标签的 defer 属性。

如果网页有多个`<script type="module">`，它们会按照在页面出现的顺序依次执行。

`<script>` 标签的 async 属性也可以打开，这时只要加载完成，渲染引擎就会中断渲染立即执行。执行完成后，再恢复渲染。

```js
<script type="module" src="./foo.js" async></script>
```

一旦使用了 async 属性，`<script type="module">`就不会按照在页面出现的顺序执行，而是只要该模块加载完成，就执行该模块。

对于外部的模块脚本，有几点需要注意。

- 代码是在模块作用域之中运行，而不是在全局作用域运行。模块内部的顶层变量，外部不可见。
- 模块脚本自动采用严格模式，不管有没有声明`use strict`。
- 模块之中，可以使用 import 命令加载其他模块（.js 后缀不可省略，需要提供绝对 URL 或相对 URL），也可以使用 export 命令输出对外接口。
- 模块之中，顶层的 this 关键字返回 undefined，而不是指向 window。也就是说，在模块顶层使用 this 关键字，是无意义的。
- 同一个模块如果加载多次，将只执行一次。

利用顶层的 this 等于 undefined 这个语法点，可以侦测当前代码是否在 ES6 模块之中。

```js
const isNotModuleScript = this !== undefined
```

## ESModule 与 CommonJS 的区别

它们有三个重大差异。

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- CommonJS 模块的 require()是同步加载模块，ES6 模块的 import 命令是异步加载，有一个独立的模块依赖的解析阶段(引擎解析)。

### [package.json 的 main 字段](https://es6.ruanyifeng.com/#docs/module-loader#package-json-%E7%9A%84-main-%E5%AD%97%E6%AE%B5)

package.json 文件有两个字段可以指定模块的入口文件：main 和 exports。比较简单的模块，可以只使用 main 字段，指定模块加载的入口文件。

```json
// node_modules/es-module-package/package.json

{
  "type": "module",
  "main": "./src/index.js"
}
```

上面代码指定项目的入口脚本为./src/index.js，它的格式为 ES6 模块。如果没有 type 字段，index.js 就会被解释为 CommonJS 模块。

然后，import 命令就可以加载这个模块。

```js
// ./my-app.mjs

import { something } from 'es-module-package'
// 实际加载的是 ./node_modules/es-module-package/src/index.js
```

上面代码中，运行该脚本以后，Node.js 就会到./node_modules 目录下面，寻找 es-module-package 模块，然后根据该模块 package.json 的 main 字段去执行入口文件。

这时，如果用 CommonJS 模块的 require()命令去加载 es-module-package 模块会报错，因为 CommonJS 模块不能处理 export 命令。

### [package.json 的 exports 字段](https://es6.ruanyifeng.com/#docs/module-loader#package-json-%E7%9A%84-exports-%E5%AD%97%E6%AE%B5)

exports 字段的优先级高于 main 字段。它有多种用法。

1. 子目录别名
   package.json 文件的 exports 字段可以指定脚本或子目录的别名。

```json
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./submodule": "./src/submodule.js"
  }
}
```

上面的代码指定 src/submodule.js 别名为 submodule，然后就可以从别名加载这个文件。

```js
import submodule from 'es-module-package/submodule'
// 加载 ./node_modules/es-module-package/src/submodule.js
```

如果没有指定别名，就不能用“模块+脚本名”这种形式加载脚本。

```js
// 报错
import submodule from 'es-module-package/private-module.js'

// 不报错
import submodule from './node_modules/es-module-package/private-module.js'
```

2. main 的别名
   exports 字段的别名如果是.，就代表模块的主入口，优先级高于 main 字段，并且可以直接简写成 exports 字段的值。

```json
{
  "exports": {
    ".": "./main.js"
  }
}

// 等同于
{
  "exports": "./main.js"
}
```

由于 exports 字段只有支持 ES6 的 Node.js 才认识，所以可以用来兼容旧版本的 Node.js。

```json
{
  "main": "./main-legacy.cjs",
  "exports": {
    ".": "./main-modern.cjs"
  }
}
```

上面代码中，老版本的 Node.js （不支持 ES6 模块）的入口文件是 main-legacy.cjs，新版本的 Node.js 的入口文件是 main-modern.cjs。

3. 条件加载
   利用.这个别名，可以为 ES6 模块和 CommonJS 指定不同的入口。目前，这个功能需要在 Node.js 运行的时候，打开--experimental-conditional-exports(低于 v14 版本的需要开启)标志。

```json
{
  "type": "module",
  "exports": {
    ".": {
      "require": "./main.cjs",
      "default": "./main.js"
    }
  }
}
```

上面代码中，别名.的 require 条件指定 require()命令的入口文件（即 CommonJS 的入口），default 条件指定其他情况的入口（即 ES6 的入口）

上面的写法可以简写如下。

```json
{
  "exports": {
    "require": "./main.cjs",
    "default": "./main.js"
  }
}
```

### [CommonJS 模块加载 ES6 模块](https://es6.ruanyifeng.com/#docs/module-loader#CommonJS-%E6%A8%A1%E5%9D%97%E5%8A%A0%E8%BD%BD-ES6-%E6%A8%A1%E5%9D%97)

CommonJS 的 require()命令不能加载 ES6 模块，会报错，只能使用 import()这个方法加载。

```js
(async () => {
  await import('./my-app.mjs')
})()
```

上面代码可以在 CommonJS 模块中运行。require()不支持 ES6 模块的一个原因是，它是同步加载，而 ES6 模块内部可以使用顶层 await 命令，导致无法被同步加载。

### [ES6 模块加载 CommonJS 模块](https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E5%8A%A0%E8%BD%BD-CommonJS-%E6%A8%A1%E5%9D%97)

ES6 模块的 import 命令可以加载 CommonJS 模块，但是只能整体加载，不能只加载单一的输出项。

```js
// 正确
import packageMain from 'commonjs-package'

// 报错
import { method } from 'commonjs-package'
```

这是因为 ES6 模块需要支持静态代码分析，而 CommonJS 模块的输出接口是 module.exports，是一个对象，无法被静态分析，所以只能整体加载。

```js
// 加载单一的输出项，可以写成下面这样。

import packageMain from 'commonjs-package'
const { method } = packageMain
```

还有一种变通的加载方法，就是使用 Node.js 内置的 module.createRequire()方法。

```js
// cjs.cjs
// esm.mjs
import { createRequire } from 'module'

module.exports = 'cjs'

const require = createRequire(import.meta.url)

const cjs = require('./cjs.cjs')
cjs === 'cjs' // true
```

上面代码中，ES6 模块通过 module.createRequire()方法可以加载 CommonJS 模块。但是，这种写法等于将 ES6 和 CommonJS 混在一起了，所以不建议使用。

## [同时支持两种格式的模块](https://es6.ruanyifeng.com/#docs/module-loader#%E5%90%8C%E6%97%B6%E6%94%AF%E6%8C%81%E4%B8%A4%E7%A7%8D%E6%A0%BC%E5%BC%8F%E7%9A%84%E6%A8%A1%E5%9D%97)

一个模块同时要支持 CommonJS 和 ES6 两种格式，也很容易。

如果原始模块是 ES6 格式，那么需要给出一个整体输出接口，比如 export default obj，使得 CommonJS 可以用 import()进行加载。

如果原始模块是 CommonJS 格式，那么可以加一个包装层。

```js
import cjsModule from '../index.js'
export const foo = cjsModule.foo
```

上面代码先整体输入 CommonJS 模块，然后再根据需要输出具名接口。

你可以把这个文件的后缀名改为.mjs，或者将它放在一个子目录，再在这个子目录里面放一个单独的 package.json 文件，指明{ type: "module" }。

另一种做法是在 package.json 文件的 exports 字段，指明两种格式模块各自的加载入口。

```json
"exports"：{
  "require": "./index.js",
  "import": "./esm/wrapper.js"
}
```

上面代码指定 require()和 import，加载该模块会自动切换到不一样的入口文件。

### [加载路径](https://es6.ruanyifeng.com/#docs/module-loader#%E5%8A%A0%E8%BD%BD%E8%B7%AF%E5%BE%84)

ES6 模块的加载路径必须给出脚本的完整路径，不能省略脚本的后缀名。import 命令和 package.json 文件的 main 字段如果省略脚本的后缀名，会报错。

```js
// ES6 模块中将报错
import { something } from './index'
```

为了与浏览器的 import 加载规则相同，Node.js 的.mjs 文件支持 URL 路径。

```js
import './foo.mjs?query=1' // 加载 ./foo 传入参数 ?query=1
```

上面代码中，脚本路径带有参数?query=1，Node 会按 URL 规则解读。同一个脚本只要参数不同，就会被加载多次，并且保存成不同的缓存。由于这个原因，只要文件名中含有:、%、#、?等特殊字符，最好对这些字符进行转义。

目前，Node.js 的 import 命令只支持加载本地模块（file:协议）和 data:协议，不支持加载远程模块。另外，脚本路径只支持相对路径，不支持绝对路径（即以/或//开头的路径）。

### [内部变量](https://es6.ruanyifeng.com/#docs/module-loader#%E5%86%85%E9%83%A8%E5%8F%98%E9%87%8F)

S6 模块应该是通用的，同一个模块不用修改，就可以用在浏览器环境和服务器环境。为了达到这个目标，Node.js 规定 ES6 模块之中不能使用 CommonJS 模块的特有的一些内部变量。

首先，就是 this 关键字。ES6 模块之中，顶层的 this 指向 undefined；CommonJS 模块的顶层 this 指向当前模块，这是两者的一个重大差异。

其次，以下这些顶层变量在 ES6 模块之中都是不存在的。

> - arguments
> - require
> - module
> - exports
> - \_\_filename
> - \_\_dirname

## TODO- export default != export { xx as default }

```js
// wait
```

## 参考文章

- [阮一峰-ES6 入门教程](https://es6.ruanyifeng.com/)
- [Live Bindings - Difference Between Export Default and Export as Default](https://javascript.plainenglish.io/live-bindings-difference-between-export-default-and-export-as-default-4541c354cdaa)
