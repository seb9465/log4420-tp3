const MongoClient = require('mongodb').MongoClient
const yaml = require('js-yaml')
const fs = require('fs')
const config = require('./config.json')
const moment = require('moment')

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


let addNews = (client) => {
	return new Promise((resolve, reject) => (
		fs.readFile('./data/news.yml', 'utf8', async (err, content) => {
			if (err) {
				throw err;
			} else {
				await client.db(config.dbName).createCollection('news');
				const yamlContentOpt = yaml.safeLoad(content);
				const news = ((yamlContentOpt === null) ? [] : yamlContentOpt).map(s => {
					return {
						...s,
						type: 'news',
						createdAt: moment(s.createdAt, 'YYYY-MM-DD HH:mm:ss').toDate()
					}
				});
	
				const col = client.db(config.dbName).collection('news');
				news.forEach(async doc => {
					await col.insertOne({...doc});
				});

				console.log('[MongoDB] Added news from YAML.');

				resolve()
			}
		})
	))
}

let addSeminars = (client) => {
	return new Promise((resolve, reject) => (
		fs.readFile('./data/seminars.yml', 'utf8', async (err, content) => {
			if (err) {
				throw err;
			} else {
				await client.db(config.dbName).createCollection('seminars');
				const yamlContentOpt = yaml.safeLoad(content);
				const seminars = ((yamlContentOpt === null) ? [] : yamlContentOpt).map(s => {
					return {
						...s,
						type: 'seminar',
						date: moment(s.date, 'YYYY-MM-DD HH:mm:ss').toDate(),
						createdAt: moment(s.createdAt, 'YYYY-MM-DD HH:mm:ss').toDate()
					}
				});
	
				const col = client.db(config.dbName).collection('seminars');
				seminars.forEach(async doc => {
					await col.insertOne({...doc});
				});

				console.log('[MongoDB] Added seminars from YAML.');

				resolve()
			}
		})
	))
}

let addProjects = (client) => {
	return new Promise((resolve, reject) => (
		fs.readFile('./data/projects.yml', 'utf8', async (err, content) => {
			if (err) {
				throw err;
			} else {
				await client.db(config.dbName).createCollection('projects');
				const yamlContentOpt = yaml.safeLoad(content);
				const projects = ((yamlContentOpt === null) ? [] : yamlContentOpt).map(s => {
					return {
						...s,
						publications: (s.publications === undefined) ? [] : s.publications
					}
				});
	
				const col = client.db(config.dbName).collection('projects');
				projects.forEach(async doc => {
					await col.insertOne({...doc});
				});

				console.log('[MongoDB] Added projects from YAML.');

				resolve()
			}
		})
	))
}


let main = async () => {
	// Connexion à la base de données.
	let client = await clientConnect();

	// Suppression de toutes les collection courantes.
	await removeAll(client);

	await addNews(client);

	await addProjects(client);

	await addSeminars(client);

	// Déconnexion de la base de donnée.
	disconnectClient(client);
}

main();
