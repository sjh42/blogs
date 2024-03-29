<script setup lang="ts">
const el = $ref<HTMLCanvasElement>()
const ctx = $computed(() => el!.getContext('2d')!)
const color = 'rgba(136,136,136, 0.15)'
const size = reactive(useWindowSize())

const r180 = Math.PI
const r120 = Math.PI * (3 / 4)
const r90 = Math.PI / 2
const l10 = 6

interface Point {
  x: number
  y: number
}

interface Branch {
  start: Point
  length: number
  theta: number
}

// 初始化
function init(width = size.width, height = size.height) {
  ctx.strokeStyle = color

  step({
    start: { x: 0, y: 0 },
    length: l10,
    theta: r120,
  })

  step({
    start: { x: 0, y: height },
    length: l10,
    theta: -r90,
  })

  step({
    start: { x: width, y: 0 },
    length: l10,
    theta: r90,
  })

  step({
    start: { x: width, y: height },
    length: l10,
    theta: -r180,
  })
}

// 执行栈
const pendingTashs: Function[] = []

// 递归渲染分支
function step(b: Branch, depth = 0) {
  const end = getEndPoint(b)
  drawBranch(b)

  if (depth < 3 || Math.random() < 0.5) {
    pendingTashs.push(() =>
      step(
        {
          start: end,
          length: b.length * 0.2 + Math.random() * 5,
          theta: b.theta - 0.3 * Math.random(),
        },
        depth + 1,
      ),
    )
  }

  if (depth < 3 || Math.random() < 0.5) {
    pendingTashs.push(() =>
      step(
        {
          start: end,
          length: b.length * 0.2 + Math.random() * 5,
          theta: b.theta + 0.3 * Math.random(),
        },
        depth + 1,
      ),
    )
  }
}

function frame() {
  const tasks = [...pendingTashs]
  pendingTashs.length = 0
  tasks.forEach(fn => fn())
}

let frameCount = 0
function startFrame() {
  requestAnimationFrame(() => {
    frameCount += 1
    if (frameCount % 3 === 0)
      frame()
    startFrame()
  })
}

startFrame()

function lineTo(p1: Point, p2: Point) {
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
}

function getEndPoint(b: Branch) {
  return {
    x: b.start.x + b.length * Math.cos(b.theta),
    y: b.start.y + b.length * Math.sin(b.theta),
  }
}

function drawBranch(l: Branch) {
  lineTo(l.start, getEndPoint(l))
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="fixed top-0 bottom-0 left-0 right-0 pointer-events-none">
    <canvas ref="el" :width="size.width" :height="size.height" style="z-index: -1" />
  </div>
  <slot name="router" />
</template>
