const db = require('../database/models');
const Op = db.Sequelize.Op;
const FichePoste = db.FichePoste;
const Candidature = db.Candidature;
const errorHandler = require('../helper/errorHandler');
const loggerHandler = require('../helper/loggerHandler');
const azureService = require('../azureService/graph');

// Methods 'READ'
exports.getReadPage = async (req, res, next) => {
	const candidatureId = parseInt(req.params.candidatureId, 10);

	let params = {};

	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return;
	}

	const groups = await azureService.getMainGroups(
		req.app.locals.msalClient,
		req.session.userId
	);

	if (groups.includes('RH')) {
		params.rh = true;
	} else if (groups.includes('FINANCE')) {
		params.finance = true;
		'/ficheposte/financevalid/' + fichePosteId;
		params.financeRefuseLink = '/ficheposte/financerefuse/' + fichePosteId;
	} else if (groups.includes('MANAGER')) {
		params.manager = true;
	}

	Candidature.findAll({
		where: { id: candidatureId },
	}).then((foundCandidature) => {
		const fichePosteId = foundCandidature[0].datavalues;
		params = {
			active: {
				candidatureRead: true,
			},
			candidature: foundCandidature[0].dataValues,
			fichePosteLink: '/ficheposte/read/' + fichePosteId,
		};
		res.render('candidatureRead', params);
	});
};

exports.getListPage = async (req, res, next) => {
	const candidatureId = parseInt(req.params.candidatureId, 10);
	let params = {};
	let result = [];

	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return;
	}

	const groups = await azureService.getMainGroups(
		req.app.locals.msalClient,
		req.session.userId
	);

	if (groups.includes('RH')) {
		params.rh = true;
	} else if (groups.includes('FINANCE')) {
		params.finance = true;
		'/ficheposte/financevalid/' + fichePosteId;
		params.financeRefuseLink = '/ficheposte/financerefuse/' + fichePosteId;
	} else if (groups.includes('MANAGER')) {
		params.manager = true;
	}

	Candidature.findAll().then((foundCandidatures) => {
		foundCandidatures = foundCandidatures.forEach((candidature, index) => {
			result.push(candidature.dataValues);
			if (index % 2 == 0) {
				result[index].even = true;
			}
			result[index].readLink =
				'/candidature/read/' + candidature.dataValues.id;
		});

		params.active = { candidatureList: true };
		params.candidatureList = result;

		res.render('candidatureList', params);
	});
};

// Methods 'CREATE'
exports.getCreatePage = (req, res, next) => {
	const fichePosteId = parseInt(req.params.fichePosteId, 10);

	let params = {};

	FichePoste.findAll({
		where: {
			id: fichePosteId,
		},
	})
		.then((foundFichePoste) => {
			params = {
				active: { fichePosteRead: true },
				fichePoste: foundFichePoste[0].dataValues,
				fichePosteLink:
					'/ficheposte/read/' + foundFichePoste[0].dataValues.id,
				candidateLink: '/candidature/create',
			};
			res.render('candidature', params);
		})
		.catch((err) => {
			errorHandler.catchDataCreationError(
				err.errors,
				res,
				'fichePosteList'
			);

			return;
		});
};

exports.create = (req, res) => {
	console.log('in create candidature');
	console.log(req.body.candidature_nom);
	console.log(req.body.candidature_prenom);
	console.log(req.body.candidature_telephone);
	console.log(req.body.ficheposteid);

	// Validate request
	if (
		!req.body.candidature_nom ||
		!req.body.candidature_prenom ||
		!req.body.candidature_telephone ||
		!req.body.ficheposteid
	) {
		errorHandler.sendInvalidBodyError(
			res,
			'candidature/create/' + req.body.ficheposteid
		);
		return;
	}
	// Create a Tutorial
	const candidature = {
		nom: req.body.candidature_nom,
		prenom: req.body.candidature_prenom,
		telephone: req.body.candidature_telephone,
		fichePosteId: req.body.ficheposteid,
		mail: req.body.candidature_mail,
	};
	// Save Tutorial in the database
	candidature.cv = req.file.originalname;
	Candidature.create(candidature)
		.then((data) => {
			console.log(data);
			params = { active: { home: true }, createdCandidature: true };

			res.render('home', params);
		})
		.catch((err) => {
			console.log('ERROR : ');
			console.log(err);
			errorHandler.catchDataCreationError(
				err.errors,
				res,
				'candidature/create/' + req.body.ficheposteid
			);
		});
};
