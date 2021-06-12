module.exports.index = (application, req, res) => {
	res.render('index', {validation: null, body: {}});
}

module.exports.autenticar = (application, req, res) => {
	var body = req.body;

	req.assert('usuario', 'O usuario não pode ficar vazio').notEmpty();
	req.assert('senha', 'A senha não pode ficar vazia').notEmpty();

	let errors = req.validationErrors();

	if (errors) {
		res.render('index', {validation: errors, body});
		return;
	}

	var connection = application.config.dbConnection;
	var usuario = new application.app.models.UsuarioDAO(connection);
	usuario.autenticar(body, req, res);
}


module,exports.sair = (req, res) => {
	req.session.destroy(function(err) {
		res.render('index', {validation: null, body: {}});
	});
}