const azureService = require('../azureService/graph');
const errorHandler = require('../helper/errorHandler');
const loggerHandler = require('../helper/loggerHandler');

exports.getOrganigrammePage = async (req, res, next) => {
let params = {};

const manager = await azureService.getManager(
    req.app.locals.msalClient,
    req.session.userId  
);

const user = await azureService.getUserDetails(
    req.app.locals.msalClient,
    req.session.userId  
);

const directReports = await azureService.getDirectReports(
    req.app.locals.msalClient,
    req.session.userId  
);

const coworker = await azureService.getCoworker(
    req.app.locals.msalClient,
    req.session.userId  
);

params.manager = manager;
params.user = user;
params.directReports = directReports;
params.coworker = coworker;
console.log(directReports);
console.log(coworker);
res.render('organigramme',{manager:manager,user:user,directReports:directReports.value});

}