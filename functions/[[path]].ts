const placeholderRoutes = /^(\d{1,9}x\d{1,9}|\d{1,9})$/i;
const placeholderShortcut = /^(\d{1,9})$/i;

export const onRequestGet: PagesFunction = async (context) => {
  const { request, params } = context;

  // index
  if (!params.path) {
    return responseStatic(context);
  }

  // page not found
  if (!Array.isArray(params.path) || params.path.length !== 1) {
    return respondNotFound();
  }

  const path = params.path[0];

  if (path === 'favicon.ico') {
    return responseStatic(context);
  }

  if (!placeholderRoutes.test(path)) {
    return respondNotFound();
  }

  return respondSVG(path, request.headers);
};

const respondNotFound = (): Response => new Response('not found', { status: 404 });
const responseStatic: PagesFunction = ({ request, env }) => env.ASSETS.fetch(request);

const respondSVG = (path: string, headers: Headers): Response => {
  const placeholderMatch = path.match(placeholderRoutes) ?? [];
  const dimensions = placeholderMatch.pop() ?? '';
  const [widthString, heightString] = placeholderShortcut.test(path) ? [dimensions, dimensions] : dimensions.split('x');

  const width = parseInt(widthString ?? '', 10);
  const height = parseInt(heightString ?? '', 10);

  if (isNaN(width) || isNaN(height)) {
    return respondNotFound();
  }

  headers.set('content-type', 'image/svg+xml');
  return new Response(getSvgContent(width, height), { headers });
};

const getSvgContent = (width: number, height: number) => {
  return `<svg baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <path fill="#ccc" d="M0 0h${width}v${height}H0z"/>
  <text x="${width - 2}" y="${height - 2}" font-size="12" text-anchor="end">${width}×${height}</text>
</svg>`;
};
