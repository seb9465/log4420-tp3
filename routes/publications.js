const express = require('express')
const fetch = require('node-fetch')
const router = express.Router()
const moment = require('moment')
const changeLang = require('./../middlewares/changeLang').changeLang

router.get('/', changeLang, (req, res, next) => {
	fetch('http://localhost:3000/api/publications/')
		.then(response => response.json())
		.then(publications => {
			const objForTemplate = {
				publications: publications.publications,
				pubFormErrors: {},	// TODO
				pagingOptions: {},
				numberOfPages: {},
				monthNames: {}
			};
			
			res.render('./../views/publication', objForTemplate, (err, html) => {
				if (err) {
					throw err;
				} else {
					res.send(html);
				}
			});
		});
});

module.exports = router
