var config = require('./api/config/config');
var logger = require('./api/tools/logger');

var server = require('./api/server');

process.on('SIGTERM', function() {
    console.log("Received kill signal (SIGTERM), shutting down gracefully.");
    server.stop(function() {
        logger.info("Closed out remaining connections.");
        return process.exit();
    });

    return setTimeout(function() {
        logger.error("Could not close connections in time, forcefully shutting down");
        return process.exit(1);
    }, config.get('app:shutdownTimeout'));
});

server.start(__dirname + '/web/dist');
