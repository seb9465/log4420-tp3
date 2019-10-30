const express = require('express')
const async = require('async')

module.exports = servicePublication => {
	const router = express.Router()

	router.get('/', (req, res, next) => {
		const sortByOptions = { date: 'date', title: 'title' };
		const orderByOptions = { asc: 'asc', desc: 'desc' };

		const limit = req.params && req.param.limit ? req.params.limit : 10;
		const page = req.params && req.param.page ? req.params.page : 1;
		const sortBy = req.params && req.param.sort_by ? req.params.sort_by : sortByOptions.date;
		const orderBy = req.params && req.params.order_by ? req.params.order_by : orderByOptions.desc;
		const pageOpts = {
			limit: limit,
			pageNumber: page,
			sorting: [
				[ sortBy, orderBy ]
			]
		};

		servicePublication.getPublications(pageOpts)((err, data) => {
			if (err) {
				if (req.app.locals.t && req.app.locals.t['ERRORS'] && req.app.locals.t['ERRORS']['PUBS_ERROR']) {
					res.status(500).json({ 'errors': [req.app.locals.t['ERRORS']['PUBS_ERROR']] });
				} else {
					res.status(500).json({ 'errors': [err.message] });
				}
			} else {
				data = data ? data : [];
				res.json({ 'count': data.length, 'publications': data});
			}
		});
	});

	return router
}
