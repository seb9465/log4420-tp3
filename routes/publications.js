const express = require('express')
const fetch = require('node-fetch')
const router = express.Router()
const moment = require('moment')

/**
 * Gets all the the publications by calling the BE's API.
 * Then, renders the HTML page.
 * @param {Request} req Request object from Express
 * @param {Response} res Response object from Express
 * @param {Function} next Middleware from Express
 */
function getPublications(req, res, next) {
	const opts = {
		methods: 'GET',
		headers: { Cookie: `ulang=${req.app.locals.lang}` }
	};

	let q = encodeQueryData(req.query);
	q = q ? '?' + q : q;

	fetch(`http://localhost:3000/api/publications${q}`, opts)
		.then(response => response.json())
		.then(publications => {
			const sortByOptions = { date: 'date', title: 'title' };
			const orderByOptions = { asc: 'asc', desc: 'desc' };

			const limit = req.query && req.query.limit ? req.query.limit : 10;	// limite par page
			const page = req.query && req.query.page ? req.query.page : 1;		// numéro de la page du tableau
			const sortBy = req.query && req.query.sort_by ? req.query.sort_by : sortByOptions.date;
			const orderBy = req.query && req.query.order_by ? req.query.order_by : orderByOptions.desc;
			const pageOpts = {
				limit: limit,
				pageNumber: page,
				orderBy: orderBy,
				sortBy: sortBy
			};

			const objForTemplate = {
				publications: publications.publications,
				pubFormErrors: {},
				pagingOptions: pageOpts,
				numberOfPages: Math.ceil(publications.count / pageOpts.limit),
				monthNames: moment.months()
			};

			res.render('./../views/publication', objForTemplate, (err, html) => {
				if (err) {
					next(err);
				} else {
					res.send(html);
				}
			});
		});
}

/* Tiré de stackoverflow */
function encodeQueryData(data) {
	const ret = [];
	for (let d in data) {
		ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
	}

	return ret.join('&');
}

/**
 * Saves a publication by calling the BE's API.
 * @param {Request} req Request object from Express
 * @param {Response} res Response object from Express
 * @param {Function} next Middleware from Express
 */
function savePublication(req, res, next) {
	const opts = {
		methods: 'POST',
		headers: { Cookie: `ulang=${req.app.locals.lang}` }
	};

	fetch('http://localhost:3000/api/publications/', opts)
		.then(response => next());
}

router.get('/', getPublications);

router.post('/', savePublication, getPublications);

module.exports = router
