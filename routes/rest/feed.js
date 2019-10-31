const express = require('express')

module.exports = serviceFeed => {
	const router = express.Router()

	router.get('/', (req, res, next) => {
		serviceFeed.getFeeds(/* from date */)(req.app.locals.lang)((err, feeds) => {
			if (err) {
				const isTranslationNotOk = req.app.locals.t === undefined ||
					req.app.locals.t['ERRORS'] === undefined ||
					req.app.locals.t['ERRORS']['FEEDS_ERROR'] === undefined;
				if (isTranslationNotOk) {
					res.status(500).json({ 'errors': [err.message] });
				} else {
					res.status(500).json({ 'errors': [req.app.locals.t['ERRORS']['FEEDS_ERROR']] });
				}
			} else {
				res.json(feeds);
			}
		})
	});

	return router
}
