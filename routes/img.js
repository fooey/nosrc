"use strict";

var img = require(GLOBAL.paths.getService('img'));
var zlib = require('zlib');


function isInt(n) {
	return (typeof n === 'number' && n % 1 == 0);
}


function reportToGA(req, width, height) {
	var referer = req.get('referer');
	var ua = require('universal-analytics');
	var uaUUID = (req.cookies && req.cookies.uaUUID) ? req.cookies.uaUUID : null;
	var visitor = ua('UA-51384-17', uaUUID);

	var dims = width + 'x' + height;

	// Visitor#event(category, action, label, value)
	visitor.event('hotlink', referer, dims).send();
}


module.exports = function(req, res) {
	var width = (req.params.width) ? parseInt(req.params.width) : undefined;
	var height = (req.params.height) ? parseInt(req.params.height) : width;

	if (!isInt(width) || !isInt(height)) {
		res.status(404);
		res.send('<h1>Not Found</h1>');
	}
	else {
		img(width, height, function(err, svgString) {
			zlib.gzip(svgString, function(err, svgCompressed) {
				var cacheTime = 60 * 60 * 24 * 7; // 7 Days
				var expires = new Date(Date.now() + (cacheTime * 1000)).toUTCString();

				res.writeHead(200, {
					'Content-Type': 'image/svg+xml',
					'Content-Encoding': 'gzip',
					'Cache-Control': 'public, max-age=' + (cacheTime),
					'Expires': expires
				});

				res.end(svgCompressed);

				process.nextTick(reportToGA.bind(null, req, width, height));
			});

		});
	}
};
