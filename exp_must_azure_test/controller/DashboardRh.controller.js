const errorHandler = require('../helper/errorHandler');
const db = require('../database/models');
const Op = db.Sequelize.Op;
const FichePoste = db.FichePoste;
const loggerHandler = require('../helper/loggerHandler');

exports.getPage = async (req, res, next) => {
	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return;
	}

	const nbrFichePosteWaiting = await FichePoste.count({
		where: { validationRh: 0 },
	});

	let { error } = req.query;

	let params = {
		active: { dashboardRh: true },
		nbrWaiting: nbrFichePosteWaiting,
	};

	res.render('dashboardRh', params);
};
