const express = require('express')
const fetch = require('node-fetch');
const router = express.Router()

router.get('/', (req, res, next) => {
	const headers = { headers: {Cookie: `ulang=${req.app.locals.lang}`} };

	fetch('http://localhost:3000/api/projects/', headers)
		.then(response => response.json())
		.then(projects => {
			res.render('./../views/projects', { projects: projects }, (err, html) => {
				if (err) {
					throw err;
				} else {
					res.send(html);
				}
			});
		});
});

router.get('/:id', (req, res, next) => {
	fetch('http://localhost:3000/api/projects/' + req.params.id)
		.then(response => response.json())
		.then(project => {
			const objForTemplate = {
				project: project.project,
				publications: project.publications
			};

			res.render('./../views/project', objForTemplate, (err, html) => {
				if (err) {
					throw err;
				} else {
					res.send(html);
				}
			});
		});
});

module.exports = router
