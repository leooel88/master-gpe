const db = require('../../../database/models');
const Op = db.Sequelize.Op;
const FichePoste = db.FichePoste;
const Candidature = db.Candidature;
const errorHandler = require('../../../helper/errorHandler');
const loggerHandler = require('../../../helper/loggerHandler');
const azureService = require('../../../azureService/graph');

exports.getReadPage = async (req, res, next) => {
	const isLoggedIn = loggerHandler.checkLoggedIn(req);

	let { error } = req.query;

	const fichePosteId = parseInt(req.params.fichePosteId, 10);

	let params = {};

	if (error != null && error.length > 0) {
		params.error = [{ message: error }];
	}

	if (isLoggedIn === true) {
		const groups = await azureService.getMainGroups(
			req.app.locals.msalClient,
			req.session.userId
		);
		console.log(groups);
		if (groups.includes('RH')) {
			params.rh = true;
			params.rhValidLink = '/ficheposte/rhvalid/' + fichePosteId;
			params.rhRefuseLink = '/ficheposte/rhrefuse/' + fichePosteId;
			params.rhPublishLink = '/ficheposte/rhpublish/' + fichePosteId;
		} else if (groups.includes('FINANCE')) {
			params.finance = true;
			params.financeValidLink =
				'/ficheposte/financevalid/' + fichePosteId;
			params.financeRefuseLink =
				'/ficheposte/financerefuse/' + fichePosteId;
		} else if (groups.includes('MANAGER')) {
			params.manager = true;
			params.managerUpdateLink = '/ficheposte/update/' + fichePosteId;
		}
	}

	FichePoste.findAll({
		where: {
			id: fichePosteId,
		},
	})
		.then((foundFichePoste) => {
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
			if (isLoggedIn === true) {
				params.isLoggedIn = true;
				if (foundFichePoste[0].dataValues.validationRH == 0) {
					params.validationRhIsNull = true;
				} else if (foundFichePoste[0].dataValues.validationRH == 1) {
					params.validationRhIsTrue = true;
				} else if (foundFichePoste[0].dataValues.validationRH == 2) {
					params.validationRhIsFalse = true;
				}

				params.updateLink =
					'/ficheposte/update/' + foundFichePoste[0].dataValues.id;
				params.displayValidationButtons = true;
				params.displayQuestions = true;
			} else {
				params.displayValidationButtons = false;
				params.displayQuestions = false;
				params.isLoggedIn = false;
				params.candidateLink =
					'/candidature/create/' + foundFichePoste[0].dataValues.id;
			}

			params.active = { fichePosteRead: true };
			params.fichePoste = foundFichePoste[0].dataValues;

			res.render('fichePosteRead', params);
		})
		.catch((err) => {
			console.log('ERROR : ');
			console.log(err);
			errorHandler.catchDataCreationError(
				err.errors,
				res,
				'fichePosteList'
			);

			return;
		});
};

exports.getListPage = async (req, res, next) => {
	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return;
	}
	let group = "";
	const groups = await azureService.getMainGroups(
		req.app.locals.msalClient,
		req.session.userId
	);

	if (groups.includes('RH')) {
		group = "rh"
	}
	if (groups.includes('MANAGER')) {
		group = "manager"
	}
	if (groups.includes('FINANCE')) {
		group = "finance"
	}
	console.log(group);
	let result = [];

	FichePoste.findAll()
		.then((foundFichePosteList) => {
			foundFichePosteList = foundFichePosteList.forEach(
				(fichePoste, index) => {
					result.push(fichePoste.dataValues);
					if (index % 2 == 0) {
						result[index].even = true;
					}
					result[index].readLink =
						'/ficheposte/read/' + fichePoste.dataValues.id;

					if (result[index].entryDate) {
						let offset_1 =
							result[index].entryDate.getTimezoneOffset();
						result[index].entryDate = new Date(
							result[index].entryDate.getTime() -
								offset_1 * 60 * 1000
						);
						result[index].entryDate = result[index].entryDate
							.toISOString()
							.split('T')[0];
					}

					if (result[index].endDate) {
						let offset_2 =
							result[index].endDate.getTimezoneOffset();
						result[index].endDate = new Date(
							result[index].endDate.getTime() -
								offset_2 * 60 * 1000
						);
						result[index].endDate = result[index].endDate
							.toISOString()
							.split('T')[0];
					}
				}
			);

			let params = {
				active: { fichePosteList: true },
				fichePosteList: result,
				displayValidationIcons: true,
				group: group,
			};

			console.log('==================================');
			console.log('==================================');
			console.log(params);
			console.log('==================================');
			console.log('==================================');

			res.render('fichePosteList', params);
		})
		.catch((err) => {
			console.log('ERROR : ');
			console.log(err);
			errorHandler.catchDataCreationError(err.errors, res, '');

			return;
		});
};

