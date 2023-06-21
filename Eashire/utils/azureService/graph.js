const graph = require('@microsoft/microsoft-graph-client')

require('isomorphic-fetch')
// process;

function getAzureConfig() {
	if (process.env.NODE_ENV === 'development') {
		return require('./azure.config.json').development
	}
	if (process.env.NODE_ENV === 'production') {
		return require('./azure.config.json').production
	}
	if (process.env.NODE_ENV === 'test') {
		return require('./azure.config.json').test
	}
}

module.exports = {
	getAzureConfig: function () {
		return getAzureConfig()
	},
	getPhotoByUpn: async function (msalClient, userId, Upn) {
		const client = getAuthenticatedClient(msalClient, userId)
		return await client.api(`/users/${Upn}/photo/$value`).get()
	},
	getUserDetails: async function (msalClient, userId, searchedUser) {
		const client = getAuthenticatedClient(msalClient, userId)
		let user
		const url = `/users/${searchedUser}`

		if (searchedUser && searchedUser != '') {
			user = await client
				.api(url)
				.select('displayName,mail,userPrincipalName,jobTitle,department')
				.get()
		} else {
			user = await client
				.api('/me')
				.select(
					'displayName,mail,mailboxSettings,userPrincipalName,jobTitle,createdDateTime,employeeHireDate,department',
				)
				.get()
		}
		return user
	},
	getUsers: async function (msalClient, userId, filters) {
		const client = getAuthenticatedClient(msalClient, userId)

		const allusers = await client.api('/users').get()
		return allusers
	},
	getManager: async function (msalClient, userId) {
		const client = getAuthenticatedClient(msalClient, userId)

		const manager = await client
			.api('/me/manager')
			.select('displayName,mail,businessPhones,jobTitle')
			.get()

		return manager
	},
	getDirectReports: async function (msalClient, userId) {
		const client = getAuthenticatedClient(msalClient, userId)
		const directReports = await client
			.api('/me/directReports')
			.select('displayName,mail,businessPhones,jobTitle')
			.get()

		return directReports
	},
	getCoworker: async function (msalClient, userId) {
		const client = getAuthenticatedClient(msalClient, userId)

		const managerId = await client.api('/me/manager').select('id').get()

		const coworker = await client
			.api(`/users/${managerId.id}/directReports`)
			.select('displayName,mail,businessPhones,jobTitle')
			.get()

		return coworker
	},

	getGroups: async function (msalClient, userId, filters) {
		const client = getAuthenticatedClient(msalClient, userId)

		const allGroups = await client.api('/me/memberOf').get()
		return allGroups
	},
	getGroupsNames: async function (msalClient, userId) {
		const allGroups = await this.getGroups(msalClient, userId)

		const result = allGroups.value.map(function (group) {
			return group.displayName
		})
		return result
	},
	getMainGroups: async function (msalClient, userId) {
		const azureConfig = getAzureConfig()

		const allGroups = await this.getGroups(msalClient, userId)

		const result = allGroups.value.map(function (group) {
			if (group.displayName == azureConfig.RH_GROUP_NAME) {
				return 'RH'
			}
			if (group.displayName == azureConfig.MANAGER_GROUP_NAME) {
				return 'MANAGER'
			}
			if (group.displayName == azureConfig.FINANCE_GROUP_NAME) {
				return 'FINANCE'
			}
			if (group.displayName == azureConfig.IT_GROUP_NAME) {
				return 'IT'
			}
			return []
		})
		return result
	},
	isRh: async function (msalClient, userId) {
		const azureConfig = getAzureConfig()

		const allGroups = await this.getGroups(msalClient, userId)

		return allGroups.value.some(function (group) {
			return group.displayName == azureConfig.RH_GROUP_NAME
		})
	},
	isFinance: async function (msalClient, userId) {
		const azureConfig = getAzureConfig()

		const allGroups = await this.getGroups(msalClient, userId)

		return allGroups.value.some(function (group) {
			return group.displayName == azureConfig.FINANCE_GROUP_NAME
		})
	},
	isManager: async function (msalClient, userId) {
		const azureConfig = getAzureConfig()

		const allGroups = await this.getGroups(msalClient, userId)

		return allGroups.value.some(function (group) {
			return group.displayName == azureConfig.MANAGER_GROUP_NAME
		})
	},
	isIt: async function (msalClient, userId) {
		const azureConfig = getAzureConfig()

		const allGroups = await this.getGroups(msalClient, userId)

		return allGroups.value.some(function (group) {
			return group.displayName == azureConfig.IT_GROUP_NAME
		})
	},
	getCalendarView: async function (msalClient, userId, start, end, timeZone, nbrEvent) {
		const client = getAuthenticatedClient(msalClient, userId)
		const events = await client
			.api('/me/calendarview')
			// Add Prefer header to get back times in user's timezone
			.header('Prefer', `outlook.timezone="${timeZone}"`)
			// Add the begin and end of the calendar window
			.query({ startDateTime: start, endDateTime: end })
			// Get just the properties used by the app
			.select('subject,organizer,start,end')
			// Order by start time
			.orderby('start/dateTime')
			// Get at most 50 results
			.top(nbrEvent)
			.get()

		return events
	},
	createUser: async function (msalClient, userId, userInfo) {
		const client = getAuthenticatedClient(msalClient, userId)
		const user = await client.api('/users').post(userInfo)
		return user
	},
}

function getAuthenticatedClient(msalClient, userId) {
	if (!msalClient || !userId) {
		throw new Error(
			`Invalid MSAL state. Client: ${msalClient ? 'present' : 'missing'}, User ID: ${
				userId ? 'present' : 'missing'
			}`,
		)
	}

	// Initialize Graph client
	const client = graph.Client.init({
		// Implement an auth provider that gets a token
		// from the app's MSAL instance
		authProvider: async (done) => {
			try {
				// Get the user's account
				const account = await msalClient.getTokenCache().getAccountByHomeId(userId)

				if (account) {
					// Attempt to get the token silently
					// This method uses the token cache and
					// refreshes expired tokens as needed
					const response = await msalClient.acquireTokenSilent({
						scopes: process.env.OAUTH_SCOPES.split(','),
						redirectUri: process.env.OAUTH_REDIRECT_URI,
						account: account,
					})

					// First param to callback is the error,
					// Set to null in success case
					done(null, response.accessToken)
				}
			} catch (err) {
				console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)))
				done(err, null)
			}
		},
	})

	return client
}
