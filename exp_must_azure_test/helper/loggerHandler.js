exports.checkLoggedInRedirectSignInIfNot = (req, res) => {
	if (!req.session.userId) {
		// Redirect unauthenticated requests to home page
		res.redirect('/auth/signin');
		return false;
	} else {
		return true;
	}
};

exports.checkLoggedIn = (req) => {
	if (!req.session.userId) {
		return false;
	} else {
		return true;
	}
};