exports.getKanbanPage = async(req, res, next) => {
	if (loggerHandler.checkLoggedIn(req, res) === false) {
		return;
	}
	let group = "";
	const groups = await azureService.getMainGroups(
		req.app.locals.msalClient,
		req.session.userId
	);

	if (groups.includes('RH')) {
		group = "rh"
	}
	if (groups.includes('MANAGER')) {
		group = "manager"
	}
	if (groups.includes('FINANCE')) {
		group = "finance"
	}
	console.log(group);
	let result = [];

	FichePoste.findAll()
		.then((foundFichePosteList) => {
			foundFichePosteList = foundFichePosteList.forEach(
				(fichePoste, index) => {
					result.push(fichePoste.dataValues);
					let idFichePoste = fichePoste.dataValues.id;
					Candidature.count({
						where: {
							fichePosteId: idFichePoste
						}
					})
						.then(function (foundCandidatureList){
							result[index].nbCandidature = foundCandidatureList;
						});

					if (result[index].createdAt) {
						let offset_2 =
							result[index].createdAt.getTimezoneOffset();
						result[index].createdAt = new Date(
							result[index].createdAt.getTime() -
							offset_2 * 60 * 1000
						);
						result[index].createdAt = result[index].createdAt
							.toISOString()
							.split('T')[0];
						console.log("!!!!!",result[index].createdAt);
					}

					if (index % 2 == 0) {
						result[index].even = true;
					}
					result[index].readLink =
						'/ficheposte/read/' + fichePoste.dataValues.id;

					if (result[index].entryDate) {
						let offset_1 =
							result[index].entryDate.getTimezoneOffset();
						result[index].entryDate = new Date(
							result[index].entryDate.getTime() -
								offset_1 * 60 * 1000
						);
						result[index].entryDate = result[index].entryDate
							.toISOString()
							.split('T')[0];
					}

					if (result[index].endDate) {
						let offset_2 =
							result[index].endDate.getTimezoneOffset();
						result[index].endDate = new Date(
							result[index].endDate.getTime() -
								offset_2 * 60 * 1000
						);
						result[index].endDate = result[index].endDate
							.toISOString()
							.split('T')[0];
					}
				}
			);

			let params = {
				active: { fichePosteList: true },
				fichePosteList: result,
				displayValidationIcons: true,
				group: group,
				fichePosteListNotNull: result.length > 0 ? 1 : 0
			};
			res.render('fichePosteList', params);
		})
		.catch((err) => {
			console.log('ERROR : ');
			console.log(err);
			errorHandler.catchDataCreationError(err.errors, res, '');

			return;
		});
};

exports.getPublish = (req, res, next) => {
	let result = [];

	FichePoste.findAll({
		where: {
			publicationRH: 1,
		}
	}).then((foundFichePosteList) => {
			foundFichePosteList = foundFichePosteList.forEach(
				(fichePoste, index) => {
					result.push(fichePoste.dataValues);
					if (result[index].createdAt) {
						let offset_2 =
							result[index].createdAt.getTimezoneOffset();
						result[index].createdAt = new Date(
							result[index].createdAt.getTime() -
							offset_2 * 60 * 1000
						);
						result[index].createdAt = result[index].createdAt
							.toISOString()
							.split('T')[0];
						console.log("!!!!!",result[index].createdAt);
					}

					if (index % 2 == 0) {
						result[index].even = true;
					}
					result[index].readLink =
						'/ficheposte/read/' + fichePoste.dataValues.id;

					if (result[index].entryDate) {
						let offset_1 =
							result[index].entryDate.getTimezoneOffset();
						result[index].entryDate = new Date(
							result[index].entryDate.getTime() -
								offset_1 * 60 * 1000
						);
						result[index].entryDate = result[index].entryDate
							.toISOString()
							.split('T')[0];
					}

					if (result[index].endDate) {
						let offset_2 =
							result[index].endDate.getTimezoneOffset();
						result[index].endDate = new Date(
							result[index].endDate.getTime() -
								offset_2 * 60 * 1000
						);
						result[index].endDate = result[index].endDate
							.toISOString()
							.split('T')[0];
					}
				}
			);

			let params = {
				active: { fichePosteList: true },
				fichePosteList: result,
				displayValidationIcons: false,
				fichePosteListNotNull: result.length > 0 ? 1 : 0
			};
			res.render('fichePosteList', params);
		})
		.catch((err) => {
			console.log('ERROR : ');
			console.log(err);
			errorHandler.catchDataCreationError(err.errors, res, '');

			return;
		});
}

