"use strict";

module.exports = function(width, height, callback) {
	const bgColor = '#ccc';

	const svgData = [
		`<?xml version="1.0" encoding="UTF-8" standalone="no"?>`,
		`<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewport="0 0 ${width} ${height}">`,
			`<desc>Powered by http://nosrc.net</desc>`,
			`<rect fill="${bgColor}" stroke-width="none" width="${width}" height="${height}" />`,
			`<text x="${width - 2}" y="${height - 2}" font-size="12" text-anchor="end" fill="#000">${width}×${height}</text>`,
		`</svg>`
	];

	callback(null, svgData.join('\n'));
};