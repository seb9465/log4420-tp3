const express = require('express');
const checkIfTranslationNotOk = require('./utils').checkIfTranslationNotOk;

module.exports = (serviceProjects, servicePublication) => {
	const router = express.Router()

	router.get('/', (req, res, next) => {
		serviceProjects.getProjects(req.app.locals.lang)((err, data) => {
			if (err) {
				const isTranslationNotOk = checkIfTranslationNotOk(req.app.locals.t, 'PROJECTS_ERROR');
				const errorJson = { 'errors': isTranslationNotOk ? [err.message] : [req.app.locals.t['ERRORS']['PROJECTS_ERROR']] };

				res.status(500).json(errorJson);
			} else {
				res.json(data);
			}
		});
	});

	router.get('/:id', (req, res, next) => {
		serviceProjects.getProjectById(req.app.locals.t)(req.app.locals.lang)(req.params.id)((err, projects) => {
			if (err) {
				if (err.name == 'NOT_FOUND') {
					const isTranslationNotOk = checkIfTranslationNotOk(req.app.locals.t, 'PROJECT_NOT_FOUND');
					const errorJson = { 'errors': isTranslationNotOk ? [err.message] : [req.app.locals.t['ERRORS']['PROJECT_NOT_FOUND'] + req.params.id] };

					res.status(404).json(errorJson);
				} else {
					const isTranslationNotOk = checkIfTranslationNotOk(req.app.locals.t, 'PROJECT_ERROR');
					const errorJson = { 'errors': isTranslationNotOk ? [err.message] : [req.app.locals.t['ERRORS']['PROJECT_ERROR']] };

					res.status(500).json(errorJson);
				}
			} else {
				servicePublication.getPublicationsByIds(projects.publications)((err, publications) => {
					res.json({ 'project': projects, 'publications': publications });
				});
			}
		});
	});

	return router;
}
