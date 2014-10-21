'use strict';

module.exports = function(app, express) {

	var dumpRoute = function(req, res) {
		res.send(req.params);
	}
	

	/*
	*	Home
	*/

	app.get('/', function(req, res) {
		res.render('home');
	});
	



	/*
	*	img
	*/

	app.get('/:width([0-9]{1,})x:height([0-9]{1,})', require(GLOBAL.paths.getRoute('img')));
	app.get('/:width([0-9]{1,})', require(GLOBAL.paths.getRoute('img')));


	return;
};
