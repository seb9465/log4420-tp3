const express = require('express')

module.exports = serviceTeam => {
	const router = express.Router()

	router.get('/', (req, res, next) => {
		serviceTeam.getTeamMembers((err, data) => {
			if (err) {
				const isTranslationNotOk =
					req.app.locals.t === undefined ||
					req.app.locals.t['ERRORS'] === undefined ||
					req.app.locals.t['ERRORS']['MEMBERS_ERROR'] === undefined;
				const errorJson = { 'errors': isTranslationNotOk ? [err.message] : [req.app.locals.t['ERRORS']['MEMBERS_ERROR']] };

				res.status(500).json(errorJson);
			} else {
				res.json(data);
			}
		});
	});

	return router
}
