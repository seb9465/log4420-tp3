const express = require('express')
const async = require('async')

module.exports = (serviceProjects, servicePublication) => {
	const router = express.Router()

	router.get('/', (req, res, next) => {
		serviceProjects.getProjects(req.app.locals.lang)((err, data) => {
			if (err) {
				res.status(500).json({ 'errors': [err.message] });
			} else {
				res.status(200).json(data);
			}
		});
	});

	

	return router
}
