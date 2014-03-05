(function (root) {
    "use strict";

    // 最优的 setImmediate
    if (typeof root.setImmediate === 'function') {
        return;
    }

    // Node.js 较老版本选择 nextTick
    if (typeof process === 'object' && {}.toString.call(process) === '[object process]') {
        root.setImmediate = process.nextTick;
        return;
    }

    // 现代高级浏览器，优先选用 MutationObserver
    var MutationObserver = root.MutationObserver || root.WebKitMutationObserver || root.MozMutationOvserver;
    if (MutationObserver) {
        root.setImmediate = (function () {
            var iterator = 0,
                queue = [], fn,
                node = document.createTextNode(''),
                observer = new MutationObserver(function () {
                    while (fn = queue.shift()) {
                        fn();
                    }
                });

            observer.observe(node, {"characterData": true});

            return function (fn) {
                queue.push(fn);
                node.data = ++iterator % 2;
            };
        })();
        return;
    }

    // 较老的浏览器，postMessage 性能出众
    if ('postMessage' in root && 'addEventListener' in root) {
        root.setImmediate = (function () {
            var queue = [], fn, iwin,
                iframe = document.createElement('iframe');

            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            iwin = iframe.contentWindow;
            iwin.document.write('<script>window.onmessage=function(){parent.postMessage(1, "*");};</script>')
            iwin.document.close();

            window.addEventListener('message', function () {
                while (fn = queue.shift()) {
                    fn();
                }
            });

            return function (fn) {
                queue.push(fn);
                iwin.postMessage(1, "*");
            };
        })();
        return;
    }

    // 再老点的 IE 浏览器，通过监控 script 的 readystatechange 方式，性能比 setTimeout 高出很多
    if (root.VBArray) {
        root.setImmediate = function (fn) {
            var script = document.createElement('script');

            script.onreadystatechange = function () {
                script.onreadystatechange = null;
                script.parentNode.removeChild(script);
                script = null;
                fn();
            };

            document.body.appendChild(script);
        };
        return;
    }

    // 其他情况
    root.setImmediate = function (fn) {
        setTimeout(fn, 0);
    };

})(this || global);