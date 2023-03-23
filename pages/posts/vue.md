---
title: Vue.js 面试题
desc: 收集
date: 2023-03-16
tags: Vue
---

### 1. Vue3 对比 Vue2 的优势与不同

  1. Vue3 采用了 Proxy 代理对象，对比 Vue2 的 Object.defineProperty，Vue3 的 Proxy 代理对象更加高效，性能更好。对比与 Vue2 的 Object.defineProperty，Proxy 支持拦截13种操作，而 Object.defineProperty 只支持7种操作。

  2. Vue3 采用了 Composition API，对比 Vue2 的 Options API，Composition API 更加灵活，更加符合函数式编程思想。

  3. diff算法，编译器的改变 Vue3优化了diff算法。不再像vue2那样比对所有dom，而采用了block tree的做法。此外重新渲染的算法里也做了改进，利用了闭包来进行缓存。这使得vue3的速度比vue2快了6倍

  4. 生命周期重新命名，从 Vue2 的 beforeCreate、created、beforeMount、mounted、beforeUpdate、updated、beforeDestroy、destroyed，变成了 Vue3 的 beforeMount、mounted、beforeUpdate、updated、beforeUnmount、unmounted。
  beforeRender、renderTracked、renderTriggered、errorCaptured。是一些ssr和全局错误获取钩子

  5. Vue3 支持多个根节点，也就是 fragment

  6. 更好的 TypeScript、SSR 支持，tree-shaking，包体积更小

### 2. watch 与 computed 的区别

  在 Vue 中，watch 和 computed 都是用来监听响应式数据变化的。

  1. watch 侦听一个或多个响应式数据源，并在数据源变化时调用所给的回调函数。

  2. computed 接受一个 getter 函数，返回一个只读的响应式 ref 对象。如果要返回一个可写的对象，它也可以接受一个带有 get 和 set 函数的对象来创建一个可写的 ref 对象

  *区别：*

    1. watch 是侦听器，可以监听数据变化并执行相应的回调函数，而 computed 则是根据响应式数据进行计算，并返回计算结果。

    2. watch 可以监听一个数据对象的属性，也可以监听一个计算属性，而 computed 只能计算一个响应式数据的值。

    3. computed 的值会被缓存，只有当其依赖的响应式数据发生改变时，才会重新计算，而 watch 默认是懒侦听的，即仅在侦听源发生变化时才执行回调函数。。

### 3. watch 与 watchEffect 的区别

  在Vue 3中， watch 和 watchEffect 都是用于侦听数据变化的API，但它们之间有几个重要的区别：

  1. 监听方式的不同：`watch` 通过传递一个监听的变量和一个回调函数来监听变量的变化，回调函数的参数是变量的旧值和新值；而 `watchEffect` 通过传递一个函数来监听变量的变化，这个函数中可以直接访问被监听的变量，当变量发生变化时，这个函数会被重新执行。

  2. 初始值监听：`watch` 在初始渲染时不会立即执行回调函数，只有当监听值发生改变时才会执行回调函数。而 `watchEffect` 就在初始渲染的时立即执行一次函数

  ```ts
  // watchEffect
  function watchEffect(
    effect: (onCleanup: OnCleanup) => void,
    options?: WatchEffectOptions
  ): StopHandle

  type OnCleanup = (cleanupFn: () => void) => void

  interface WatchEffectOptions {
    flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void

  // watch 
  // 侦听单个来源
  function watch<T>(
    source: WatchSource<T>,
    callback: WatchCallback<T>,
    options?: WatchOptions
  ): StopHandle

  // 侦听多个来源
  function watch<T>(
    sources: WatchSource<T>[],
    callback: WatchCallback<T[]>,
    options?: WatchOptions
  ): StopHandle

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type WatchSource<T> =
    | Ref<T> // ref
    | (() => T) // getter
    | T extends object
    ? T
    : never // 响应式对象

  interface WatchOptions extends WatchEffectOptions {
    immediate?: boolean // 默认：false
    deep?: boolean // 默认：false
    flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }
  ```
### 4. Vue的响应式原理

  JS无法追踪原始数据类型变量的读写，但是可以追踪引用类型变量的属性的读写

  在JS中有两种劫持property访问的方式，`Object.defineProperty` 和 `proxy`

  1. `Vue2`:

    1. Vue2中使用的便是使用了 `Object.defineProperty` 来劫持对象中的某一个属性。并且无法监听到对象属性的新增和删除

  Vue2 响应式核心简单实现

  ```js
  function reactive(obj, key, val) {
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function(val) {
        if (Dep.target) {
          dep.depend()
        }
        return val
      },
      set: function(newVal) {
        val = newVal
        dep.Notify()
      }
    })
  }
  
  // 依赖收集
  // TODO
  ```
  其中 `getter` 中主要是通过 `Dep` 收集依赖这个属性的订阅者，`setter` 中则是在属性变化后通知 `Dep` 收集到的订阅者，派发更新

  2. `Vue3`: 

    1. Vue3采用了 `Proxy` 来创建响应式对象，`Proxy`对象可以用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

  Vue3 响应式核心简单实现
  ```js
  function reactive(obj) {
    let activeEffect
    const bucket = new WeakMap()
    return new Proxy(obj, {
      get(target, key) {
        if (!activeEffect) return

        let depsMap = bucket.get(key)
        if (!depsMap) {
          bucket.set(target, (depsMap = new Map()))
        }

        let deps = depsMap.get(key)
        if (!deps) {
          depsMap.set(key, (deps = new Set()))
        }

        deps.set(activeEffect)

        return target(key)
      },
      // 拦截设置操作
      set(target, key, newVal) {
        target[key] = newVal

        const depsMap = bucket.get(target)

        if (!depsMap) return

        // 根据key取出相对应的副作用函数
        const effect = depsMap.get(key)
        // 触发副作用函数
        effect && effect.forEach(fn => fn())
      }
    })
  }
  ```
