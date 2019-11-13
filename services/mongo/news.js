const moment = require('moment')
const { getTranslation } = require('../utils')

/**
 * Fonction de rappel pour récupérer les nouvelles
 *
 * @callback newsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} results - Tableaux de nouvelles
 */

/**
 *  Obtenir les nouvelles.
 *
 *  @param db - Base de données Mongo
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {newsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getNews = db => language => callback => {
	// Récupérer tous les documents de la db.
	db.collection('news').find().toArray((err, dbNews) => {
		if (err) throw err;

		const news = (dbNews === null ? [] : dbNews).map(n => {
			n.text = getTranslation(language, n.text);
			n.createdAt = moment(n.createdAt, 'YYYY-MM-DD HH:mm:ss').toDate();

			return {
				...n
			}
		})

		callback(null, news)
	})
}

module.exports = db => {
	return {
		getNews: getNews(db)
	}
}
