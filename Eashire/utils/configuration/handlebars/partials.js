const fs = require('fs')

const moduleManager = require('../../modules')

const getPartials = (moduleRoot, defaultPartials) => {
	const modulesPaths = moduleManager.getModulesPaths(moduleRoot)
	let partialsPaths = [...defaultPartials]
	const secondPartials = []

	modulesPaths.forEach((modulePath) => {
		partialsPaths.push(modulePath.concat('/views/components'))
	})

	partialsPaths.forEach((partialPath) => {
		if (fs.existsSync(partialPath)) {
			secondPartials.push(...getPartialsRec(partialPath))
		}
	})

	partialsPaths = [...partialsPaths, ...secondPartials]

	return partialsPaths
}

const getPartialsRec = (dir) => {
	let result = fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => `${dir}/${dirent.name}`)

	result.forEach((curr_dir) => {
		result = [...result, ...getPartialsRec(curr_dir)]
	})

	return result
}

exports.getPartials = getPartials
