const { User } = require('@models')
const graph = require('@utils/azureService/graph')
const router = require('express-promise-router')()
const jwt = require('jsonwebtoken')

/* GET auth callback. */
router.get('/signin', async function (req, res) {
	const urlParameters = {
		scopes: process.env.OAUTH_SCOPES.split(','),
		redirectUri: process.env.OAUTH_REDIRECT_URI,
	}

	try {
		const authUrl = await req.app.locals.msalClient.getAuthCodeUrl(urlParameters)
		res.redirect(authUrl)
	} catch (error) {
		console.log(`Error: ${error}`)
		req.flash('error_msg', {
			message: 'Error getting auth URL',
			debug: JSON.stringify(error, Object.getOwnPropertyNames(error)),
		})
		res.redirect('/')
	}
})

router.get('/callback', async function (req, res) {
	const tokenRequest = {
		code: req.query.code,
		scopes: process.env.OAUTH_SCOPES.split(','),
		redirectUri: process.env.OAUTH_REDIRECT_URI,
	}

	try {
		const response = await req.app.locals.msalClient.acquireTokenByCode(tokenRequest)
		let userId = response.account.homeAccountId

		// Save the user's homeAccountId in their session
		req.session.userId = userId

		const userDetails = await graph.getUserDetails(req.app.locals.msalClient, userId)

		const userGroups = await graph.getMainGroups(req.app.locals.msalClient, userId)

		User.findAll({
			where: { userId: userId },
		})
			.then((foundUser) => {
				if (foundUser && foundUser.length > 0) {
					;({ userId } = foundUser)
				} else {
					throw TypeError()
				}
			})
			.catch((error) => {
				const user = {
					userId: userId,
					displayName: userDetails.displayName,
					email: userDetails.mail || userDetails.userPrincipalName,
					rh: userGroups.includes('RH'),
					manager: userGroups.includes('MANAGER'),
					finance: userGroups.includes('FINANCE'),
					it: userGroups.includes('IT'),
				}

				User.create(user).then((data) => {
					;({ userId } = data)
				})
			})

		res.cookie(
			'authToken',
			jwt.sign(
				{
					userId: userId,
					rh: userGroups.includes('RH'),
					manager: userGroups.includes('MANAGER'),
					finance: userGroups.includes('FINANCE'),
					it: userGroups.includes('IT'),
				},
				'RANDOM_TOKEN_SECRET',
				{ expiresIn: '24h' },
			),
		)

		// Add the user to user storage
		req.app.locals.users[req.session.userId] = {
			displayName: userDetails.displayName,
			email: userDetails.mail || userDetails.userPrincipalName,
			timeZone: userDetails.mailboxSettings.timeZone,
		}
	} catch (error) {
		req.flash('error_msg', {
			message: 'Error completing authentication',
			debug: JSON.stringify(error, Object.getOwnPropertyNames(error)),
		})
	}

	res.redirect('/')
})

router.get('/signout', async function (req, res) {
	// Sign out
	if (req.session.userId) {
		// Look up the user's account in the cache
		const accounts = await req.app.locals.msalClient.getTokenCache().getAllAccounts()

		const userAccount = accounts.find((a) => a.homeAccountId === req.session.userId)

		// Remove the account
		if (userAccount) {
			req.app.locals.msalClient.getTokenCache().removeAccount(userAccount)
		}
	}
	res.clearCookie('authToken')
	// Destroy the user's session
	req.session.destroy(function (err) {
		res.redirect('/')
	})
})

module.exports = router
