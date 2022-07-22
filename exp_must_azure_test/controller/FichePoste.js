const db = require('../database/models');
const Op = db.Sequelize.Op;
const FichePoste = db.FichePoste;
const errorHandler = require('../helper/errorHandler');

exports.getPage = (req, res, next) => {
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

exports.create = (req, res) => {
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
			errorHandler.catchDataCreationError(err.errors, res, 'fichePoste');
			// res.status(500).send({
			// 	message:
			// 		err.message ||
			// 		'Some error occurred while creating the Tutorial.',
			// });
			return;
		});
};

function isEmptyOrSpaces(str) {
	return !str || str === null || str.match(/^ *$/) !== null;
}
