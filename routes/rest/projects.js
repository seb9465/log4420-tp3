const express = require('express')
const async = require('async')

module.exports = (serviceProjects, servicePublication) => {
	const router = express.Router()

	router.get('/', (req, res, next) => {
		serviceProjects.getProjects(req.app.locals.lang)((err, data) => {
			if (err) {
				const isTranslationNotOk = req.app.locals.t === undefined ||
						req.app.locals.t['ERRORS'] === undefined ||
						req.app.locals.t['ERRORS']['PROJECT_ERROR'] === undefined;
					if (isTranslationNotOk) {
						res.status(500).json({ 'errors': [err.message] });
					} else {
						res.status(500).json({ 'errors': [req.app.locals.t['ERRORS']['PROJECT_ERROR']] });
					}
			} else {
				res.json(data);
			}
		});
	});

	router.get('/:id', (req, res, next) => {
		serviceProjects.getProjectById(req.app.locals.t)(req.app.locals.lang)(req.params.id)((err, projects) => {
			if (err) {
				if (err.name == 'NOT_FOUND') {
					const isTranslationNotOk = req.app.locals.t === undefined ||
						req.app.locals.t['ERRORS'] === undefined ||
						req.app.locals.t['ERRORS']['PROJECT_NOT_FOUND'] === undefined;
					if (isTranslationNotOk) {
						res.status(404).json({ 'errors': [err.message] });
					} else {
						res.status(404).json({ 'errors': [req.app.locals.t['ERRORS']['PROJECT_NOT_FOUND'] + req.params.id] });
					}
				} else {
					const isTranslationNotOk = req.app.locals.t === undefined ||
						req.app.locals.t['ERRORS'] === undefined ||
						req.app.locals.t['ERRORS']['PROJECTS_ERROR'] === undefined;
					if (isTranslationNotOk) {
						res.status(500).json({ 'errors': [err.message] });
					} else {
						res.status(500).json({ 'errors': [req.app.locals.t['ERRORS']['PROJECTS_ERROR']] });
					}
				}
			} else {
				servicePublication.getPublicationsByIds(projects.publications)((err, publications) => {
					res.json({'project': projects, 'publications': publications});
				});
			}
		});
	})

	return router
}
