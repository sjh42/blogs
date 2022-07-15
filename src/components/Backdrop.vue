<script setup lang="ts">
const el = $ref<HTMLCanvasElement>();
const ctx = $computed(() => el!.getContext("2d")!);
const color = 'rgba(136,136,136, 0.15)'

const r180 = Math.PI
const r90 = Math.PI / 2

interface Point {
	x: number;
	y: number;
}

interface Branch {
	start: Point;
	length: number;
	theta: number;
}

// 初始化
function init(width = 1920, height= 947) {
	ctx.strokeStyle = color

	step({
		start: { x: 0, y: 0 },
		length: 2,
		theta: r180,
	})

	step({
		start: { x: 0, y: height },
		length: 2,
		theta: -r90,
	})

	step({
		start: { x: width, y: 0 },
		length: 2,
		theta: r90,
	})

	step({
		start: { x: width, y: height },
		length: 2,
		theta: -r180,
	})
}

// 执行栈
const pendingTashs: Function[] = [];

// 递归渲染分支
function step(b: Branch, depth = 0) {
	const end = getEndPoint(b);
	drawBranch(b);

	if (depth < 3 || Math.random() < 0.5) {
		pendingTashs.push(() =>
			step({
				start: end,
				length: b.length  + (Math.random() * 10 - 5),
				theta: b.theta - 0.3 * Math.random(),
			},  depth + 1)
		)
	}

	if (depth < 3 || Math.random() < 0.5) {
		pendingTashs.push(() =>
			step({
				start: end,
				length: b.length + (Math.random() * 10 - 5),
				theta: b.theta + 0.3 * Math.random(),
			},  depth + 1)
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
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.stroke();
}

function getEndPoint(b: Branch) {
	return {
		x: b.start.x + b.length * Math.cos(b.theta),
		y: b.start.y + b.length * Math.sin(b.theta),
	}
}

function drawBranch(l: Branch) {
	lineTo(l.start, getEndPoint(l));
}

onMounted(() => {
	init()
})
</script>

<template>
	<div class="fixed top-0 bottom-0 left-0 right-0 pointer-events-none">
		<canvas ref="el" width="1920" height="947" style="z-index: -1;"/>
	</div>
	<slot name="router"/>
</template>
