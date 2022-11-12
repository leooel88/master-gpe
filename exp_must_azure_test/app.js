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

const bodyparser = require('body-parser');//
app.use(bodyparser.urlencoded({extended:false}));//

/*app.post('/ficheposte/create',(req,res,next)=>{//
	console.log(req.body);//
	res.redirect('/ficheposte/list');//
})//*/


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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	express.static(path.join(__dirname, 'public'), {
		index: false,
	})
);

app.use('cv', express.static('cv'));
//-------------------------------------------

//=====================================================================
//===================== View configuration =============================
//=====================================================================

const handlebarsConfig = require('./handlebars')

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebarsConfig.getEngine());
app.set('views', handlebarsConfig.getViews(__dirname + '/modules'))

//=====================================================================



app.use('/CV', express.static('CV'));
app.use('/CV', serveIndex('CV'));
app.use('/documents', express.static('adminFile', { icons: true }));
app.use('/documents', serveIndex('adminFile', { icons: true }));

// app.set('views', path.join(__dirname, '/views'));
// app.set('views', './views');
// app.set('views', __dirname + '/views');
// app.set('view engine', 'hbs');
// app.engine(
// 	'hbs',
// 	hbs.engine({
// 		extname: 'hbs',
// 		defaultLayout: 'main',
// 		layoutsDir: __dirname + '/views/layouts/',
// 		partialsDir: __dirname + '/views/components',
// 	})
// );

// hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
// 	return arg1 == arg2 ? options.fn(this) : options.inverse(this);
// });

// Routers declaration
// Routers
var homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');
const calendarRouter = require('./routes/calendar');
const fichePosteRouter = require('./routes/FichePoste');
const dashboardRouter = require('./routes/dashboard');
const candidatureRouter = require('./routes/candidature');
const uploadFileRouter = require('./routes/uploadAdminFile');
const listFileRouter = require('./routes/listFile');
const listUserRouter = require('./routes/listUser');
const organigrammeRouter = require('./routes/organigramme');

const testRouter = require('./routes/test'); //

app.use('/', homeRouter);
app.use('/home', homeRouter);
app.use('/auth', authRouter);
app.use('/calendar', calendarRouter);
app.use('/ficheposte', fichePosteRouter);
app.use('/dashboard', dashboardRouter);
app.use('/candidature', candidatureRouter);
app.use('/uploadFile', uploadFileRouter);
app.use('/listFile', listFileRouter);
app.use('/listUser', listUserRouter);
app.use('/organigramme', organigrammeRouter);

app.use('/test', testRouter);

app.use
module.exports = app;
