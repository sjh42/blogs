---
title: 浏览器相关杂记
desc: 杂记
date: 2020-10-22
tags: browser
---

## Chrome

- Chrome 中文界面下默认会将小于 12px 的文本强制按照 12px 显示,可通过加入 CSS 属性 -webkit-text-size-adjust: none; 解决。


## 其他

- 不同浏览器的标签默认的margin和padding不一样。*{margin:0;padding:0;}
- 超链接访问过后hover样式就不出现了，被点击访问过的超链接样式不再具有hover和active了。解决方法是改变CSS属性的排列顺序:L-V-H-A ( love hate ): a:link {} a:visited {} a:hover {} a:active {}

## position 属性的值有哪些及其区别

- 固定定位 fixed： 元素的位置相对于浏览器窗口是固定位置，即使窗口是滚动的它也不会移动。Fixed 定 位使元素的位置与文档流无关，因此不占据空间。 Fixed 定位的元素和其他元素重叠。
- 相对定位 relative： 如果对一个元素进行相对定位，它将出现在它所在的位置上。然后，可以通过设置垂直 或水平位置，让这个元素“相对于”它的起点进行移动。 在使用相对定位时，无论是 否进行移动，元素仍然占据原来的空间。因此，移动元素会导致它覆盖其它框。
- 绝对定位 absolute： 绝对定位的元素的位置相对于最近的已定位父元素，如果元素没有已定位的父元素，那么它的位置相对于根元素。absolute 定位使元素的位置与文档流无关，因此不占据空间。 absolute 定位的元素和其他元素重叠。
- 粘性定位 sticky： 元素先按照普通文档流定位，然后相对于该元素在流中的 flow root（BFC）和 containing block（最近的块级祖先元素）定位。而后，元素定位表现为在跨越特定阈值前为相对定 位，之后为固定定位。
- 默认定位 Static： 默认值。没有定位，元素出现在正常的文档流中（忽略 top, bottom, left, right 或者 z-index 声 明）。 inherit: 规定应该从父元素继承 position 属性的值。

## box-sizing属性

- box-sizing 规定两个并排的带边框的框，语法为 box-sizing：content-box/border-box/inherit
- content-box：宽度和高度分别应用到元素的内容框，在宽度和高度之外绘制元素的内边距和边框。【标准盒子模型】
- border-box：为元素设定的宽度和高度决定了元素的边框盒。【IE 盒子模型】
- inherit：继承父元素的 box-sizing 值。

## CSS 盒子模型

CSS 盒模型本质上是一个盒子，它包括：边距，边框，填充和实际内容。CSS 中的盒子模型包括 IE 盒子模型和标准的 W3C 盒子模型。
在标准的盒子模型中，width 指 content 部分的宽度。
在 IE 盒子模型中，width 表示 content+padding+border 这三个部分的宽度。

故在计算盒子的宽度时存在差异：

- 标准盒模型： 一个块的总宽度 = width+margin(左右)+padding(左右)+border(左右)
- 怪异盒模型： 一个块的总宽度 = width+margin（左右）（既 width 已经包含了 padding 和 border 值）

### BFC（块级格式上下文）

#### BFC的概念

BFC 是 Block Formatting Context 的缩写，即块级格式化上下文。BFC是CSS布局的一个概念，是一个独立的渲染区域，规定了内部box如何布局， 并且这个区域的子元素不会影响到外面的元素，其中比较重要的布局规则有内部 box 垂直放置，计算 BFC 的高度的时候，浮动元素也参与计算。

#### BFC的原理布局规则

- 内部的Box会在垂直方向，一个接一个地放置
- Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
- 每个元素的margin box的左边，与包含块border box的左边相接触(对于从左往右的格式化，否则相反
- BFC的区域不会与float box重叠
- BFC是一个独立容器，容器里面的子元素不会影响到外面的元素
- 计算BFC的高度时，浮动元素也参与计算高度
- 元素的类型和display属性，决定了这个Box的类型。不同类型的Box会参与不同的Formatting Context。

#### 如何创建BFC？

- 根元素，即HTML元素
- float的值不为none
- position为absolute或fixed
- display的值为inline-block、table-cell、table-caption
- overflow的值不为visible

#### BFC的使用场景

- 去除边距重叠现象
- 清除浮动（让父元素的高度包含子浮动元素）
- 避免某元素被浮动元素覆盖
- 避免多列布局由于宽度计算四舍五入而自动换行
