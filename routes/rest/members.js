const express = require('express');
const checkIfTranslationNotOk = require('./utils').checkIfTranslationNotOk;

module.exports = serviceTeam => {
	const router = express.Router()

	router.get('/', (req, res, next) => {
		serviceTeam.getTeamMembers((err, data) => {
			if (err) {
				const isTranslationNotOk = checkIfTranslationNotOk(req.app.locals.t, 'MEMBERS_ERROR');
				const errorJson = { 'errors': isTranslationNotOk ? [err.message] : [req.app.locals.t['ERRORS']['MEMBERS_ERROR']] };

				res.status(500).json(errorJson);
			} else {
				res.json(data);
			}
		});
	});

	return router
}
