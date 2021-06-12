module.exports.jogo = (application, req, res) => {
	if(!req.session.autenticado) {
		res.send('Página não autorizada!');
	}

	let connection = application.config.dbConnection;
	let jogoDAO = new application.app.models.JogoDAO(connection);

	jogoDAO.startGame({usuario: req.session.usuario}, jogo => {
		res.render('jogo', {img_casa: req.session.casa, jogo});
	});
};

module.exports.suditos = (application, req, res) => {
	if(!req.session.autenticado) {
		res.send('Página não autorizada!');
		return;
	}

	let connection = application.config.dbConnection;
	let jogoDAO = new application.app.models.JogoDAO(connection);

	jogoDAO.startGame({usuario: req.session.usuario}, jogo => {
		res.render('suditos', {validation: {}, body: {}, jogo});
	});
};

module.exports.pergaminhos = (application, req, res) => {
	if(!req.session.autenticado) {
		res.send('Página não autorizada!');
		return;
	}

	let connection = application.config.dbConnection;
	let jogoDAO = new application.app.models.JogoDAO(connection);
	let usuario = req.session.usuario;

	jogoDAO.getAcoes(usuario, acoes => {
		res.render('pergaminhos', {acoes});
	});
};

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
	let acao = {
		'1': {tempo: 1 * 60 * 60000, moeda: 2 * body.quantidade},
		'2': {tempo: 2 * 60 * 60000, moeda: 3 * body.quantidade},
		'3': {tempo: 5 * 60 * 60000, moeda: 1 * body.quantidade},
		'4': {tempo: 5 * 60 * 60000, moeda: 1 * body.quantidade}
	}
	
	body.acao_termina_em = new Date().getTime() + acao[body.acao].tempo;
	body.usuario = req.session.usuario;
	jogoDAO.acao(body);

	jogoDAO.startGame({usuario: req.session.usuario}, jogo => {

		jogo.moeda -= acao[body.acao].moeda;

		jogoDAO.update({
			where: {usuario: req.session.usuario}, 
			set: jogo
		});

		res.json({message: 'Tudo Ok!', moeda: jogo.moeda});
	});
};

module.exports.revogarAcao = (application, req, res) => {
	let {_id} = req.params;

	if(!req.session.autenticado) {
		res.send('Página não autorizada!');
		return;
	}

	let connection = application.config.dbConnection;
	let jogoDAO = new application.app.models.JogoDAO(connection);

	jogoDAO.revogarAcao(_id, () => {
		jogoDAO.getAcoes(req.session.usuario, acoes => {
			res.render('pergaminhos', {acoes});
		});
	});
}