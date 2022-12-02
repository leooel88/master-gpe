const { User } = require('@models')
const jwt = require('jsonwebtoken')

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
