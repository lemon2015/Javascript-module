define(function(require,exports,module){
	var Vue = require('vue');
	var app2 = new Vue({
		el:'#app-2',
		data:{
			message:'page loading '+new Date().toLocaleString()
		}
	});
});