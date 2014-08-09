"use strict";

var app,
	middleware = {};	


middleware.isAdmin = function(req, res, next) {
	next();
};


module.exports = function(webserver) {
	app = webserver;
	return middleware;
};
