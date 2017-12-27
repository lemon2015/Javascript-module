define(function(require,exports,module) {
    var $ = require('jquery');
    function Test(container){
        this.container = $(container);
        this.show = function(){
            this.container.toggle();
        }
    }
    module.exports = Test;
});
