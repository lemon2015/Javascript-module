/**
 * Created by mark on 18-1-4.
 */
define(function(require,exports,module) {
    var $ = require('jquery');
    $.fn.extend({
        check: function() {
            return this.each(function() { this.checked = true; });
        },
        uncheck: function() {
            return this.each(function() { this.checked = false; });
        }
    });
    //扩展$ 方法
    $.extend({
        min: function(a, b) {
            return a < b ? a : b;
        },
        max: function(a, b) {
            return a > b ? a : b;
        }
    });
    function Test2(container){
        this.container = $(container);
        this.show = function(){
            this.container.find('input').check();
            console.log($.min(1,2));
        }
    }
    module.exports = Test2;
});


var test = function(){
    this.a = 1;
};
test.prototype = function(){
    var add = function(a,b){return a+b;};
    return {add:add}
}();
var a = new test();
a.add(2,3);