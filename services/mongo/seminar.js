const moment = require('moment')
const { getTranslation } = require('../utils')

/**
 * Fonction de rappel pour récupérer les séminaires
 *
 * @callback seminarCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} result - Séminaires
 */

/**
 *  Obtenir l'ensemble des séminaires.
 *
 *  @param db - Base de données Mongo
 *  @param {Object} query - Requête particulière sous le format suivant:
 *    { from: <DATE>, sort: { field: <string>, order: <ASC|DESC> } }
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {seminarCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getSeminars = db => query => language => callback => {
	db.collection('seminars').find().toArray((err, dbSeminars) => {
		const seminars = (dbSeminars === null ? [] : dbSeminars).map(s => {
			s.title = getTranslation(language, s.title);
			s.description = getTranslation(language, s.description);
			s.date = moment(s.date, 'YYYY-MM-DD HH:mm:ss').toDate();
			s.createdAt = moment(s.createdAt, 'YYYY-MM-DD HH:mm:ss').toDate();
			
			return {
				...s
			}
		});

		callback(null, seminars);
	});
}

module.exports = db => {
	return {
		getSeminars: getSeminars(db)
	}
}
