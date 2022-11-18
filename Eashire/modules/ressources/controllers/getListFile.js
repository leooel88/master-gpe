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
			res.render('listfile', { files: files })
		},
	)
}
