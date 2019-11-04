const MongoClient = require('mongodb').MongoClient
const yaml = require('js-yaml')
const fs = require('fs')
const config = require('./config.json')

let db;

MongoClient.connect(config.dbUrl + '/' + config.dbName, (err, d) => {
	if (err) throw err;
	db = d;

	var collection = db.collection('foods')
	collection.insert({ name: 'taco', tasty: true }, function (err, result) {console.log('FOOD')});

	deleteAllCollections();
});

function deleteAllCollections () {
	db.listCollections().toArray((err, coll) => {
		coll.forEach(collection => {
			db.collection(collection.name).drop((err, delOk) => {
				if (err) throw err;
				if (delOk) console.log(`[MONGO_DB] Droped collection \'${collection.name}\'`);
			});
		});
		console.log('after foreach');
	});
}