exports.getCreatePage = (req, res, next) => {
	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return;
	}

	let { error } = req.query;

	let params = {
		active: { fichePoste: true },
		currentDate: new Date().toISOString().split('T')[0],
	};
	if (error != null && error.length > 0) {
		params.error = [{ message: error }];
	}
	console.log('==========================');
	console.log(params);
	res.render('fichePoste', params);
};

exports.createTestFicheposte = (req, res, next) => {
	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return;
	}

	const fichePoste = {
		label: 'Architecte',
		type: 'CDD',
		jobDescription:
			"Architecte logiciel pour un projet web utilisant GCP. Il s'agit d'un projet de chatbot interactif, composé de plusieurs fonctionnalités mobiles, et d'un aspect cloud très improtant.",
		urgency: 'URGENT',
		experience:
			"Au moins 3 ans d'architecture web & connaissances GCP. Besoin d'une personne qui sait gérer une petite équipe. Motivé et intéressé par les projets cloud.",
		entryDate: addDays(new Date(), 1).toISOString(),
		localisation: 'Massy',
		destinationService: 'DSI',
		question1: "Combien d'années en tant qu'architecte ?",
		question2: 'Avez vous deja travaillé avec les services GCP ?',
	};

	// Save Tutorial in the database
	FichePoste.create(fichePoste)
		.then((data) => {
			console.log(data);

			const fichePoste = {
				label: 'Chef_d_équipe',
				type: 'CDI',
				jobDescription: "Chef d'une équipe de 6 développeurs",
				urgency: 'NON-URGENT',
				entryDate: addDays(new Date(), 30).toISOString(),
				endDate: addDays(new Date(), 60).toISOString(),
				localisation: 'Massy',
				destinationService: 'DSI',
				compensation: '3000$/mois',
				question1: "Combien d'années en tant chef d'équipe ?",
				question2: 'Avez vous deja travaillé en méthode scrum ?',
			};

			FichePoste.create(fichePoste)
				.then((data) => {
					console.log(data);

					const fichePoste = {
						label: 'Lead dev',
						type: 'ALTERNANCE',
						jobDescription: 'Lead dev pour un projet de chatbot',
						urgency: 'URGENT',
						entryDate: addDays(new Date(), 30).toISOString(),
						endDate: addDays(new Date(), 60).toISOString(),
						localisation: 'Paris',
						destinationService: 'DSI',
						compensation: '5000$/mois',
						question1: "Combien d'années en tant que lead dev ?",
						question2:
							'Avez vous deja travaillé en méthode scrum ?',
						validationRH: 1,
						validationFinance: 1,
						publicationRH: 1,
					};

					FichePoste.create(fichePoste)
						.then((data) => {
							console.log(data);
							res.send(data);
						})
						.catch((err) => {
							console.log('ERROR : ');
							console.log(err);
							errorHandler.catchDataCreationError(
								err.errors,
								res,
								'fichePoste/create'
							);
						});
				})
				.catch((err) => {
					console.log('ERROR : ');
					console.log(err);
					errorHandler.catchDataCreationError(
						err.errors,
						res,
						'fichePoste/create'
					);
				});
		})
		.catch((err) => {
			console.log('ERROR : ');
			console.log(err);
			errorHandler.catchDataCreationError(
				err.errors,
				res,
				'fichePoste/create'
			);
		});
};

function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

