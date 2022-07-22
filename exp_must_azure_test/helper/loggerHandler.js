exports.checkLoggedIn = (req, res) => {
	if (!req.session.userId) {
		// Redirect unauthenticated requests to home page
		res.redirect('/auth/signin');
		return false;
	} else {
		return true;
	}
};
