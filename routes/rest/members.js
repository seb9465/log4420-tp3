const express = require('express')

module.exports = serviceTeam => {
	const router = express.Router()

	router.get('/', (req, res, next) => {
		serviceTeam.getTeamMembers((err, data) => {
			if (err) {
				if (req.app.locals.t && req.app.locals.t['ERRORS'] && req.app.locals.t['ERRORS']['MEMBERS_ERROR']) {
					res.status(500).json({ 'errors': [req.app.locals.t['ERRORS']['MEMBERS_ERROR']] });
				} else {
					res.status(500).json({ 'errors': [err.message] });
				}
			} else {
				res.json(data);
			}
		});
	});

	return router
}
