const { User } = require('@models')
const auth = require('@utils/authentication')

exports.process = async (req, res, next) => {
	const { userId } = auth.getTokenInfo(req)
	const params = {
		active: { workspace: true },
	}

	User.findAll({
		where: { userId: userId },
	})
		.then((foundUser) => {
			if (foundUser && foundUser.length > 0 && foundUser[0]) {
				if (foundUser[0].rh === true) {
					params.rh = true
				}
				if (foundUser[0].manager === true) {
					params.manager = true
				}
				if (foundUser[0].finance === true) {
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
