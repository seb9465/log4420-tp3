const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')

router.get('/', (req, res, next) => {
	const opts = {
		headers: { Cookie: `ulang=${req.app.locals.lang}` }
	};

	fetch('http://localhost:3000/api/members/', opts)
		.then(response => response.json())
		.then(members => {
			res.render('./../views/team', { members: members }, (err, html) => {
				if (err) {
					throw err;
				} else {
					res.send(html);
				}
			});
		});
});

module.exports = router
