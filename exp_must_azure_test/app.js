var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const msal = require('@azure/msal-node');
require('dotenv').config();

var app = express();

// Session middleware
// NOTE: Uses default in-memory session store, which is not
// suitable for production
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

// Set up local vars for template layout
app.use(function (req, res, next) {
	// Read any flashed errors and save
	// in the response locals
	res.locals.error = req.flash('error_msg');

	// Check for simple error string and
	// convert to layout's expected format
	var errs = req.flash('error');
	for (var i in errs) {
		res.locals.error.push({ message: 'An error occurred', debug: errs[i] });
	}

	// Check for an authenticated user and load
	// into response locals
	if (req.session.userId) {
		res.locals.user = app.locals.users[req.session.userId];
	}

	next();
});

// CORS configuration
const cors = require('cors');
var corsOptions = {
	origin: `http://localhost:${process.env.PORT}`,
};
app.use(cors(corsOptions));

// Microsoft Azure Configuration

// In-memory storage of logged-in users
// For demo purposes only, production apps should store
// this in a reliable storage
app.locals.users = {};

// MSAL config
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

const db = require('./database/models');
db.sequelize
	.sync({ force: true })
	.then(() => {
		console.log('Synced db.');
	})
	.catch((err) => {
		console.log('Failed to sync db: ' + err.message);
	});

// Create msal application object
app.locals.msalClient = new msal.ConfidentialClientApplication(msalConfig);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	express.static(path.join(__dirname, 'public'), {
		index: false,
	})
);

// View configuration
var hbs = require('express-handlebars');

// app.set('views', path.join(__dirname, '/views'));
// app.set('views', './views');
// app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.engine(
	'hbs',
	hbs.engine({
		extname: 'hbs',
		defaultLayout: 'main',
		layoutsDir: __dirname + '/views/layouts/',
		partialsDir: __dirname + '/views/components',
	})
);

// Routers declaration
// Routers
var homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');
const calendarRouter = require('./routes/calendar');
const fichePosteRouter = require('./routes/FichePoste');
const dashboardRouter = require('./routes/dashboard');

app.use('/', homeRouter);
app.use('/home', homeRouter);
app.use('/auth', authRouter);
app.use('/calendar', calendarRouter);
app.use('/ficheposte', fichePosteRouter);
app.use('/dashboard', dashboardRouter);

module.exports = app;
