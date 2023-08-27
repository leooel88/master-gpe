const multer = require('multer')

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const { RESSOURCE_BASE_PATH } = process.env

exports.process = async (req, res, next) => {
	// The directory where we want to store the files
	const directoryPath = path.join(`${__dirname}/../../..`, 'public', RESSOURCE_BASE_PATH)

	// Ensure the directory exists
	if (!fs.existsSync(directoryPath)) {
		fs.mkdirSync(directoryPath, { recursive: true })
	}

	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, directoryPath) // use the directoryPath as the destination
		},
		filename: (req, file, cb) => {
			// Create a random ID for the filename
			const fileId = crypto.randomBytes(16).toString('hex')
			const fileExtension = path.extname(file.originalname) // get the original file's extension
			const fileName = fileId + fileExtension

			req.filePath = fileName

			cb(null, fileName)
		},
	})

	const upload = multer({ storage: storage }).single('file_input') // Only handle one file named 'file_input'

	upload(req, res, function (err) {
		if (err) {
			// A Multer error occurred when uploading.
			return res.status(500).json(err)
		}
		// Everything went fine.
		next()
	})
}
