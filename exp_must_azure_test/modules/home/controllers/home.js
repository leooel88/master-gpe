const db = require('../../../database/models');
const Op = db.Sequelize.Op;
const FichePoste = db.FichePoste;

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