//Module dependencies.
 
var nconf = require('nconf');

nconf.env('__');

nconf.defaults({
  'NODE_ENV': 'local'
});

console.log("[config] Starting in environnement "+nconf.get('NODE_ENV'));

nconf
  .file('env-specific',__dirname+'/env/config-'+nconf.get('NODE_ENV')+'.json' )
  .file('global','config/global.json' );

module.exports = nconf;
