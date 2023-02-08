---
title: 分片上传大文件
date: 2022-10-01
duration: 30min
desc: 记录
tags: Vue
---

项目环境
 > 前端: Vue3 + Vite + TypeScript
 >
 > 后端: Go + Gin

input元素返回一个File对象，File对象是一个基于Blob对象，继承了blob的功能并将其拓展以支持用户系统上的文件。`slice()` 方法是分片的主要API，它用于创建一个包含源 Blob的指定字节范围内的数据的新 Blob 对象

```javascript
var blob = instanceOfBlob.slice([start [, end [, contentType]]]};
```

## Upload Component

```html
<template>
	<input ref="uploader" type="file" @change="handleChange" />
</template>
```

```typescript
interface FileChunk {
  file: Blob
}

interface WapperChunk {
	chunk: Blob
	chunkHash: string
	hash: string | undefined
}
// 每个blob子集的size大小
const SIZE = 50 * 1024 * 1024
const worker = ref<Worker>()
const uploader = ref<HTMLInputElement>()

// 获取input元素返回的File对象
function handleChange(event: Event) {
	const { files } = event.target as HTMLInputElement

	if (!files) return

	// 上传切片
	handleUpload(file)
}

async function handleUpload(files: File) {
	if (!files) alert('Please upload a file!')

  // 切割File对象
	const fileChunkLists = sliceFileChunks(files)

  // 计算每个切片的hash值，使用了Web Worker
	const hash = await calculateHash(fileChunkLists)

  const wapperChunk = fileChunkLists.map(({file}, index) => {
    hash: hash,
    chunk: file,
    // chunkHash作为每一个切片的文件名
    chunkHash: String(index)
  })

  await uploadChunks(wapperChunk, hash, files.name)
}

function sliceFileChunks(files: File, size = SIZE) {
  const fileChunks: FileChunk[] = []
  let cur = 0
  while (cur < size) {
    fileChunks.push({ file: file.slice(cur, cur + size)})
    cur += size
  }
  return fileChunks
}

async function uploadChunks(chunks: WapperChunk[], hash: string | undefined, name: string)

const requestList = chunks.map(({chunk, chunkHash, hash}) => {
  const formData = new FormData()
  formData.append('chunk', chunk)
	formData.append('chunkHash', chunkHash)
	formData.append('hash', hash as string)
  
  return { formData }
})
.map(({formData}) => {
  return fettch("http://localhost:8080/upload", {
    method: 'POST',
    mode: 'cors',
    body: formData
  })
})

// 保证所有切片同时上传成功或者失败
await Promise.all(requestList)
await mergeChunk(hash as string, name)

// 上传文件的hash作为切片的文件目录
async function mergeChunk(hash: string, name: string) {
	await fetch(`http://localhost:8080/merge?hash=${hash}&name=${name}`)
}

function calculateHash(fileChunk: FileChunk[]) {
	if (typeof Worker !== 'undefined') {
		return new Promise<string>(resolve => {
      // 具体请看Vite中使用Worker线程(https://cn.vitejs.dev/guide/features.html#web-workers)
			worker.value = new Worker(new URL('../worker/index.ts', import.meta.url), {
				type: 'module'
			})
			worker.value.postMessage(fileChunk)
			worker.value.onmessage = (e) => {
				const { percentage, hash } = e.data
				if (hash) {
					resolve(hash)
				}
			}
		})
	}
}
```

## Web Worker
```typescript
import SparkMD5 from "spark-md5";

onmessage = (e) => {
  const [ ...fileChunk ] = e.data

  const spark = new SparkMD5.ArrayBuffer()
  let percentage = 0
  let count = 0
  
  const loadNext = (index: number) => {
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(fileChunk[index].file)
    fileReader.onload = (e) => {
      count++
      spark.append(e.target?.result as ArrayBuffer)
      if (count === fileChunk.length) {
        postMessage({
          percentage: 100,
          hash: spark.end()
        })
        close()
      } else {
        percentage += 100 / fileChunk.length
        postMessage({
          percentage
        })
        loadNext(count)
      }
    }
  }
  loadNext(0)
}
```

后端接口的实现

## Go
```go
package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "PATCH", "DELETE", "POST", "GET", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.Run(":8080")
}
```

### 1. upload

```go
r.POST("/upload", func(ctx *gin.Context) {
  chunk, err := ctx.FormFile("chunk")
  if err != nil {
    panic("Failed to upload")
  }
  chunkHash := ctx.PostForm("chunkHash")
  hash := ctx.PostForm("hash")

  // 创建路径
  isExistPath, err := PathExist(hash)
  if err != nil {
    handleError(err, "路径错误!")
  }

  if isExistPath {
    os.Mkdir(hash, os.ModePerm)
  }

  // TODO: 这里可能有问题
  err = ctx.SaveUploadedFile(chunk, fmt.Sprintf("./%s/%s", hash, chunkHash))
  if err != nil {
    handleError(err, "保存文件失败!")
    ctx.JSON(http.StatusBadRequest, "error")
  } else {
    chunkList := []string{}
    files, err := os.ReadDir(hash)

    if err != nil {
      handleError(err, "文件读取失败!")
    }

    for _, f := range files {
      fileName := f.Name()

      if f.Name() == ".DS_Store" {
        continue
      }
      chunkList = append(chunkList, fileName)
    }

    ctx.JSON(http.StatusOK, gin.H{
      "chunkList": chunkList,
    })
  }
})
```

### 2. merge

```go
r.GET("/merge", func(ctx *gin.Context) {
  fileHash := ctx.Query("hash")
  fileName := ctx.Query("name")
  fmt.Println("⚡️需要合并文件的文件夹:", fileHash)
  ctx.JSON(http.StatusOK, "success")
  go MergFileChunk(fileHash, fileName)
})

// 这里有个文件过多，有合并顺序的问题。暂未解决
// TODO: fix merge bug
func MergeFileChunk(path string, name string) {
	files, err := os.ReadDir(path)
	if err != nil {
		fmt.Println("read path filed！", err)
	}

	complateFile, err := os.Create(name)
	if err != nil {
		fmt.Println("open path filed", err)
	}
	defer complateFile.Close()

	for i := 0; i < len(files); i++ {
		fmt.Println("ready merge file name:", files[i].Name())
		fileBuffer, err := os.ReadFile(fmt.Sprintf("./%s/%s", path, files[i].Name()))
		if err != nil {
			fmt.Println("file read filed", err)
		}
		complateFile.Write(fileBuffer)
	}
```
工具函数

```go
// 路径检测函数
func PathExist(path string) (bool, error) {
	_, err := os.Stat(path)
	if err != nil {
		return true, nil
	}

	if os.IsNotExist(err) {
		return false, nil
	}

	return false, err
}

func handleError(err error, msg string) {
	if err != nil {
		fmt.Println(msg, err)
	}
}

func Logger(content interface{}) {
	fmt.Println(content)
}
```
