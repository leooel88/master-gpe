const db = require('../../../database/models');
const Op = db.Sequelize.Op;
const FichePoste = db.FichePoste;
const Candidature = db.Candidature;
const errorHandler = require('../../../utils/errorHandler');
const loggerHandler = require('../../../utils/loggerHandler');
const azureService = require('../../../utils/azureService/graph');

const { dirname } = require('path');

// Methods 'READ'
exports.getReadPage = async (req, res, next) => {
	const candidatureId = parseInt(req.params.candidatureId, 10);

	const isLoggedIn = loggerHandler.checkLoggedIn(req);

	let params = {};

	if (req.query.notes && req.query.notes == 'true') {
		params.displayNotes = true;
	} else {
		params.displayNotes = false;
	}

	if (req.query.tab && req.query.tab == 'rh') {
		params.displayTabRh = true;
		params.displayTabManager = false;
	} else {
		params.displayTabRh = false;
		params.displayTabManager = true;
	}

	let userParams;

	if (isLoggedIn === true) {
		const groups = await azureService.getMainGroups(
			req.app.locals.msalClient,
			req.session.userId
		);
		console.log(groups);

		if (groups.includes('RH')) {
			userParams = {
				where: { id: candidatureId },
			}
			params.rh = true;
			params.rhValidLink = '/candidature/rhvalid/' + candidatureId;
			params.rhRefuseLink = '/candidature/rhrefuse/' + candidatureId;
		} else if (groups.includes('MANAGER')) {
			userParams = {
				where: { 
					id: candidatureId, 
					validationRh: 1 
				}
			}
			params.manager = true;
			params.managerValidLink =
				'/candidature/managervalid/' + candidatureId;
			params.managerRefuseLink =
				'/candidature/managerrefuse/' + candidatureId;
		} else if (groups.includes('FINANCE')) {
			userParams = {
				where: { id: candidatureId, validationRh: 1, validationManager: 1  },
			}
		} else {
			res.redirect('/')
		}
	}

	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return;
	}

	Candidature.findAll(userParams).then(async (foundCandidature) => {
		const fichePosteId = foundCandidature[0].dataValues.fichePosteId;

		let currentFichePoste;
		await FichePoste.findAll({
			where: { id: fichePosteId },
		}).then((foundFichePoste) => {
			if (foundFichePoste[0].dataValues.entryDate) {
				let offset_1 =
					foundFichePoste[0].dataValues.entryDate.getTimezoneOffset();
				foundFichePoste[0].dataValues.entryDate = new Date(
					foundFichePoste[0].dataValues.entryDate.getTime() -
						offset_1 * 60 * 1000
				);
				foundFichePoste[0].dataValues.entryDate =
					foundFichePoste[0].dataValues.entryDate
						.toISOString()
						.split('T')[0];
			}

			if (foundFichePoste[0].dataValues.endDate) {
				let offset_2 =
					foundFichePoste[0].dataValues.endDate.getTimezoneOffset();
				foundFichePoste[0].dataValues.endDate = new Date(
					foundFichePoste[0].dataValues.endDate.getTime() -
						offset_2 * 60 * 1000
				);
				foundFichePoste[0].dataValues.endDate =
					foundFichePoste[0].dataValues.endDate
						.toISOString()
						.split('T')[0];
			}
			currentFichePoste = foundFichePoste;
		});
		params = {
			...params,
			active: {
				candidatureRead: true,
			},
			candidature: foundCandidature[0].dataValues,
			managerNote: foundCandidature[0].dataValues.managerComment,
			rhNote: foundCandidature[0].dataValues.rhComment,
			fichePosteLink: '/ficheposte/read/' + fichePosteId,
			fichePoste: currentFichePoste[0].dataValues,
			displayValidationButtons: false,
			displayQuestions: true,
			isLoggedIn: isLoggedIn,
			imageUrl: '/servedFiles/CV/' + foundCandidature[0].dataValues.cv,
			saveNoteLink:
				'/candidature/savenote/' + foundCandidature[0].dataValues.id,
		};
		console.log('PARAMS ======================');
		console.log(params);
		res.render('candidatureRead', params);
	});
};

