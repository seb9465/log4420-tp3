const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const changeLang = require('./../middlewares/changeLang').changeLang

router.get('/', changeLang, (req, res, next) => {
	const headers = { headers: {Cookie: `ulang=${req.app.locals.lang}`} };
	
	fetch('http://localhost:3000/api/feed/', headers)
		.then(response => response.json())
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

module.exports = router
