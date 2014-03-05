## 介绍

可以把 setImmediate() 函数看做 setTimeout, 但其比 setTimeout 更高效。

- 在支持 setImmediate() 的环境(Node.js 较新版本, IE10+)下，直接使用原生 setImmediate
- 在较老版本的 Node.js 环境下，优先使用 process.nextTick()
- 现代高级浏览器下，优先使用 MutationObserver 构造函数
- 浏览器不支持 MutationObserver 的情况下，优先使用 postMessage
- 较老的 IE 浏览器下，优先使用 script 的 onreadystatechange 属性
- 以上都不能满足的情况下，使用 setTimeout

## 使用方法

引入 setImmediate.js 文件:

```html
<script src="setImmediate.js"></script>
```

在需要异步调用的场景下，直接使用:

```js
setImmediate(function () {
    console.log('async output!');
});
console.log('sync output!');
```
