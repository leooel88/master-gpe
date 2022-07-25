const db = require('../database/models');
const Op = db.Sequelize.Op;
const FichePoste = db.FichePoste;
const errorHandler = require('../helper/errorHandler');
const loggerHandler = require('../helper/loggerHandler');
const azureService = require('../azureService/graph')

exports.getReadPage = async (req, res, next) => {
	if (loggerHandler.checkLoggedIn(req, res) === false) {
		return;
	}

	const fichePosteId = parseInt(req.params.fichePosteId, 10);

	let params = {};
	const groups = await azureService.getMainGroups(
        req.app.locals.msalClient,
        req.session.userId
    );
	if (groups.includes('RH')) {
		params.rh=true;
		params.rhValidLink="/ficheposte/rhvalid/" + fichePosteId;
		params.rhRefuseLink="/ficheposte/rhrefuse/" + fichePosteId;
	}
	else if(groups.includes('FINANCE')){
		params.finance=true;
		params.financeValidLink="/ficheposte/financevalid/" + fichePosteId;
		params.financeRefuseLink="/ficheposte/financerefuse/" + fichePosteId;
	};

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
			if (foundFichePoste[0].dataValues.validationRH == null) {
				params.validationRhIsNull = true;
			}
			else if (foundFichePoste[0].dataValues.validationRH == true) {
				params.validationRhIsTrue = true;
			}
			else if (foundFichePoste[0].dataValues.validationRH == false) {
				params.validationRhIsFalse = true;
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

exports.getListPage = (req, res, next) => {
	if (loggerHandler.checkLoggedIn(req, res) === false) {
		return;
	}

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
		where: { publicationRH: true }
	})
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
exports.getCreatePage = (req, res, next) => {
	if (loggerHandler.checkLoggedIn(req, res) === false) {
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
	res.render('fichePoste', params);
};


exports.createTestFicheposte = (req, res, next) => {
	if (loggerHandler.checkLoggedIn(req, res) === false) {
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
};

function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

exports.create = (req, res) => {
	if (loggerHandler.checkLoggedIn(req, res) === false) {
		return;
	}

	// Validate request
	if (
		!req.body.fichePoste_label ||
		!req.body.fichePoste_type ||
		!req.body.fichePoste_jobDescription ||
		!req.body.fichePoste_urgency
	) {
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
};

exports.getUpdatePage = () => {
	res.end();
};

exports.update = () => {
	res.end();
};

exports.delete = () => {
	res.end();
};

exports.rhValid = async (req, res, next) => {
	const fichePosteId = parseInt(req.params.fichePosteId, 10);
	const updatedRows = await FichePoste.update(
		{
			validationRH: true
		},
		{
			where: { id: fichePosteId },
		}
	  );
	  res.redirect ("/fichePoste/read/" + fichePosteId)
};

exports.rhRefuse = async (req, res, next) => {
	const fichePosteId = parseInt(req.params.fichePosteId, 10);
	const updatedRows = await FichePoste.update(
		{
			validationRH: false
		},
		{
			where: { id: fichePosteId },
		}
	  );
	  res.redirect ("/fichePoste/read/" + fichePosteId)
};

exports.financeValid = async (req, res, next) => {
	const fichePosteId = parseInt(req.params.fichePosteId, 10);
	const updatedRows = await FichePoste.update(
		{
			validationFinance: true
		},
		{
			where: { id: fichePosteId },
		}
	  );
	  res.redirect ("/fichePoste/read/" + fichePosteId)

};

exports.financeRefuse = async (req, res, next) => {
	const fichePosteId = parseInt(req.params.fichePosteId, 10);
	const updatedRows = await FichePoste.update(
		{
			validationFinance: false
		},
		{
			where: { id: fichePosteId },
		}
	  );
	  res.redirect ("/fichePoste/read/" + fichePosteId)
};

function isEmptyOrSpaces(str) {
	return !str || str === null || str.match(/^ *$/) !== null;
}
