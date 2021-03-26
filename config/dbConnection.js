const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';
 
const connection = (callback) => {

	// Use connect method to connect to the server
	MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		console.log("Connected successfully to server");

		// 'got' is the database
		const db = client.db('got');
		callback(db, client);
	});
}

module.exports = function() {
	return connection;
};