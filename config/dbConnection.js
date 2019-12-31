const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017';
 
const connection = (callback) => {

	// Use connect method to connect to the server
	MongoClient.connect(url, (err, client) => {
		assert.equal(null, err);
		console.log("Connected successfully to server");

		// 'got' is the database
		const db = client.db('got');

		callback(db, client);
	});
}

module.exports = function() {
	return connection;
};