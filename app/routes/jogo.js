module.exports = (application) => {
	application.get('/jogo', (req, res) => {
		application.app.controllers.jogo.jogo(application, req, res);
	});

	application.get('/suditos', (req, res) => {
		application.app.controllers.jogo.suditos(application, req, res);
	});

	application.get('/pergaminhos', (req, res) => {
		application.app.controllers.jogo.pergaminhos(application, req, res);
	});

	application.post('/ordenar_acao_sudito', (req, res) => {
		application.app.controllers.jogo.ordenarAcaoSudito(application, req, res);
	});
}