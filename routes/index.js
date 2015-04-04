'use strict';

module.exports = function(app/*, express*/) {

	// function dumpRoute(req, res) {
	// 	res.send(req.params);
	// }


	/*
	*	Home
	*/

	app.get('/', (req, res) => res.render('home'));




	/*
	*	img
	*/

	app.get('/:width([0-9]{1,})x:height([0-9]{1,})', require(GLOBAL.paths.getRoute('img')));
	app.get('/:width([0-9]{1,})', require(GLOBAL.paths.getRoute('img')));


	return;
};
