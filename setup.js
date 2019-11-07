const MongoClient = require('mongodb').MongoClient
const yaml = require('js-yaml')
const fs = require('fs')
const config = require('./config.json')

let clientConnect = () => {
	return new Promise((resolve, reject) => (
		MongoClient.connect(config.dbUrl, { useNewUrlParser: true },
			(err, client) => {
				if (err) throw err;
				
				console.log(`[MongoDB] Connected to ${config.dbUrl}`);

				resolve(client);
			})
	))
}

let removeAll = (client) => {
	return new Promise((resolve, reject) => (
		client.db(config.dbName).listCollections().toArray((err, collections) => {
			if (err) throw err;

			collections.forEach(async collection => {
				await client.db(config.dbName).collection(collection.name).drop();
			});
		
			resolve();
		})
	))
}

let disconnectClient = (client) => {
	client.close();
	console.log('[MongoDB] Disconnected.');
}

let main = async () => {
	// Connexion à la base de données.
	let client = await clientConnect();

	// Suppression de toutes les collection courantes.
	await removeAll(client);

	

	// Déconnexion de la base de donnée.
	disconnectClient(client);
}

main();
