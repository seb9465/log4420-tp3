const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')

const moment = require('moment')

router.get('/', changeLang, (req, res, next) => {
	fetch('http://localhost:3000/api/feed/')
		.then(res => res.json())
		.then(feeds => {
			res.render('./../views/index', { feeds: feeds }, (err, html) => {
				if (err) {
					throw err;
				} else {
					res.send(html);
				}
			});
		});
});

function changeLang(req, res, next) {
	const isClangQueryOk = !(req.query === undefined && req.query.clang === undefined);

	if (isClangQueryOk) {
		moment.locale(req.query.clang);
	}

	return next();
}

module.exports = router
