const http = require('http');
const { readFile } = require('fs').promises;

const host = 'localhost';
const port = 3000;

const placeholderRoutes = /^\/(\d{1,9}x\d{1,9}|\d{1,9})$/i;
const placeholderShortcut = /^\/(\d{1,9})$/i;

function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function serveResponse(res, contentType, content) {
  res.setHeader('Content-Type', contentType);
  res.writeHead(200);
  return res.end(content);
}

const servePlaceholder = (url, res) => {
  const dimensions = url.match(placeholderRoutes).pop();
  const [width, height] = placeholderShortcut.test(url) ? [dimensions, dimensions] : dimensions.split('x');
  const svg = `<svg baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <path fill="#ccc" d="M0 0h${width}v${height}H0z"/>
  <text x="${width - 2}" y="${height - 2}" font-size="12" text-anchor="end">${width}×${height}</text>
</svg>`;
  return serveResponse(res, 'image/svg+xml', svg);
};

const serveHtml = (res) => {
  return Promise.all([readFile(`${__dirname}/public/index.html`), readFile(`${__dirname}/index.js`)]).then(
    ([htmlContents, sourceContents]) => {
      const escapedSource = escapeHtml(sourceContents.toString());
      const mergedContents = htmlContents.toString().replace('<pre />', `<pre>${escapedSource}</pre>`);

      return serveResponse(res, 'text/html', mergedContents);
    }
  );
};

const serveFavicon = (res) => {
  return readFile(`${__dirname}/public/favicon.ico`).then((contents) => serveResponse(res, 'image/x-icon', contents));
};

const requestListener = (req, res) => {
  if (placeholderRoutes.test(req.url)) {
    return servePlaceholder(req.url, res);
  } else if (req.url === '/') {
    return serveHtml(res);
  } else if (req.url === '/favicon.ico') {
    return serveFavicon(res);
  } else {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(404);
    return res.end('not found');
  }
};

const server = http.createServer(requestListener);
server.listen(port, host, async () => {
  console.log(`Server is running on http://${host}:${port}`);
});
