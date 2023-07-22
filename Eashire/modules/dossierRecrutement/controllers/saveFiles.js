const multer = require('multer')

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

exports.process = async (req, res, next) => {
	// Generate ID once per request
	req.directoryId = crypto.randomBytes(16).toString('hex')
	req.directoryName = path.join(
		`${__dirname}/../../..`,
		'public',
		'servedFiles',
		'dossiersRecrutement',
		req.directoryId,
	)

	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			const dir = req.directoryName
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir)
			}
			cb(null, dir)
		},
		filename: (req, file, cb) => {
			const fileName = `${req.directoryId}-${file.fieldname.replace('file_input_', '')}-${
				file.originalname
			}`
			if (!req.filesNames) {
				req.filesNames = []
			}
			req.filesNames.push(fileName)
			cb(null, fileName)
		},
	})

	const upload = multer({ storage: storage }).any()

	upload(req, res, function (err) {
		if (err) {
			// A Multer error occurred when uploading.
			return res.status(500).json(err)
		}
		// Everything went fine.
		next()
	})
}
