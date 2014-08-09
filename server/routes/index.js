"use strict";
var controllers = require('./../controllers'),
    authRoutes = require('./authentication');

function mainRoutes(app, middleware, controllers) {
	app.get('/',  middleware.buildHeader,controllers.home);
	app.get('/api/home', controllers.home);
    
    app.get('/login', middleware.redirectToAccountIfLoggedIn, middleware.buildHeader,controllers.showLogin);
	app.get('/api/login', middleware.redirectToAccountIfLoggedIn, controllers.showLogin);

	app.get('/register',middleware.redirectToAccountIfLoggedIn,  middleware.buildHeader,controllers.showRegister);
	app.get('/api/register', middleware.redirectToAccountIfLoggedIn,  controllers.showRegister);

    app.get('/api/head',  controllers.head);
}
function staticRoutes(app, middleware, controllers) {
	app.get('/404', middleware.buildHeader,controllers.static['404']);
	app.get('/api/404', controllers.static['404']);

	app.get('/403', middleware.buildHeader,controllers.static['403']);
	app.get('/api/403', controllers.static['403']);

	app.get('/500',  middleware.buildHeader,controllers.static['500']);
	app.get('/api/500', controllers.static['500']);
}
function accountRoutes(app, middleware, controllers) {

	app.get('/account/profile/:id', middleware.buildHeader,  controllers.accounts.getAccount);
	app.get('/api/account/profile/:id',controllers.accounts.getAccount);
    app.get('/account/edit', middleware.buildHeader, middleware.checkIsLogin, controllers.accounts.accountEdit);
	app.get('/api/account/edit', middleware.checkIsLogin, controllers.accounts.accountEdit);

	app.post('/api/account/changePassowrd',middleware.checkIsLogin,controllers.accounts.changePassowrd);
    app.post('/api/account/changeProfile',middleware.checkIsLogin,controllers.accounts.changeProfile);
}
function userRoutes(app, middleware, controllers) {
	app.get('/api/chackname', controllers.users.checkUserName);
	app.get('/api/chackemail', controllers.users.checkEmail);
}
module.exports = function(app, middleware) {
	app.all('/api/*',  middleware.prepareAPI);
	
	mainRoutes(app, middleware, controllers);
	staticRoutes(app, middleware, controllers);

	authRoutes.createRoutes(app, middleware, controllers);

	accountRoutes(app, middleware, controllers);
	userRoutes(app, middleware, controllers);
};
