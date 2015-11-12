import _ from 'lodash';
import ua from 'universal-analytics';

const CACHE_TIME = 60 * 60 * 24 * 30; // 30 days



export default function(req, res) {
    const width = (req.params.width) ? parseInt(req.params.width, 10) : undefined;
    const height = (req.params.height) ? parseInt(req.params.height, 10) : width;

    if (!isInt(width) || !isInt(height)) {
        return respondWithError(res);
    }
    else {
        setTimeout(reportToGA.bind(null, req, width, height));

        return respondWithSvg(res, width, height);
    }
}



function respondWithError(res) {
    return res.status(400).send('<h1>invalid</h1>');
}



function respondWithSvg(res, width, height) {
    const svg = [
        `<?xml version="1.0" encoding="UTF-8" standalone="no"?>`,
        `<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewport="0 0 ${width} ${height}">`,
            `<desc>Powered by http://nosrc.net</desc>`,
            `<rect fill="#ccc" stroke-width="none" width="${width}" height="${height}" />`,
            `<text x="${width - 2}" y="${height - 2}" font-size="12" text-anchor="end" fill="#000">${width}×${height}</text>`,
        `</svg>`,
    ].join('');


    return res
        .type('image/svg+xml')
        .set({
            'Cache-Control': `public, max-age=${CACHE_TIME}`,
            'Expires': new Date(Date.now() + CACHE_TIME * 1000).toUTCString(),
        })
        .send(svg);
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
    const gaAccountId = 'UA-51384-17';
    const referer = req.get('referer');
    const dims = width + 'x' + height;

    const isHotlink = (
        !referer
        || (
            referer.indexOf('localhost') === -1
            && referer.indexOf('nosrc.net') === -1
        )
    );

    // console.log('reportToGA', gaAccountId, referer, dims, isHotlink);

    if (isHotlink) {
        const uaUUID = (req.cookies && req.cookies.uaUUID) ? req.cookies.uaUUID : null;
        const visitor = ua(gaAccountId, uaUUID);

        //Visitor#event(category, action, label, value)
        visitor.event('hotlink', referer, dims).send();
    }
}

