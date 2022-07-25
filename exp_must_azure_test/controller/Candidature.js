const db = require('../database/models');
const Op = db.Sequelize.Op;
const FichePoste = db.FichePoste;
const Candidature = db.Candidature;
const errorHandler = require('../helper/errorHandler');
const loggerHandler = require('../helper/loggerHandler');

exports.getReadPage = (req, res, next) => {
	if (loggerHandler.checkLoggedIn(req, res) === false) {
		return;
	}

	const fichePosteId = parseInt(req.params.fichePosteId, 10);

	let params = {};

	FichePoste.findAll({
		where: {
			id: fichePosteId,
		},
	})
		.then((foundFichePoste) => {
			console.log('HEY');
			console.log(typeof foundFichePoste[0].dataValues.entryDate);

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

			params = {
				active: { fichePosteRead: true },
				fichePoste: foundFichePoste[0].dataValues,
			};
			res.render('candidature', params);
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

exports.create = (req, res) => {
	console.log("in create candidature");
	console.log(req.body.candidature_nom)
	console.log(req.body.candidature_prenom)
	console.log(req.body.candidature_telephone)
	console.log(req.body.ficheposteid)
	if (loggerHandler.checkLoggedIn(req, res) === false) {
		return;
	}

	// Validate request
	if (
		!req.body.candidature_nom ||
		!req.body.candidature_prenom ||
		!req.body.candidature_telephone ||
		!req.body.ficheposteid
	) {
		errorHandler.sendInvalidBodyError(res, 'Candidature');
		return;
	}
	// Create a Tutorial
	const candidature = {
		nom : req.body.candidature_nom,
		prenom : req.body.candidature_prenom,
		telephone : req.body.candidature_telephone,
		fichePosteId : req.body.ficheposteid,
	};
	// Save Tutorial in the database
	candidature.cv = req.file.originalname;
	Candidature.create(candidature)
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
				'candidature/create'
			);
		});
};