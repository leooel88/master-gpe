var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const msal = require('@azure/msal-node');
require('dotenv').config();
var serveIndex = require('serve-index');
var app = express();

//=====================================================================
//===================== Bodyparser configuration ======================
//=====================================================================

const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended:false}));

//=====================================================================

//=====================================================================
//====================== Session configuration ========================
//=====================================================================

app.use(
	session({
		secret: 'your_secret_value_here',
		resave: false,
		saveUninitialized: false,
		unset: 'destroy',
	})
);

// Flash middleware
app.use(flash());

//=====================================================================

//=====================================================================
//================== Local vars for template layout ===================
//=====================================================================

app.use(function (req, res, next) {
	res.locals.error = req.flash('error_msg');

	var errs = req.flash('error');
	for (var i in errs) {
		res.locals.error.push({ message: 'An error occurred', debug: errs[i] });
	}

	if (req.session.userId) {
		res.locals.user = app.locals.users[req.session.userId];
	}

	next();
});

//=====================================================================

//=====================================================================
//======================== CORS configuration =========================
//=====================================================================

const cors = require('cors');
var corsOptions = {
	origin: `http://localhost:${process.env.PORT}`,
};
app.use(cors(corsOptions));

//=====================================================================

//=====================================================================
//===================== Azure MSAL configuration ======================
//=====================================================================

app.locals.users = {};

const msalConfig = {
	auth: {
		clientId: process.env.OAUTH_APP_ID,
		authority: process.env.OAUTH_AUTHORITY,
		clientSecret: process.env.OAUTH_APP_SECRET,
	},
	system: {
		loggerOptions: {
			loggerCallback(loglevel, message, containsPii) {
				console.log(message);
			},
			piiLoggingEnabled: false,
			logLevel: msal.LogLevel.Verbose,
		},
	},
};

app.locals.msalClient = new msal.ConfidentialClientApplication(msalConfig);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//=====================================================================

//=====================================================================
//=================== Database configuration ==========================
//=====================================================================

const db = require('./database/models');
db.sequelize
	.sync({ force: true })
	.then(() => {
		console.log('Synced db.');
	})
	.catch((err) => {
		console.log('Failed to sync db: ' + err.message);
	});

//=====================================================================

//=====================================================================
//===================== View configuration ============================
//=====================================================================

const handlebarsConfig = require('./utils/configuration/handlebars')

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebarsConfig.getEngine());
app.set('views', handlebarsConfig.getViews(__dirname + '/modules'))

//=====================================================================

//=====================================================================
//===================== Public folders exposition =====================
//=====================================================================

app.use(
	express.static(path.join(__dirname, 'public'), {
		index: false,
	})
);
// app.use('/CV', express.static('/CV'));
// app.use('/CV', serveIndex('/CV'));
// app.use('/documents', express.static('/adminFile', { icons: true }));
// app.use('/documents', serveIndex('/adminFile', { icons: true }));

//=====================================================================

//=====================================================================
//===================== Routes configuration ==========================
//=====================================================================

const routesManager = require('./utils/routes')
routesManager.setRoutes(app, __dirname + '/modules')
const homeRouter = require('./modules/home/routes/home')
app.use('/', homeRouter)

//=====================================================================

app.use
module.exports = app;
