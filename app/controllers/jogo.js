module.exports.jogo = (application, req, res) => {
	if(!req.session.autenticado) {
		res.send('Página não autorizada!');
	}

	let connection = application.config.dbConnection;
	let jogoDAO = new application.app.models.JogoDAO(connection);

	jogoDAO.startGame({usuario: req.session.usuario}, jogo => {
		res.render('jogo', {img_casa: req.session.casa, jogo});
	});
}

module.exports.suditos = (application, req, res) => {
	if(!req.session.autenticado) {
		res.send('Página não autorizada!');
		return;
	}
	res.render('suditos', {validation: {}, body: {}});
}

module.exports.pergaminhos = (application, req, res) => {
	if(!req.session.autenticado) {
		res.send('Página não autorizada!');
		return;
	}

	let connection = application.config.dbConnection;
	let jogoDAO = new application.app.models.JogoDAO(connection);
	let usuario = req.session.usuario;

	jogoDAO.getAcoes(usuario, function(acoes) {
		res.render('pergaminhos', {validation: {}, body: {}, acoes});
	});
}

module.exports.ordenarAcaoSudito = (application, req, res) => {
	let body = req.body;

	if(!req.session.autenticado) {
		res.send('Página não autorizada!');
		return;
	}

	req.assert('acao', 'A ação deve ser informada.').notEmpty();
	req.assert('quantidade', 'A quantida deve ser informada.').notEmpty();

	let errors = req.validationErrors();

	if(errors) {
		let validation = {}

		errors.map(error => {
			validation[error.param] = error.msg;
		});

		res.render('suditos', {validation, body});
		return;
	}

	let connection = application.config.dbConnection;
	let jogoDAO = new application.app.models.JogoDAO(connection);
	let acao_termina_em = {
		'1': 1 * 60 * 60000,
		'2': 2 * 60 * 60000,
		'3': 5 * 60 * 60000,
		'4': 5 * 60 * 60000
	}
	
	body.acao_termina_em = new Date().getTime() + acao_termina_em[body.acao];
	body.usuario = req.session.usuario;
	jogoDAO.acao(body);

	res.send('Tudo Ok!');
}