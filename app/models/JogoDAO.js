var ObjectID = require('mongodb').ObjectID;

function JogoDAO(connection) {
	this._connection = connection;
}

JogoDAO.prototype.generateParams = function(usuario, callback) {
	this._connection((db, client) => {
		let collection = db.collection("jogo");
        
        let jogo = {
            usuario,
            moeda: 15, 
            suditos: 10,
            temor: Math.floor((Math.random() * 1000)),
            sabedoria: Math.floor((Math.random() * 1000)),
            comercio: Math.floor((Math.random() * 1000)),
            magia: Math.floor((Math.random() * 1000))
        }

		collection.insertOne(jogo, function(err, success) {
			if(success.result.ok && callback)
				callback();
		});

		client.close();
	});
};


JogoDAO.prototype.update = function(update, callback) {
	this._connection((db, client) => {
		let collection = db.collection("jogo");

		collection.updateOne(update.where, {$set: update.set}, (err, success) => {
			if(success.result.ok && callback) callback();
		});

		client.close();
	});
};

JogoDAO.prototype.revogarAcao = function(_id, callback) {
	this._connection((db, client) => {
		let collection = db.collection("acao");

		collection.deleteOne({_id: ObjectID(_id)}, (err, success) => {
			if(success.result.ok && callback) callback();
		});

		client.close();
	});
};

JogoDAO.prototype.startGame = function(usuario, callback) {
	this._connection((db, client) => {
		let collection = db.collection("jogo");
        
		collection.find(usuario).toArray(function(err, result) {
            if(callback)
                callback(result[0] || {});
		});

		client.close();
	});
};

JogoDAO.prototype.acao = function(acao, callback) {
	this._connection((db, client) => {
		let collection = db.collection("acao");
        
		collection.insertOne(acao, function(err, success) {
			if(success.result.ok && callback)
				callback();
		});

		client.close();
	});
};

JogoDAO.prototype.getAcoes = function(usuario, callback) {
	this._connection((db, client) => {
		let collection = db.collection("acao");

		collection.find({usuario, acao_termina_em: {$gt: new Date().getTime()}}).toArray(function(err, result) {
			if(callback)
				callback(result);
		});

		client.close();
	});
};

module.exports = function(){
	return JogoDAO;
};