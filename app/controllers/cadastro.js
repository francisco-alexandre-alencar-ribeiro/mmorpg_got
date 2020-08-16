module.exports.cadastro = (application, req, res) => {
	res.render('cadastro', { body: {}, validation: {} });
}

module.exports.cadastrar = (application, req, res) => {
	let body = req.body;

	req.assert('nome', 'O campo nome não pode ficar vazio.').notEmpty();
	req.assert('usuario', 'O campo usuario não pode ficar vazio.').notEmpty();
	req.assert('senha', 'O campo senha não pode ficar vazio.').notEmpty();
	req.assert('casa', 'A casa deve ser selecionada.').notEmpty();

	let errors = req.validationErrors();

	if(errors) {
		let validation = {}

		errors.map(error => {
			validation[error.param] = error.msg;
		});

		res.render('cadastro', {validation, body});
		return;
	}

	var connection = application.config.dbConnection;
	var usuario = new application.app.models.UsuarioDAO(connection);
	var jogo = new application.app.models.JogoDAO(connection)
	jogo.generateParams(body.usuario);

	usuario.save(body, () => {
		res.redirect('/');
	});
}