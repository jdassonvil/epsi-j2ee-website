"use strict";

var express = require('express');

var logger  = require('./tools/logger');
var config  = require('./config/config');

var app = express();
var gracefullyClosing = false;
var server = null;

function start(path) {
        server = app.listen(config.get('app:serverPort'));
        logger.info("Express server listening on port " + config.get("app:serverPort") + " in " + app.settings.env);

	logger.installMiddleware(app);
	
	if(path){
		app.use(express.static(path));
		logger.info("Express server serves static content from " + path);
	}

	app.use(function(req, res, next){
        	res.setHeader('Content-Type', 'text/plain');
        	res.status(404).send('404 - Page introuvable !');
		next();
	});
}
	
function stop(done){
        logger.info("Stopping server");
        gracefullyClosing = true;
        return server.close(done);
}

exports.app = app;
exports.start = start;
exports.stop = stop;
