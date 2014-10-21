require('newrelic');


/*
*
*	GLOBAL path helpers
*
*/

GLOBAL.paths = require('./config/paths');



/*
*
* Express
*
*/

const express = require('express');
const app = express();


/*
*
* Configuration
*
*/

require(GLOBAL.paths.getConfig('express'))(app, express);
console.log('App Environment', app.get('env'));



/*
*
* Routes
*
*/

require(GLOBAL.paths.getRoute())(app, express);



/*
*
* Server
*
*/

console.log(Date.now(), 'Running Node.js ' + process.version + ' with flags "' + process.execArgv.join(' ') + '"');
app.listen(app.get('port'), function() {
	console.log(Date.now(), 'Express server listening on port ' + app.get('port') + ' in mode: ' + process.env.NODE_ENV);
	// console.log(Date.now(), 'ENVIRONMENT:', process.env);
});
