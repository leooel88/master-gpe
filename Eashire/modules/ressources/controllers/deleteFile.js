const fs = require('fs')

exports.process = (req, res, next) => {
	fs.unlink(
		`${__dirname}/../../../public/servedFiles/adminFile/${req.body.filename}`,
		function (err) {
			if (err) throw err
			// if no error, file has been deleted successfully
			console.log('File deleted!')
			res.redirect('/listFile')
		},
	)
}
