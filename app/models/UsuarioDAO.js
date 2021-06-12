function UsuarioDAO(connection){
	this._connection = connection;
}

UsuarioDAO.prototype.save = function(usuario, callback){
	this._connection((db, client) => {
		let collection = db.collection("usuario");

		collection.insertOne(usuario, function(err, success) {
			if(success.result.ok && callback)
				callback();
		});

		client.close();
	});
}

UsuarioDAO.prototype.autenticar = function(usuario, req, res) {
	this._connection((db, client) => {
		let collection = db.collection("usuario");

		collection.find(usuario).toArray(function(err, result) {
			if(result[0]){
				req.session.autenticado = true;
				req.session.usuario = result[0].usuario;
				req.session.casa = result[0].casa;

				res.redirect('jogo');
			} else {
				res.render('index', {validation: null, body: usuario});
			}
		});

		client.close();
	});
}

module.exports = function(){
	return UsuarioDAO;
}