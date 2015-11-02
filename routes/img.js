import _ from 'lodash';
import ua from 'universal-analytics';



export default function(req, res) {
    const width = (req.params.width) ? _.parseInt(req.params.width) : undefined;
    const height = (req.params.height) ? _.parseInt(req.params.height) : width;

    if (!isInt(width) || !isInt(height)) {
        res.status(400);
        res.send('<h1>invalid</h1>');
    }
    else {
        getSvgString(width, height, (svgString) => {
            process.nextTick(() => reportToGA(req, width, height));

            return res.type('image/svg+xml').send(svgString);
        });
    }
}



function getSvgString(width, height, callback) {
    callback(`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
        <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewport="0 0 ${width} ${height}">
            <desc>Powered by http://nosrc.net</desc>
            <rect fill="#ccc" stroke-width="none" width="${width}" height="${height}" />
            <text x="${width - 2}" y="${height - 2}" font-size="12" text-anchor="end" fill="#000">${width}×${height}</text>
        </svg>`);
}



function isInt(n) {
    return (typeof n === 'number' && n % 1 === 0);
}



function reportToGA(req, width, height) {
    const referer = req.get('referer');
    const dims = width + 'x' + height;
    const visitor = ua('UA-51384-17');

    // Visitor#event(category, action, label, value)
    visitor.event('hotlink', referer, dims).send();
}

