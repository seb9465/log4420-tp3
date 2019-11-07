const express = require('express')
const fetch = require('node-fetch')
const router = express.Router()
const moment = require('moment')
const changeLang = require('./../middlewares/changeLang').changeLang

/**
 * Gets all the the publications by calling the BE's API.
 * Then, renders the HTML page.
 * @param {Request} req Request object from Express
 * @param {Response} res Response object from Express
 * @param {Function} next Middleware from Express
 */
function getPublications (req, res, next) {
	const opts = { 
		methods: 'GET',
		headers: {Cookie: `ulang=${req.app.locals.lang}`}
	};

	fetch('http://localhost:3000/api/publications/', opts)
		.then(response => response.json())
		.then(publications => {
			const objForTemplate = {
				publications: publications.publications,
				pubFormErrors: {},	// TODO
				pagingOptions: {},
				numberOfPages: {},
				monthNames: moment.months()
			};
			
			res.render('./../views/publication', objForTemplate, (err, html) => {
				if (err) {
					throw err;
				} else {
					res.send(html);
				}
			});
		});
}

/**
 * Saves a publication by calling the BE's API.
 * @param {Request} req Request object from Express
 * @param {Response} res Response object from Express
 * @param {Function} next Middleware from Express
 */
function savePublication (req, res, next) {
	const opts = { 
		methods: 'POST',
		headers: {Cookie: `ulang=${req.app.locals.lang}`}
	};

	fetch('http://localhost:3000/api/publications/', opts)
		.then(response => next());
}

router.get('/', changeLang, getPublications);

router.post('/', savePublication, getPublications);

module.exports = router
