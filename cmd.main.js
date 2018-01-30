define(function(require) {
    var $ = require('jquery');
    var store = require('store');
    debugger;
    var Test = require('./cmd.test');
    var a = new Test('#test');
    // a.show();
    $('#container').click(function(){
        a.show();
    });

    var Test1 = require('./jquery.extend');

    var b = new Test1('#checkbox');
    $('#checkbox').click(function(){
        b.show();
    });
});
