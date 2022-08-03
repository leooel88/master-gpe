const azureService = require('../azureService/graph');
const errorHandler = require('../helper/errorHandler');
const loggerHandler = require('../helper/loggerHandler');

exports.getListUsers = async (req, res, next) => {
let params = {};

const users = await azureService.getusers(
    req.app.locals.msalClient,
    req.session.userId  
    
);
console.log(users);

//params.users = JSON.stringify(users);


res.render('listUser',{users:users.value });

}
