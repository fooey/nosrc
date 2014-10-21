
module.exports = {
	getPath: __getPath,

	getConfig: __getPath.bind(null, 'config'),
	getPublic: __getPath.bind(null, 'public'),
	getRoute: __getPath.bind(null, 'routes'),
	getService: __getPath.bind(null, 'services'),
	getView: __getPath.bind(null, 'views'),
};

function __getPath(pathRoot, partialPath) {
	partialPath = partialPath || '';
	return require('path').join(process.cwd(), pathRoot, partialPath);
}
