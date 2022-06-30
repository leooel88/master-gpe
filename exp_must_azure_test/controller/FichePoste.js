const db = require('../database/models');
const Op = db.Sequelize.Op;
const FichePoste = db.FichePoste;

exports.create = (req, res) => {
	// Validate request
	if (!req.body.fichePoste_label || !req.body.fichePoste_type) {
		res.status(400).send({
			message: 'Content can not be empty!',
		});
		return;
	}
	// Create a Tutorial
	const fichePoste = {
		label: req.body.fichePoste_label,
		type: req.body.fichePoste_type,
	};
	// Save Tutorial in the database
	FichePoste.create(fichePoste)
		.then((data) => {
			console.log(data);
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message ||
					'Some error occurred while creating the Tutorial.',
			});
		});
};
