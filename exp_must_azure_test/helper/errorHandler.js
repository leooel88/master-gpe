exports.sendInvalidBodyError = (res, page) => {
	res.status(400);
	let params = {
		error: [
			{
				message: 'Invalid body',
				debug: 'debug message',
			},
		],
		active: page,
	};
	res.render(page, params);
};

exports.catchDataCreationError = (errors, res, page) => {
	let errorMessage = 'Invalid body :\n';
	if (Array.isArray(errors)) {
		errors.forEach((error) => {
			errorMessage += ' - ' + error.message + '\n';
		});
	} else {
		errorMessage += ' - ' + errors + '\n';
	}
	res.status(400);
	res.redirect('/' + page + '?error=' + errorMessage);
};
