define(function(require) {
    var $ = require('jquery');
    var Test = require('./cmd.test');
    var a = new Test('#test');
    // a.show();
    $('#container').click(function(){
        a.show();
    });
});
