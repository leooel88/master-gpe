var graph = require('@microsoft/microsoft-graph-client');

require('isomorphic-fetch');
// process;

function getAzureConfig() {
	if (process.env.NODE_ENV !== 'development') {
		return require('./azure.config.json').development;
	} else if (process.env.NODE_ENV !== 'production') {
		return require('./azure.config.json').production;
	} else if (process.env.NODE_ENV !== 'test') {
		return require('./azure.config.json').test;
	}
}

module.exports = {
	getUserDetails: async function (msalClient, userId) {
		const client = getAuthenticatedClient(msalClient, userId);

		const user = await client
			.api('/me')
			.select(
				'displayName,mail,mailboxSettings,userPrincipalName,jobTitle,createdDateTime,employeeHireDate'
			)
			.get();
		return user;
	},
	getGroups: async function (msalClient, userId, filters) {
		const client = getAuthenticatedClient(msalClient, userId);

		let allGroups = await client.api('/me/memberOf').get();
		return allGroups;
	},
	getGroupsNames: async function (msalClient, userId) {
		let allGroups = await this.getGroups(msalClient, userId);

		let result = allGroups.value.map(function (group) {
			return group.displayName;
		});
		return result;
	},
	getMainGroups: async function (msalClient, userId) {
		const azureConfig = getAzureConfig();

		let allGroups = await this.getGroups(msalClient, userId);

		let result = allGroups.value.map(function (group) {
			if (group.displayName == azureConfig.RH_GROUP_NAME) {
				return 'RH';
			} else if (group.displayName == azureConfig.MANAGER_GROUP_NAME) {
				return 'MANAGER';
			} else if (group.displayName == azureConfig.FINANCE_GROUP_NAME) {
				return 'FINANCE';
			} else {
				return [];
			}
		});
		return result;
	},
	isRh: async function (msalClient, userId) {
		const azureConfig = getAzureConfig();

		let allGroups = await this.getGroups(msalClient, userId);

		return allGroups.value.some(function (group) {
			return group.displayName == azureConfig.RH_GROUP_NAME;
		});
	},
	isFinance: async function (msalClient, userId) {
		const azureConfig = getAzureConfig();

		let allGroups = await this.getGroups(msalClient, userId);

		return allGroups.value.some(function (group) {
			return group.displayName == azureConfig.FINANCE_GROUP_NAME;
		});
	},
	isManager: async function (msalClient, userId) {
		const azureConfig = getAzureConfig();

		let allGroups = await this.getGroups(msalClient, userId);

		return allGroups.value.some(function (group) {
			return group.displayName == azureConfig.MANAGER_GROUP_NAME;
		});
	},
	getCalendarView: async function (
		msalClient,
		userId,
		start,
		end,
		timeZone,
		nbrEvent
	) {
		const client = getAuthenticatedClient(msalClient, userId);
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
			.get();

		return events;
	},
};

function getAuthenticatedClient(msalClient, userId) {
	if (!msalClient || !userId) {
		throw new Error(
			`Invalid MSAL state. Client: ${
				msalClient ? 'present' : 'missing'
			}, User ID: ${userId ? 'present' : 'missing'}`
		);
	}

	// Initialize Graph client
	const client = graph.Client.init({
		// Implement an auth provider that gets a token
		// from the app's MSAL instance
		authProvider: async (done) => {
			try {
				// Get the user's account
				const account = await msalClient
					.getTokenCache()
					.getAccountByHomeId(userId);

				if (account) {
					// Attempt to get the token silently
					// This method uses the token cache and
					// refreshes expired tokens as needed
					const response = await msalClient.acquireTokenSilent({
						scopes: process.env.OAUTH_SCOPES.split(','),
						redirectUri: process.env.OAUTH_REDIRECT_URI,
						account: account,
					});

					// First param to callback is the error,
					// Set to null in success case
					done(null, response.accessToken);
				}
			} catch (err) {
				console.log(
					JSON.stringify(err, Object.getOwnPropertyNames(err))
				);
				done(err, null);
			}
		},
	});

	return client;
}
