/**
 * Created by Administrator on 2017/12/22 0022.
 * module demo
 * we should use IIFE(Immediately-Invoked Function Expression) to protect internal variable.
 * +-----------------------------------------
 * 1.Use objects to pass parameters,ex:{a:1,b:2,c:3}.
 * 2.Use strict mode.
 * 3.return public function.
 * +-------------------------------------------
 */

'use strict';
var Module = (function(){
    //defined const variable
    var _count1;
    //protected or private
    var func1 = function(){
        console.log('m func1');
    };
    //public
    var func2 = function(){
        console.log('m func2');
    };

    //return public function
    return {
        func2:func2
    }
})();

//call demo
// Module.func2();

/**
 * Loose augmentation mode 
 * We can use the loose magnification mode to achieve module inheritance(similar to extends in php).
 *
 */

var Module1 =(function(module){
    //attach func3 to module
    module.func3 = function(){
        console.log('m func3');
    };
    return module;
})(window.Module || {});

//call demo
// Module1.func2();
// Module1.func3();

/**
 * Don't interact with outside obj directly.
 * You can pass the global variables to this module.
 */
var Module2 = (function ($,YAHOO) {
    //...
})(jQuery,YAHOO);
