var winston = require('winston');
var _ = require('underscore');
var expressWinston = require('express-winston');
var config = require('../config/config');

var logger = null;

if (config.get('logger:console') && config.get('logger:file')) {
    console.log('Logging to console and to ' + config.get('logger:filename') + '.');
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                colorize: true,
                level: config.get('logger:level')
            }),
            new (winston.transports.File)({
                filename: config.get('logger:filename'),
                json: config.get('logger:json'),
                level: config.get('logger:level')
            })
        ],
        exitOnError: true
    });
}
else if(config.get('logger:console')) {
    console.log('Logging to console.');
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                colorize: true,
                level: config.get('logger:level')
            })
        ],
        exitOnError: true
    });
}
else if(config.get('logger:file')) {
    console.log('Logging to ' + config.get('logger:filename') + '.');
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.File)({
                filename: config.get('logger:filename'),
                json: config.get('logger:json'),
                level: config.get('logger:level')
            })
        ],
        exitOnError: true
    });
}

//use envirtonment variable DISABLE_FILE_LOGGING to disable logging to a file
if (process.env.DISABLE_FILE_LOGGING === '1') {
    try {
        console.log('Disabling file logging');
        logger.remove(winston.transports.File);
    }
    catch(err) {
        //might already be removed, ignore the error
        logger.warn(err);
    }
}

function installMiddleware(app){
    //access logs
    transports = _.values(logger.transports);
    if (transports.length > 0) {
        app.use(expressWinston.logger({
            transports: _.values(logger.transports)
        })); 
    } 
}

module.exports = logger;
module.exports.installMiddleware = installMiddleware;

