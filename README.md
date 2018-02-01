# Javascript-Demo

It is a demo lib for javascript module practice.

* CommonJS
* AMD usage demo
* CMD usage demo
* UMD usage demo


###CommonJS规范
CommonJS定义的模块分为3部分:

require 模块引用

exports 模块导出

module 模块本身

根据CommonJS规范，一个单独的文件就是一个模块。每一个模块都是一个单独的作用域，也就是说，在一个文件定义的变量（还包括函数和类），都是私有的，对其他文件是不可见的.

```
// a.js

var a = {
    "a":a,
    "b":b
}

module.export = a //模块导出

// b.js
var b = require('./a.js') //模块引入
```

CommonJS 加载模块是同步的，所以只有加载完成才能执行后面的操作


###AMD(Asynchromous Module Definition)规范

AMD 加载模块是异步的

define(id?, dependencies?, factory);

id: 模块标识，可以省略。
dependencies: 所依赖的模块，可以省略。
factory: 模块的实现，或者一个JavaScript对象。 

```
   //a.js 只有factory
   define(function() {
       return {
           mix: function(source, target) {
               ...
            }
        };
    });
    
    //b.js 依赖a.js
    define(['a'], function(a) {
        return {
            show: function() {
               ...
            }
        }
    });
    
    //c.js 依赖a.js b.js
    define(['a', 'b'], function(a, b) {
        ....
    });
    
    //d.js 对象模块
    define({
        data1: [],
        data2: []
    });
```   
AMD规范允许输出模块兼容CommonJS规范，这时define方法如下：

```
    define(function (require, exports, module) {
        var reqModule = require("./a.js");
        requModule.mix();
        
        exports.asplode = function () {
            ...
        }
    });
```

###CMD(Common Module Definition)规范

CMD和AMD的区别有以下几点:

对于依赖的模块AMD是提前执行，CMD是延迟执行。不过RequireJS从2.0开始，也改成可以延迟执行(根据写法不同，处理方式不通过)

CMD推崇依赖就近，AMD推崇依赖前置

```
    //AMD写法
    define(['./a','./b'], function (a, b) {
        //依赖一开始就写好
        a.mix();
        b.show();
    });
    
    //CMD写法
    define(function (requie, exports, module) {
        //依赖可以就近书写
        var a = require('./a');
        a.mix();
        
        if (...) {
            var b = requie('./b');
            b.show();
        }
    });
```

###UMD(Universal Module Definition)规范

```
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.jQuery);
    }
}(this, function ($) {
    //    methods
    function myFunc(){};

    //    exposed public method
    return myFunc;
}));
```

应用UMD规范的js文件其实就是一个立即执行函数。函数有两个参数，第一个参数是当前运行时环境，第二个参数是模块的定义体。在执行UMD规范时，会优先判断是当前环境是否支持AMD环境，然后再检验是否支持CommonJS环境，否则认为当前环境为浏览器环境（ window ）