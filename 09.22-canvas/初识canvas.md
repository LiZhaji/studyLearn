# 初识canvas

## 优势
同一个视觉效果，比如小球的移动，可以用DOM元素也可以用canvas实现，但是会更倾向于canvas动画，相比于DOM元素，其优势是：

- 操作DOM元素的某些属性会引起回流重绘，影响性能；
- canvas有WebGL提供的API统一使用去实现图形绘制
## 操作
canvas标签具有width和height属性，值为数字，区别于css的宽高

- 获取canvas元素
- 获取元素上下文2d,3d,wegGl...
- 对元素上下文进行操作
- 绘制

矩形-原生图形绘制
别的图形-路径绘制
## 注意点

- canvas绘制出来后类似于image，其宽高是由标签属性width height决定的

      使用css对其宽高进行修改 ，会把整个canvas连同内部绘制出来的一起压缩/拉伸
## 动画
结合requestAnimationFrame(callback)实现动画效果
异步操作，会在下一帧渲染之前执行回调函数，所以需要多次循环调用
