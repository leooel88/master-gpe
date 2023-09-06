# Welcome to Eashire !

Hi !
You just opened the **Eashire** repository ! 
In this *README*, we will go through this application way of functionning, by seeing it's architecture, the technologies used for it's development. We will also see how to make it work... 


# Table of Contents
1. [Requirements & installation](#requirements-and-installation)
2. [Architecture](#architecture)
3. [How to contribute](#how-to-contribute)


## Requirements and installation

### Requirements :

In order to make this application work, you will need to assemble a few first steps :
 - Get an Azure Active Directory and configure it
 - Install MySQL
 - Install NodeJs (v14/16) and NPM (v^7.5)

#### Azure Active Directory
This project being a sort of Cockpit used to fluidify the interaction between RH/Manager teams, and IT Teams, we will need an Azure Active Directory, and we will have to configure it.

The first step is to create an Application (in Active Directory, in the Enterprise Application part). Use 'Create my own App' to personnalize the configuration (dont use a pre-configured app), and choose the option 'Register an application to integrate with Azure AD'.
When is asked to choose the the accounts that can access to this application, take the first one *Contoso*.
For the redirection URI, select Web and put the URI of your locallapplication (in developpement, use localhost URL for example, and in production, use your domain URL).

You can now access your application. In the main page of it, you can see a lot of informatuion, including the app_id which will be usefull at some point : keep it close at hand.
You will also need to [create an app_secret](https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal) , keep it close too.

When creating the app, your actual account will be used as owner of the app, but if you want any other person to access the application, you will have to add his account to the app in the *Role and authorities* menu.

In the *Authorized API* menu, choose every access you want, except you will HAVE to activate those precise ones : 
 - Calendars.ReadWrite
 - Calendars.ReadWrite.Shared
 - Directory.Read.All
 - Domain.Read.All
 - MailbowSettings.Read
 - Group.Read.All
 - offline_access
 - openId
 - profile
 - User.Read
 - User.Read.All

The last step is to create, in your Azure Active Directory, the administration groups used in the app.
You will have to create 3 security groups : 
 - One for the RH group
 - One for the Manager group
 - One for the Financial group
 
The name you use doesn't matter, except you will have to keep those close to hand too.

Informations you have at the end of this step : 
>  - An app_id
>  - An app_secret
>  - The names of your security groups

#### MySQL
The application is now working using the SGBD *MySQL*. So in order to make it work properly, you will have to install MySQL. 
Doesn't matter the way you install it, just make sure you get those informations : 

> - User name and password for your application account (it is recommended not to use the root ones)
> - The host of your database

When installed, create a database and keep it's name close, you will need it later.

Informations you have at the end of this step : 
>  - A user and password for accessing MySQL
>  - The host of MySQL
>  - The name of the database you created

#### NodeJS & NPM

The application is developped using NodeJS and NPM as dependecies manager : make sure you installed both, taking care of the version : 
For *Node*, use version 14 or 16.
For *NPM*, use version 7.5 or higher

### Installation :
When the requirements are fullfilled, you will be able too install and then launch your project.

First, execute the *NPM* installation command in order to retrieve all the dependencies used in the project (such as *express*, *dotenv*, or even *sequelize*). You have to execute this command at the root of the project (inside the same directory as the *package.json* file) :

	npm install

Then, you will have to configure your application. Begin by creating a .env file at the root of your project. Use the .env.example to know the environment variables you will need, and use the information you retrieved in the previous steps (Azure AD variables). For the PORT, you can choose the one you prefer. As for the NODE_ENV, just give it the value 'development' for now.

The next and last step of this installation part is to configure the application to work properly with your database.
For that, go to the *database* directory, and then in the *config* directory. You will find there a file named *config.example.json*. You will have to use it to create your own *config.json* file. Fill the *development* object of the json with the information of your database (user, password, host and database). For the *dialect*, just leave "mysql".

You are now ready to launch the project, by using this command :

	npm start
If everything worked properly, you should be able to join the website, by accessing the url :
> **localhost:THE_PORT_YOU_CHOSE/**

## Architecture

The architecture is, for now, very simple to follow. It uses a basic *MVC* architecture (Model/View/Controller), and every and each of those parts are devided in there own directory : 
 - *./controller* for the controllers
 - *./view* for the views
 - *./database/model* for the models

But let's start with the basics.

### Express

This project is based on a NodeJS framework called **Express**. It is a very basic framework that able ones to create a web application, using requests, routes, and responses sent to the web browser.
For it to work, **Express** needs to be configured, which is why, in the *./bin/www* file, you will see the whole **Express** web configuration :
 - Port definition
 - http server creation
 - listening and error handling
 - ...

Then, in the *./app.js* file, you will find the rest of **Express** configuration :
 - request parsing
 - cors handling, and allowed origins
 - database synchronisation
 - routers definition
 - ...
 
In a general way, you won't have to change anything in those two files, except for the defeinition of a new *Router*

### Routers
A *Router* is an object, which function is to catch the web browser URL, and to match it to a controller, which will define the logic to apply, and the view to send back to the web browser.

To create a *Router*, first go to  the *app.js* file, and  in the router section :

	//Router
	
... define your router :

	const  exampleRouterName = require('./routes/exampleRouterFileName');

... and add it to **Express** :

	app.use('/exampleRouteName', exampleRouterName);

Then, go to the *./routes* directory, and create a new Javascript file named **exampleRouterFileName**, and fill it with this squeleton :

	var  express  = require('express');
	var  router  =  express.Router();

	router.get('/', function (req, res, next) {
		res.send(OK)
	});
	
	module.exports =  router;

This way, when the use will access the *localhost:port/exampleRouteName* URL is accessed by the user on it's web browser, the *app.js* file will be triggered, it will choose the accessed router, which is *exampleRouter* as the entered URL is '.../exampleRouteName', and as there is nothing after exampleRouteName, it will choose the '/' route, which is the default route. 
We defined *"router.get('/', ..."* so this will be triggered, and the *"function (req, res, next) {..."* function will be called.
This function is for now, not doing anything, except sending an 'OK' status to the web browser, but we will enrich it in the next step.
 
### Controller
A *Controller* is the object which enables the logic of the application. 
While the *Router* is only to understand what the user is trying to access, the *Controller* has to implement all the logic to :
 - retrieve the needed informations
 - to calculate what needs to be calculated
 - to call any other API
 - to get datas from the Database
and finally,
 - to wrap all the information needed in order to send them to a chosen view, wichi will be sent to the user.

To define a *Controller*, just create a file in the *controller* directory, named "exampleControllerFile.js".

IN this controller, all you need to do is to define functions, in which is implemented the logic you want to apply, and which returns something to the web browser.
To do so, just use this skeleton :

	exports.getExamplePage  =  async (req, res, next) => {
		const date = new Date()
		res.send("Welcome to Eashire ! Today is ", date)
	}

This few lines will get the current date, and send it in a string to the user's browser.
But the string will be displayed in a very dirty way, which doesn't fit to a professionnal website. So in order to give to our website a nice design, we will introduce the *Views*.

### View
A *View* is a way, for an application, to send to the browser an HTML /CSS page, or any code that can display HTML/CSS on the web browser.
In this project, we chose to use SSR (Server Side Rendering), using a templating language : *Handlebars*.
The idea is to create a file with HTML code inside, but the HTML code can be completed with dynamics datas. And when a controller pass datas to the handlebars template, those informations are placed in the template, which is finally sent as a single and normal HTML page to the user's browser.

To create a handlebars *View*, create a *exampleView.handlebars* file in the *views* directory. In this file, put the following code :

	<div>
		<h1>{{pageTitle}}</h1>
	</div>

Then, in the controller, replace the code inside the getExamplePage function with this code :

	exports.getExamplePage  =  async (req, res, next) => {
		const date = new Date();
		params = {
			pageTitle: date,
			active: {
				exampleView: true
			},
		}
		res.render('exampleView', params);
	}

In this code, we first get the current date, and put it inside an object named *params*, and then, we use *res.render* to send to the user a chosen template (here, *exampleView*), template used with the params object.
Indeed, if you check the code that we put inside the view, you can see this :

	{{pageTitle}}
	
When we use the *params* object with the *handlebars* template, this one will be able to access the properties inside the params, and to include them in the HTML code with those double curly brackets *{{...}}*.

For more details about handlebars's functionnment, check [the doc](https://handlebarsjs.com/)

### Database & Models
In the *database* directory, you will find everything regarding the link between our application and the MySQL database. This directory is, in fact, a *Sequelize* project (check [the doc](https://sequelize.org/docs/v6/getting-started/) for more details about this technology).

>Notice that using the **npm start** function will automatically create the table inside the MySQL database. Sequelize has a function that enables the program to be synced with the database, since it's launch.

First of all, the *config* directory contains the configuration of the MySQL database, used by our application to authenticate itself in it.
Then, we find the *model* directory. A *Model* is the way of modelling and accessing the datas inside the database. Inside, we have to specify every properties of the object, describing for each one of them their type of data, their uniquness, but also the validation informations.
To create a *Model*, first, create a file inside the *./database/models* directory, named *exampleModel.js* , and fill it with this sample of code : 

	'use strict';
	const { Model } = require('sequelize');
	module.exports = (sequelize, DataTypes) => {
		class ExampleModel extends Model {
			static associate(models) {}
		}
		ExampleModel.init(
			{
				firstname: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: {
						isAlphanumeric: true,
					}
				},
				age: {
					type: DataTypes.INT,
					validate: {
						max:  150,
						min:  0,
					}
				}
			}
		)
	}

In this piece of code, we define a model, named ExampleModel. This model contains two properties, the firstname, and the age : 
 - The first name property is of type *string*, which is a text, and we specify the *allowNull* parameter to false, which implies that we HAVE to define the firstname when creating an object of type ExampleModel. Also, this property has a validate parameter, that specifies that this property has to be a alphanumeric value.
 - The age property is of type *int*, which is a number. In the validate parmaeter, we see that the minimum value of this property is 0, and the maximum is 150.

For more details about the validation parameter, see [the doc](https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/).

Now that this model is defined, it can be used inside the controllers, like so : 
Add to the *exampleControllerFile.js* this code : 

	const  db  = require('../database/models');
	const  Op  =  db.Sequelize.Op;
	const  ExampleModel  =  db.ExampleModel;
	
	exports.getExamplePage  =  async (req, res, next) => {
		const exampleModel = {
			firstname: "Harry",
			age: 18
		}
		
		ExampleModel.create(exampleModel)
			.then((data) => {
				console.log("Created Example Model : ", data.dataValue)
				params = {
					firstname: data.dataBalue.firstname
					active: {
						exampleView: true
					},
				}
				res.send("exampleView", params)
			})
		}
	}

And update the view with this code : 

	<div>
		<h1>Welcome {{firstname}} !</h1>
	</div>


The controller creates an object specifying the properties needed inside an ExampleModel, and then, using the ExampleModel from sequelize (imported at the beginning of the file) to push this data inside the MySQL database.

The rest of the database directory won't be used in this project for now.
	
## How to contribute

In order to contribute, no rules are really set to place. Just know this :

If you wish to develop a new feature, create a new branch, and develop everything inside of it. When you are finished, push on this same branch, and create a merge request on GitLab. 
This merge request will be reviewed, and then merged if nothing has to be changed.

Wile developping, try to keep the standards used for now : 
Create your own Models/Controllers/Routes/Views, instead of using hte ones created, in order to keep it easy to review the code you add.

## Usefull docs : 

> - [Express docs](https://expressjs.com/en/starter/installing.html)
> - [Handlebars docs](https://handlebarsjs.com/guide/)
> - [Sequelize docs](https://sequelize.org/docs/v6/)
> - [Tailwind Css Docs](https://tailwindcss.com/docs/installation) (used for the css development)
> - [Azure Active Directory docs](https://learn.microsoft.com/en-us/azure/active-directory/)
> - [Azure API docs](https://learn.microsoft.com/en-us/graph/)

## End

That is pretty puch it. Thanks for reading, and have fun !

Eashire Team
