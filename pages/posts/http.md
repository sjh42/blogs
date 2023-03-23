---
title: HTTP 面试题
date: 2023-03-18
tags: HTTP
desc: 收集
---

### 1. 协商缓存如何判断命不命中？

  1. 协商缓存是指在客户端发送请求时，服务器会检查请求头中的信息，来判断该资源是否发生了变化。如果资源没有发生变化，则服务器会返回一个304 Not Modified的响应状态码，并且不会返回资源的实体内容，这样客户端就可以使用本地缓存中的内容。

  2. 在协商缓存中，服务器通过判断请求头中的If-Modified-Since和If-None-Match字段来判断资源是否发生了变化。

    1. If-Modified-Since：表示客户端上一次请求该资源时的Last-Modified响应头的值。如果该值等于当前请求资源时服务器的Last-Modified响应头的值，那么表示资源没有发生变化，可以直接使用本地缓存。
  
    2. If-None-Match：表示上一次请求时服务器返回的ETag响应头的值。如果该值等于当前请求资源时服务器返回的ETag响应头的值，那么表示资源没有发生变化，可以直接使用本地缓存。
  
  因此，如果服务器返回了304 Not Modified的响应状态码，就说明命中了协商缓存。

### 2. HTTP 103 是什么意思?

  HTTP 103是一个持续性状态代码（Status Code），是在HTTP/1.1中引入的一种新的状态代码。它表示服务器已经接收到了客户端发送的请求，并且将要发送一个响应，但是在响应完成之前，服务器可能会继续发送其他的响应信息，例如正在生成的页面内容。因此，HTTP 103状态码也被称为“Early Hints”（早期提示），它可以用于优化HTTP请求的响应时间，提高客户端的性能。