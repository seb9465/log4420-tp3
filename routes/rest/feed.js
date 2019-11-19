const express = require('express')

module.exports = serviceFeed => {
	const router = express.Router()

	router.get('/', (req, res, next) => {
		serviceFeed.getFeeds(new Date(2019, 09))(req.app.locals.lang)((err, feeds) => {
			if (err) {
				const isTranslationNotOk = 
					req.app.locals.t === undefined ||
					req.app.locals.t['ERRORS'] === undefined ||
					req.app.locals.t['ERRORS']['FEEDS_ERROR'] === undefined;
				
				const errorJson = { 'errors': isTranslationNotOk ? [err.message] : [req.app.locals.t['ERRORS']['FEEDS_ERROR']] };

				res.status(500).json(errorJson);
			} else {
				res.json(feeds);
			}
		});
	});

	return router
}
