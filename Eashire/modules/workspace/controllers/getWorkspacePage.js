const { User, FichePoste } = require('@models')
const auth = require('@utils/authentication')

exports.process = async (req, res, next) => {
	const { userId } = auth.getTokenInfo(req)
	const params = {
		active: { workspace: true },
		userId: userId,
	}

	User.findAll({
		where: { userId: userId },
	})
		.then(async (foundUser) => {
			if (foundUser && foundUser.length > 0 && foundUser[0]) {
				if (foundUser[0].rh === true) {
					params.notifNumber = (await getNumberNewFicheposte('rh')).toString()
					params.rh = true
				}
				if (foundUser[0].manager === true) {
					params.manager = true
				}
				if (foundUser[0].finance === true) {
					params.notifNumber = (await getNumberNewFicheposte('finance')).toString()
					params.finance = true
				}
				if (foundUser[0].it === true) {
					params.it = true
				}
			}
			res.render('workspace', params)
		})
		.catch((err) => {
			res.redirect('/auth/signin')
		})
}

async function getNumberNewFicheposte(string) {
	if (string == 'rh') {
		const nbrNew = await FichePoste.count({
			where: {
				rhId: null,
			},
		})
		return nbrNew
	}
	if (string == 'finance') {
		const nbrNew = await FichePoste.count({
			where: {
				financeId: null,
			},
		})
		return nbrNew
	}
}
