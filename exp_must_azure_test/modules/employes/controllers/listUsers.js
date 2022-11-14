const azureService = require('../../../utils/azureService/graph');
const url = require('url');
const errorHandler = require('../../../utils/errorHandler');
const loggerHandler = require('../../../utils/loggerHandler');

exports.getListUsers = async (req, res, next) => {
    let params = {};

    const users = await azureService.getusers(
        req.app.locals.msalClient,
        req.session.userId  
    );

    res.render(
        'listUser',
        {
            users: users.value
        }
    );

}