exports.getListPage = async (req, res, next) => {
	const candidatureId = parseInt(req.params.candidatureId, 10);
	let params = {};
	let result = [];
	let userParams;
	let userRole = "";

	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return;
	}

	const groups = await azureService.getMainGroups(
		req.app.locals.msalClient,
		req.session.userId
	);

	if (groups.includes('RH')) {
		userRole = 'rh';
		params.rh = true;
	} else if (groups.includes('FINANCE')) {
		userRole = 'finance';
		userParams = {
			where: { validationRh: 1, validationManager: 1 },
		}
	} else if (groups.includes('MANAGER')) {
		userParams = {
			where: { validationRh: 1 },
		}
		params.manager = true;
		userRole = 'manager';
	} else {
		res.redirect('/');
	}

	Candidature.findAll(userParams).then((foundCandidatures) => {
		if (typeof foundCandidatures == 'undefined') {
			res.redirect('/dashboard');
			return;
		}

		foundCandidatures = foundCandidatures.forEach((candidature, index) => {
			let offset_1 = candidature.dataValues.createdAt.getTimezoneOffset();
			candidature.dataValues.createdAt = new Date(
				candidature.dataValues.createdAt.getTime() -
					offset_1 * 60 * 1000
			);
			candidature.dataValues.createdAt = candidature.dataValues.createdAt
				.toISOString()
				.split('T')[0];

			result.push(candidature.dataValues);

			if (index % 2 == 0) {
				result[index].even = true;
			}

			result[index].readLink =
				'/candidature/read/' + candidature.dataValues.id;
			FichePoste.findAll({
				where: { id: candidature.dataValues.fichePosteId },
			}).then((foundFichePoste) => {
				result[index].fichePoste = foundFichePoste[0].dataValues;
			});
		});

		params.active = { candidatureList: true };
		params.candidatureList = result;
		params.group = userRole;

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

exports.rhValid = async (req, res, next) => {
	console.log('==================================');
	console.log('==================================');
	console.log('==================================');
	console.log('==================================');
	console.log('==================================');

	const candidatureId = parseInt(req.params.candidatureId, 10);
	const updatedRows = await Candidature.update(
		{
			validationRh: 1,
		},
		{
			where: { id: candidatureId },
		}
	);
	res.redirect('/candidature/read/' + candidatureId);
};

exports.rhRefuse = async (req, res, next) => {
	const candidatureId = parseInt(req.params.candidatureId, 10);
	const updatedRows = await Candidature.update(
		{
			validationRh: 2,
		},
		{
			where: { id: candidatureId },
		}
	);
	res.redirect('/candidature/read/' + candidatureId);
};

exports.managerValid = async (req, res, next) => {
	const candidatureId = parseInt(req.params.candidatureId, 10);
	const updatedRows = await Candidature.update(
		{
			validationManager: 1,
		},
		{
			where: { id: candidatureId },
		}
	);
	res.redirect('/candidature/read/' + candidatureId);
};

exports.managerRefuse = async (req, res, next) => {
	const candidatureId = parseInt(req.params.candidatureId, 10);
	const updatedRows = await Candidature.update(
		{
			validationManager: 2,
		},
		{
			where: { id: candidatureId },
		}
	);
	res.redirect('/candidature/read/' + candidatureId);
};

exports.saveNote = async (req, res, next) => {
	const candidatureId = parseInt(req.params.candidatureId, 10);
	const newNote = req.body['text-area'];

	console.log("=================================");
	console.log("=================================");
	console.log("=================================");
	console.log("=================================");
	console.log("=================================");
	console.log(newNote);

	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return;
	}

	const groups = await azureService.getMainGroups(
		req.app.locals.msalClient,
		req.session.userId
	);

	if (groups.includes('RH')) {
		await Candidature.update(
			{
				rhComment: newNote
			},
			{ where: { id: candidatureId } }
		)
		res.redirect(`/candidature/read/${candidatureId}/?notes=true&tab=rh`)
	} else if (groups.includes('MANAGER')) {
		await Candidature.update(
			{
				managerComment: newNote
			},
			{ where: { id: candidatureId } }
		)
		res.redirect(`/candidature/read/${candidatureId}/?notes=true&tab=manager`)
	} else {
		res.redirect('/');
	}
};
