const moment = require('moment');

module.exports.changeLang = (req, res, next) => {
	const isClangQueryOk = !(req.query === undefined && req.query.clang === undefined);

	if (isClangQueryOk) {
		moment.locale(req.query.clang);
	}

	return next();
}

