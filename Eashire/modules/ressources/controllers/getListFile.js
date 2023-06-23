const jwt = require('jsonwebtoken')

const fs = require('fs')

exports.process = (req, res) => {
	console.log('list files')

	// Function to get current filenames
	// in directory
	fs.readdir(`${__dirname}/../../../public/servedFiles/adminFile`, (err, files) => {
		if (err) console.log(err)
		else {
			console.log('adminFile')
			files.forEach((file) => {
				console.log(file)
			})
		}
	})

	// Function to get current filenames
	// in directory with "withFileTypes"
	// set to "true"

	fs.readdir(
		`${__dirname}/../../../public/servedFiles/adminFile`,
		{ withFileTypes: true },
		(err, files) => {
			console.log('adminFile')
			if (err) console.log(err)
			else {
				files.forEach((file) => {
					console.log(file)
				})
			}
			const params = {
				files: files,
			}

			const decodedToken = jwt.verify(req.cookies.authToken, 'RANDOM_TOKEN_SECRET')
			const { userId, rh: isRh, manager: isManager, finance: isFinance, it: isIt } = decodedToken
			params.userId = userId

			if (isRh == true) {
				params.rh = true
			}
			if (isManager == true) {
				params.manager = true
			}
			if (isFinance == true) {
				params.finance = true
			}
			if (isIt == true) {
				params.it = true
			}
			res.render('listfile', {
				layout: 'mainWorkspaceSidebar',
				...params,
			})
		},
	)
}
