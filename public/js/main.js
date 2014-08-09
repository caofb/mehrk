requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '/js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        'app': '../app',
        'knockout':['knockout-3.1.0'],
        'knockout.validation':'knockout.validation.min',
        'jquery':['http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.10.2.min','jquery-1.10.2.min'],
        'bootstrap':['http://ajax.aspnetcdn.com/ajax/bootstrap/3.1.1/bootstrap.min','bootstrap.min'],
         'lodash':'lodash.min',
         'ajaxify':'../ajaxify',
         'templates':'../../templates/templates',
         'handlebars':'handlebars.runtime-v1.3.0'
    },
    shim: {
    'knockout.validation':['knockout'],
    'bootstrap' : ['jquery'],
    'handlebars': {
            exports: 'Handlebars'
    },
    'templates':['handlebars']
    }

});

requirejs(['ajaxify','app/AppViewModel','bootstrap'], function(ajaxify,AppViewModel) {
   ajaxify.init(new AppViewModel());
});
