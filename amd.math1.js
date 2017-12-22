//amd module demo - math1.js
define(['amd.math'],function(math1){
    var subtract = function(x,y){
        return x-y;
    };
    var add = function(x,y){
        return math1.add(x,y);
    };
    return {
        add:add,
        subtract:subtract,
    }
});