requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {        
        'main':'main',
        'app': 'app',
        'knockout':'lib/knockout-3.1.0',
        'knockout.validation':'lib/knockout.validation.min',
        'jquery':'lib/jquery-1.10.2.min',
        'bootstrap':'lib/bootstrap.min',
         'lodash':'lib/lodash.min',
         'ajaxify':'ajaxify',
         'templates':'../templates/templates',
         'handlebars':'lib/handlebars.runtime-v1.3.0'
    },
    shim: {
    'knockout.validation':['knockout'],
    'bootstrap' : ['jquery'],
    'handlebars': {
            exports: 'Handlebars'
    },
    'templates':['handlebars'],
    }

});
