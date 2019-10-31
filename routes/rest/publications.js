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

	router.post('/', (req, res, next) => {
		const MIN_MONTH = 0;
		const MAX_MONTH = 11;
		const TITLE_MIN_CHARACTER_NUMBER = 5;
		const VENUE_MIN_CHARACTER_NUMBER = 5;
		const errors = []

		// req.body vide
		if (Object.keys(req.body).length === 0) {
			errors.push(req.app.locals.t['ERRORS']['PUB_CREATE_ERROR']);
		} 
		// Aucun auteur
		if (req.body.authors === undefined || req.body.authors.length === 0) {
			errors.push(req.app.locals.t['ERRORS']['AUTHOR_EMPTY_FORM']);
		} 
		// année n'est pas un nombre
		if (typeof req.body.year != 'number') {
			errors.push(req.app.locals.t['ERRORS']['YEAR_NOT_INT_FORM']);
		} 
		// le mois n'est pas entre 0 et 11
		if (req.body.month < MIN_MONTH || req.body.month > MAX_MONTH) {
			errors.push(req.app.locals.t['ERRORS']['MONTH_ERROR_FORM']);
		} 
		// titre n'a pas au moins 5 caractères
		if (req.body.title.length < TITLE_MIN_CHARACTER_NUMBER) {
			errors.push(req.app.locals.t['ERRORS']['PUB_AT_LEAST_5_CHAR_FORM']);
		} 
		// Conférence n'a pas au moins 5 caractères
		if (req.body.venue.length < VENUE_MIN_CHARACTER_NUMBER) {
			errors.push(req.app.locals.t['ERRORS']['VENUE_AT_LEAST_5_CHAR_FORM']);
		} 
		
		if (errors.length > 0) {
			res.status(400).json({ 'errors': errors });
		} else {
			const publication = {
				title: req.body.title,
				year: req.body.year,
				month: req.body.month,
				authors: req.body.authors,
				venue: req.body.venue
			};
	
			servicePublication.createPublication(publication)((err) => {
				if (err) {
					if (req.app.locals.t && req.app.locals.t['ERRORS'] && req.app.locals.t['ERRORS']['PUB_CREATE_ERROR']) {
						res.status(500).json({ 'errors': [req.app.locals.t['ERRORS']['PUB_CREATE_ERROR']] });
					} else {
						res.status(500).json({ 'errors': [err.message] });
					}
				} else {
					res.status(201).json('OK');
				}
			});
		}
	});

	router.delete('/:id', (req, res, next) => {
		servicePublication.removePublication(req.params.id)((err) => {
			// Gestion du cas où le ID n'existe pas.
			// if (req.app.locals.t && req.app.locals.t['ERRORS'] && req.app.locals.t['ERRORS']['PUB_NOT_FOUND_ERROR']) {
			// 	res.status(404).json({ 'errors': [req.app.locals.t['ERRORS']['PUB_NOT_FOUND_ERROR']] });
			// } else {
			// 	res.status(404).json({ 'errors': [err.message] });
			// }

			if (err) {
				if (req.app.locals.t && req.app.locals.t['ERRORS'] && req.app.locals.t['ERRORS']['PUB_DELETE_ERROR']) {
					res.status(500).json({ 'errors': [req.app.locals.t['ERRORS']['PUB_DELETE_ERROR']] });
				} else {
					res.status(500).json({ 'errors': [err.message] });
				}
			} else {
				res.send('done');
			}
		});
	});

	return router
}