exports.create = (req, res) => {
	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return;
	}

	// Validate request
	if (
		isEmptyOrSpaces(req.body.fichePoste_label) ||
		isEmptyOrSpaces(req.body.fichePoste_type) ||
		isEmptyOrSpaces(req.body.fichePoste_jobDescription) ||
		isEmptyOrSpaces(req.body.fichePoste_urgency)
	) {
		console.log('OIAEUOZIEUROZEIURZOEIRU');
		errorHandler.sendInvalidBodyError(res, 'fichePoste');
		return;
	}
	// Create a Tutorial
	const fichePoste = {
		label: req.body.fichePoste_label,
		type: req.body.fichePoste_type,
		jobDescription: req.body.fichePoste_jobDescription,
		urgency: req.body.fichePoste_urgency,
	};

	if (!isEmptyOrSpaces(req.body.fichePoste_experience)) {
		fichePoste.experience = req.body.fichePoste_experience;
	}
	if (req.body.fichePoste_entryDate && req.body.fichePoste_entryDate_use) {
		fichePoste.entryDate = req.body.fichePoste_entryDate;
	}
	if (req.body.fichePoste_endDate && req.body.fichePoste_endDate_use) {
		fichePoste.endDate = req.body.fichePoste_endDate;
	}
	if (!isEmptyOrSpaces(req.body.fichePoste_localisation)) {
		fichePoste.localisation = req.body.fichePoste_localisation;
	}
	if (!isEmptyOrSpaces(req.body.fichePoste_destinationService)) {
		fichePoste.destinationService = req.body.fichePoste_destinationService;
	}
	if (!isEmptyOrSpaces(req.body.fichePoste_compensation)) {
		fichePoste.compensation = req.body.fichePoste_compensation;
	}
	if (!isEmptyOrSpaces(req.body.fichePoste_question1)) {
		fichePoste.question1 = req.body.fichePoste_question1;
	}
	if (!isEmptyOrSpaces(req.body.fichePoste_question2)) {
		fichePoste.question2 = req.body.fichePoste_question2;
	}
	if (!isEmptyOrSpaces(req.body.fichePoste_question3)) {
		fichePoste.question3 = req.body.fichePoste_question3;
	}
	if (!isEmptyOrSpaces(req.body.fichePoste_question4)) {
		fichePoste.question4 = req.body.fichePoste_question4;
	}
	if (!isEmptyOrSpaces(req.body.fichePoste_question5)) {
		fichePoste.question5 = req.body.fichePoste_question5;
	}

	// Save Tutorial in the database
	FichePoste.create(fichePoste)
		.then((data) => {
			console.log(data);
			//res.send(data);
			res.redirect(`/ficheposte/read/${data.id}`);
		})
		.catch((err) => {
			console.log('ERROR : ');
			console.log(err);
			errorHandler.catchDataCreationError(
				err.errors,
				res,
				'fichePoste/create'
			);
		});
};

