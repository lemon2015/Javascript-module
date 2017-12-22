//amd.main.js
//console.log('i am amd.main');
require.config({
    baseUrl:"./",
    paths:{
        'jquery':'jquery-3.2.1.min',
        // 'remote':'https://www.remote.com/lib/js/remote.min',
    },
    //--------use shim to load libs which do not comply with AMD specifications
    // shim:{
    //     'test':{
    //         exports:'test'
    //     },
    //     'test1':{
    //         deps:['test'],
    //         exports:'test1'
    //     }
    // }
});

require(['amd.math1'],function(math){
    //...
    console.log(math.add(1,2));
});

// require(['domready!'], function (doc){
    // called once the DOM is ready
//     console.log('document ready ...');
// });