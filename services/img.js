"use strict";

module.exports = function(width, height, callback) {
	var util = require('util');

	var bgColor = '#ccc';

	var svgData = [
		'<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
		util.format('<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewport="0 0 %d %d">', width, height, width, height),
			'<desc>Powered by http://nosrc.net</desc>',
			util.format('<rect fill="%s" stroke-width="none" width="%d" height="%d" />', bgColor, width, height),
			util.format('<text x="%d" y="%d" font-size="12" text-anchor="end" fill="#000">%d×%d</text>', width - 2, height - 2, width, height),
		'</svg>'
	];

	callback(null, svgData.join(''));
};