exports.update = async (req, res) => {
	if (loggerHandler.checkLoggedInRedirectSignInIfNot(req, res) === false) {
		return;
	}

	const fichePosteId = parseInt(req.params.fichePosteId, 10);

	let foundFichePoste = await FichePoste.findAll({
		where: {
			id: fichePosteId,
		},
	});

	foundFichePoste = foundFichePoste[0];

	if (!isEmptyOrSpaces(req.body.input_update_label)) {
		try {
			await FichePoste.update(
				{
					label: req.body.input_update_label,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } }
			);
		} catch (err) {
			errorHandler.catchDataCreationError(
				err,
				res,
				'ficheposte/read/' + fichePosteId
			);
			return;
		}
	} else if (!isEmptyOrSpaces(req.body.input_update_type)) {
		try {
			await FichePoste.update(
				{
					type: req.body.input_update_type,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } }
			);
		} catch (err) {
			errorHandler.catchDataCreationError(
				err,
				res,
				'ficheposte/read/' + fichePosteId
			);
			return;
		}
	} else if (!isEmptyOrSpaces(req.body.input_update_urgency)) {
		try {
			await FichePoste.update(
				{
					urgency: req.body.input_update_urgency,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } }
			);
		} catch (err) {
			errorHandler.catchDataCreationError(
				err,
				res,
				'ficheposte/read/' + fichePosteId
			);
			return;
		}
	} else if (!isEmptyOrSpaces(req.body.input_update_jobDescription)) {
		try {
			await FichePoste.update(
				{
					jobDescription: req.body.input_update_jobDescription,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } }
			);
		} catch (err) {
			errorHandler.catchDataCreationError(
				err,
				res,
				'ficheposte/read/' + fichePosteId
			);
			return;
		}
	} else if (req.body.input_update_localisation) {
		try {
			await FichePoste.update(
				{
					localisation: req.body.input_update_localisation,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } }
			);
		} catch (err) {
			errorHandler.catchDataCreationError(
				err,
				res,
				'ficheposte/read/' + fichePosteId
			);
			return;
		}
	} else if (req.body.input_update_destinationService) {
		try {
			await FichePoste.update(
				{
					destinationService:
						req.body.input_update_destinationService,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } }
			);
		} catch (err) {
			errorHandler.catchDataCreationError(
				err,
				res,
				'ficheposte/read/' + fichePosteId
			);
			return;
		}
	} else if (req.body.input_update_entryDate) {
		try {
			await FichePoste.update(
				{
					entryDate: req.body.input_update_entryDate,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } }
			);
		} catch (err) {
			errorHandler.catchDataCreationError(
				err,
				res,
				'ficheposte/read/' + fichePosteId
			);
			return;
		}
	} else if (req.body.input_update_endDate) {
		try {
			await FichePoste.update(
				{
					endDate: req.body.input_update_endDate,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } }
			);
		} catch (err) {
			errorHandler.catchDataCreationError(
				err,
				res,
				'ficheposte/read/' + fichePosteId
			);
			return;
		}
	} else if (req.body.input_update_experience) {
		try {
			await FichePoste.update(
				{
					experience: req.body.input_update_experience,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } }
			);
		} catch (err) {
			errorHandler.catchDataCreationError(
				err,
				res,
				'ficheposte/read/' + fichePosteId
			);
			return;
		}
	} else if (req.body.input_update_compensation) {
		try {
			await FichePoste.update(
				{
					compensation: req.body.input_update_compensation,
					validationRH: 0,
					validationFinance: 0,
					publicationRH: 0,
				},
				{ where: { id: fichePosteId } }
			);
		} catch (err) {
			errorHandler.catchDataCreationError(
				err,
				res,
				'ficheposte/read/' + fichePosteId
			);
			return;
		}
	}

	res.redirect('/ficheposte/read/' + fichePosteId);
};

exports.delete = () => {
	res.end();
};

exports.rhValid = async (req, res, next) => {
	const fichePosteId = parseInt(req.params.fichePosteId, 10);
	const updatedRows = await FichePoste.update(
		{
			validationRH: 1,
		},
		{
			where: { id: fichePosteId },
		}
	);
	res.redirect('/fichePoste/read/' + fichePosteId);
};

exports.rhRefuse = async (req, res, next) => {
	const fichePosteId = parseInt(req.params.fichePosteId, 10);
	const updatedRows = await FichePoste.update(
		{
			validationRH: 2,
		},
		{
			where: { id: fichePosteId },
		}
	);
	res.redirect('/fichePoste/read/' + fichePosteId);
};

exports.rhPublish = async (req, res, next) => {
	const fichePosteId = parseInt(req.params.fichePosteId, 10);
	const updatedRows = await FichePoste.update(
		{
			publicationRH: 1,
		},
		{
			where: { id: fichePosteId },
		}
	);
	res.redirect('/fichePoste/read/' + fichePosteId);
};

exports.financeValid = async (req, res, next) => {
	const fichePosteId = parseInt(req.params.fichePosteId, 10);
	const updatedRows = await FichePoste.update(
		{
			validationFinance: 1,
		},
		{
			where: { id: fichePosteId },
		}
	);
	res.redirect('/fichePoste/read/' + fichePosteId);
};

exports.financeRefuse = async (req, res, next) => {
	const fichePosteId = parseInt(req.params.fichePosteId, 10);
	const updatedRows = await FichePoste.update(
		{
			validationFinance: 2,
		},
		{
			where: { id: fichePosteId },
		}
	);
	res.redirect('/fichePoste/read/' + fichePosteId);
};

function isEmptyOrSpaces(str) {
	return !str || str === null || str.match(/^ *$/) !== null;
}
