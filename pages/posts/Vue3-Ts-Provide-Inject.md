---
title: Vue3 + TS 为 provide / inject 标注类型
duration: '5min'
date: 2022-08-23
---

在使用`socket.io`、`Vue3`和`TS`做一个聊天室demo的时候，为了方便，便基于`socket.io-client`做了插件，然后用`provide `和`inject`API做全局注入，然后就遇到了类型丢失的问题，在`provide`的时候还可以看到类型，但是`inject`的时候类型就丢失了

然后查看了Vue3文档，看到了一个`InjectionKey`接口: **为了正确地为注入的值标记类型，Vue 提供了一个 InjectionKey 接口，它是一个继承自 Symbol 的泛型类型，可以用来在提供者和消费者之间同步注入值的类型**

#### 定义
```ts 
import { App } from 'vue'
import { io } from 'socket.io-client'
import { SocketInjectKey } from '../types'

interface IO {
  connection: string,
  options: any
}
export default {
  install: (app: App, {connection, options}:IO ) => {
    const socket = io(connection, options)
    app.config.globalProperties.$socket =  socket
    app.provide(SocketInjectKey, socket)
  }
}
```
```ts
// SocketInjectKey
import { InjectionKey } from 'vue'
import { Socket } from 'socket.io-client'

export const SocketInjectKey: InjectionKey<Socket> = Symbol('socket')
```
#### 使用
```ts 
import { SocketInjectKey } from '../types'

const socket = inject(SocketInjectKey)

socket?.emit('....')
```

[为 provide / inject 标注类型 —— Vue3 中文文档](https://cn.vuejs.org/guide/typescript/composition-api.html#typing-provide-inject)
