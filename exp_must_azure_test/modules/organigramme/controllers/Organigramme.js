const azureService = require('../../../utils/azureService/graph');
const errorHandler = require('../../../utils/errorHandler');
const loggerHandler = require('../../../utils/loggerHandler');

exports.getOrganigrammePage = async (req, res, next) => {
let params = {};

const manager = await azureService.getManager(
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
params.directReports = directReports;
params.coworker = coworker;
console.log(directReports);
console.log(coworker)
res.render('organigramme',{manager:manager,directReports:directReports.value, coworker: coworker.value});

}