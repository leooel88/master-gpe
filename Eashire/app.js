const { LogLevel, ConfidentialClientApplication } = require('@azure/msal-node')
const body_parser = require('body-parser')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const session = require('express-session')
const moduleAlias = require('module-alias')
const logger = require('morgan')

const { join } = require('path')

const db = require('./database/models')
const { getEngine, getViews } = require('./utils/configuration/handlebars')
const moduleManager = require('./utils/modules')
const routesManager = require('./utils/routes')

require('dotenv').config()
const app = express()

// =====================================================================
// ===================== Aliases configuration =========================
// =====================================================================

moduleAlias.addAliases({
	'@root': __dirname,
	'@database': `${__dirname}/database`,
	'@models': `${__dirname}/database/models`,
	'@modules': `${__dirname}/modules`,
	'@utils': `${__dirname}/utils`,
})

const modulePaths = moduleManager.getModules(`${__dirname}/modules`)
modulePaths.forEach((module) => {
	moduleAlias.addAlias(`@${module.moduleName}`, `${module.modulePath}/.module`)
	moduleAlias.addAlias(`@${module.moduleName}Route`, `${module.modulePath}/routes`)
	moduleAlias.addAlias(`@${module.moduleName}Controller`, `${module.modulePath}/controllers`)
	moduleAlias.addAlias(`@${module.moduleName}View`, `${module.modulePath}/views`)
	moduleAlias.addAlias(`@${module.moduleName}Components`, `${module.modulePath}/components`)
})

// =====================================================================

// =====================================================================
// ===================== Bodyparser configuration ======================
// =====================================================================

app.use(body_parser.urlencoded({ extended: false }))

// =====================================================================

// =====================================================================
// ====================== Session configuration ========================
// =====================================================================

app.use(
	session({
		secret: 'your_secret_value_here',
		resave: false,
		saveUninitialized: false,
		unset: 'destroy',
	}),
)

// Flash middleware
app.use(flash())

// =====================================================================

// =====================================================================
// ================== Local vars for template layout ===================
// =====================================================================

app.use(function (req, res, next) {
	res.locals.error = req.flash('error_msg')

	const errs = req.flash('error')
	for (const i in errs) {
		res.locals.error.push({ message: 'An error occurred', debug: errs[i] })
	}

	if (req.session.userId) {
		res.locals.user = app.locals.users[req.session.userId]
	}

	next()
})

// =====================================================================

// =====================================================================
// ======================== CORS configuration =========================
// =====================================================================

const corsOptions = {
	origin: `http://localhost:${process.env.PORT}`,
}
app.use(cors(corsOptions))

// =====================================================================

// =====================================================================
// ===================== Azure MSAL configuration ======================
// =====================================================================

app.locals.users = {}

const msalConfig = {
	auth: {
		clientId: process.env.OAUTH_APP_ID,
		authority: process.env.OAUTH_AUTHORITY,
		clientSecret: process.env.OAUTH_APP_SECRET,
	},
	system: {
		loggerOptions: {
			loggerCallback(loglevel, message, containsPii) {
				console.log(message)
			},
			piiLoggingEnabled: false,
			logLevel: LogLevel.Verbose,
		},
	},
}

app.locals.msalClient = new ConfidentialClientApplication(msalConfig)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// =====================================================================

// =====================================================================
// =================== Database configuration ==========================
// =====================================================================

db.sequelize
	.sync({ force: true })
	.then(() => {
		console.log('Synced db.')
	})
	.catch((err) => {
		console.log(`Failed to sync db: ${err.message}`)
	})

// =====================================================================

// =====================================================================
// ===================== View configuration ============================
// =====================================================================

app.set('view engine', 'handlebars')
app.engine('handlebars', getEngine())
app.set('views', getViews(`${__dirname}/modules`))

// =====================================================================

// =====================================================================
// ===================== Public folders exposition =====================
// =====================================================================

app.use(
	express.static(join(__dirname, 'public'), {
		index: false,
	}),
)

// =====================================================================

// =====================================================================
// ===================== Routes configuration ==========================
// =====================================================================

routesManager.setRoutes(app, `${__dirname}/modules`, 'home')

// =====================================================================

app.use
module.exports = app
