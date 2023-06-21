const { User } = require('@models')
const jwt = require('jsonwebtoken')

/**
 * return an object with :
 * { userId: number, rh: boolean, manager: boolean, finance: boolean, it: boolean }
 */
exports.getTokenInfo = (req) => {
	try {
		const token = req.cookies.authToken
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
		return decodedToken
	} catch (error) {
		return {}
	}
}

exports.authenticated = (req, res, next) => {
	try {
		const token = req.cookies.authToken
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
		const { userId } = decodedToken

		next()
	} catch (error) {
		res.redirect('/auth/signin')
	}
}

exports.authenticatedGroups = (auth) => {
	return (req, res, next) => {
		try {
			const token = req.cookies.authToken
			const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
			const { userId } = decodedToken

			User.findAll({
				where: { userId: userId },
			})
				.then((foundUser) => {
					if (foundUser && foundUser.length > 0 && foundUser[0]) {
						for (const curr_auth of auth) {
							if (curr_auth == 'MANAGER' && foundUser[0].manager === true) {
								next()
								return
							}
							if (curr_auth == 'RH' && foundUser[0].rh === true) {
								next()
								return
							}
							if (curr_auth == 'FINANCE' && foundUser[0].finance === true) {
								next()
								return
							}
							if (curr_auth == 'IT' && foundUser[0].it === true) {
								next()
								return
							}
						}
						res.redirect('/auth/signin')
					} else {
						res.redirect('/auth/signin')
					}
				})
				.catch((error) => {
					res.redirect('/auth/signin')
				})
		} catch (error) {
			res.redirect('/auth/signin')
		}
	}
}

exports.isAuthenticated = (req) => {
	try {
		const token = req.cookies.authToken
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
		const { userId } = decodedToken
		if (userId && userId != '') {
			return true
		}
		return false
	} catch (err) {
		return false
	}
}

exports.authenticatedManager = (req, res, next) => {
	try {
		const token = req.cookies.authToken
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
		const { userId } = decodedToken

		User.findAll({
			where: { userId: userId },
		})
			.then((foundUser) => {
				if (foundUser && foundUser.length > 0 && foundUser[0] && foundUser[0].manager === true) {
					next()
				} else {
					res.redirect('/auth/signin')
				}
			})
			.catch((error) => {
				res.redirect('/auth/signin')
			})
	} catch (error) {
		res.redirect('/auth/signin')
	}
}

exports.authenticatedRh = (req, res, next) => {
	try {
		const token = req.cookies.authToken
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
		const { userId } = decodedToken
		User.findAll({
			where: { userId: userId },
		})
			.then((foundUser) => {
				if (foundUser && foundUser.length > 0 && foundUser[0] && foundUser[0].rh === true) {
					next()
				} else {
					res.redirect('/auth/signin')
				}
			})
			.catch((error) => {
				res.redirect('/auth/signin')
			})
	} catch (error) {
		res.redirect('/auth/signin')
	}
}

exports.authenticatedIt = (req, res, next) => {
	try {
		const token = req.cookies.authToken
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
		const { userId } = decodedToken
		User.findAll({
			where: { userId: userId },
		})
			.then((foundUser) => {
				if (foundUser && foundUser.length > 0 && foundUser[0] && foundUser[0].it === true) {
					next()
				} else {
					res.redirect('/auth/signin')
				}
			})
			.catch((error) => {
				res.redirect('/auth/signin')
			})
	} catch (error) {
		res.redirect('/auth/signin')
	}
}

exports.authenticatedFinance = (req, res, next) => {
	try {
		const token = req.cookies.authToken
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
		const { userId } = decodedToken

		User.findAll({
			where: { userId: userId },
		})
			.then((foundUser) => {
				if (foundUser && foundUser.length > 0 && foundUser[0] && foundUser[0].finance === true) {
					next()
				} else {
					res.redirect('/auth/signin')
				}
			})
			.catch((error) => {
				res.redirect('/auth/signin')
			})
	} catch (error) {
		res.redirect('/auth/signin')
	}
}

exports.authenticatedManagerRh = (req, res, next) => {
	try {
		const token = req.cookies.authToken
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
		const { userId } = decodedToken

		User.findAll({
			where: { userId: userId },
		})
			.then((foundUser) => {
				if (foundUser && foundUser.length > 0 && foundUser[0]) {
					if (foundUser[0].rh === true || foundUser[0].manager === true) {
						next()
					} else {
						res.redirect('/auth/signin')
					}
				} else {
					res.redirect('/auth/signin')
				}
			})
			.catch((error) => {
				res.redirect('/auth/signin')
			})
	} catch (error) {
		res.redirect('/auth/signin')
	}
}

exports.authenticatedManagerRhIt = (req, res, next) => {
	try {
		const token = req.cookies.authToken
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
		const { userId } = decodedToken

		User.findAll({
			where: { userId: userId },
		})
			.then((foundUser) => {
				if (foundUser && foundUser.length > 0 && foundUser[0]) {
					if (
						foundUser[0].rh === true ||
						foundUser[0].manager === true ||
						foundUser[0].it === true
					) {
						next()
					} else {
						res.redirect('/auth/signin')
					}
				} else {
					res.redirect('/auth/signin')
				}
			})
			.catch((error) => {
				res.redirect('/auth/signin')
			})
	} catch (error) {
		res.redirect('/auth/signin')
	}
}

exports.authenticatedManagerRhFinance = (req, res, next) => {
	try {
		const token = req.cookies.authToken
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
		const { userId } = decodedToken

		User.findAll({
			where: { userId: userId },
		})
			.then((foundUser) => {
				if (foundUser && foundUser.length > 0 && foundUser[0]) {
					if (
						foundUser[0].rh === true ||
						foundUser[0].manager === true ||
						foundUser[0].finance === true
					) {
						next()
					} else {
						res.redirect('/auth/signin')
					}
				} else {
					res.redirect('/auth/signin')
				}
			})
			.catch((error) => {
				res.redirect('/auth/signin')
			})
	} catch (error) {
		res.redirect('/auth/signin')
	}
}
