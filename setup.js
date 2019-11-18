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

let addTeam = (client) => {
	return new Promise((resolve, reject) => (
		fs.readFile('./data/team.yml', 'utf8', async (err, content) => {
			if (err) {
				throw err;
			} else {
				await client.db(config.dbName).createCollection('members');
				const yamlContentOpt = yaml.safeLoad(content);
				const members = ((yamlContentOpt === null) ? [] : yamlContentOpt);
				
				const col = client.db(config.dbName).collection('members');
				members.forEach(async doc => {
					await col.insertOne({...doc});
				});

				console.log('[MongoDB] Added members from YAML.');

				resolve()
			}
		})
	))
}

let addPublications = (client) => {
	return new Promise((resolve, reject) => (
		fs.readFile('./data/publications.yml', 'utf8', async (err, content) => {
			if (err) {
				throw err;
			} else {
				await client.db(config.dbName).createCollection('publications');
				const yamlContentOpt = yaml.safeLoad(content);
				const publications = ((yamlContentOpt === null) ? [] : yamlContentOpt)
					.map(s => {
						return {
							...s
						}
					});

				const col = client.db(config.dbName).collection('publications');
				publications.forEach(async doc => {
					await col.insertOne({ ...doc });
				});

				console.log('[MongoDB] Added publications from YAML.');

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
				// Création de la nouvelle collection.
				await client.db(config.dbName).createCollection('projects');
				const pubsDB = await client.db(config.dbName).collection('publications').find().toArray();

				// Récupération des informations du fichier YAML.
				const yamlContentOpt = yaml.safeLoad(content);
				const projects = ((yamlContentOpt === null) ? [] : yamlContentOpt).map(s => {
					const pubsKeys = (s.publications === undefined) ? [] : s.publications;
					s.publications = [];

					pubsKeys.forEach(key => {
						const pubs = pubsDB.filter(elem => elem.key === key);
						pubs.forEach(p => s.publications.push(p._id));
					})

					return {
						...s,
						publications: s.publications
					}
				});

				// Retrait du champ `key` pour chaque document de Publications
				client.db(config.dbName).collection('publications').updateMany({}, { $unset : { 'key' : 1 } });
				
				// Ajout des informations du fichier YAML dans la collection `projects`.
				const projectsCol = client.db(config.dbName).collection('projects');
				projects.forEach(async doc => {
					await projectsCol.insertOne({...doc});
				});

				console.log('[MongoDB] Added projects from YAML.');

				resolve();
			}
		})
	))
}


let main = async () => {
	// Connexion à la base de données.
	let client = await clientConnect();

	// Suppression de toutes les collection courantes.
	await removeAll(client);

	// Ajout des news YAML dans la DB
	await addNews(client);
	
	// Ajout des seminars YAML dans la DB
	await addSeminars(client);
	
	// Ajout des members YAML dans la DB
	await addTeam(client);
	
	// Ajout des publications YAML dans la DB
	await addPublications(client);
	
	// Ajout des projects YAML dans la DB
	await addProjects(client);

	// Déconnexion de la base de donnée.
	disconnectClient(client);
}

main();
