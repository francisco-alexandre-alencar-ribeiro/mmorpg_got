module.exports.jogo = (application, req, res) => {
	if(req.session.autenticado) {
		res.render('jogo');
	} else {
		res.send('Página não autorizada!');
	}
}