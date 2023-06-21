const fs = require('fs')

const getModulesPaths = (moduleRoot) =>
	fs
		.readdirSync(moduleRoot, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) =>
			moduleRoot.substring(moduleRoot.length - 1) === '/'
				? moduleRoot + dirent.name
				: `${moduleRoot}/${dirent.name}`,
		)

const getModules = (moduleRoot) =>
	fs
		.readdirSync(moduleRoot, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) =>
			moduleRoot.substring(moduleRoot.length - 1) === '/'
				? { modulePath: moduleRoot + dirent.name, moduleName: dirent.name }
				: { modulePath: `${moduleRoot}/${dirent.name}`, moduleName: dirent.name },
		)
exports.getModulesPaths = getModulesPaths
exports.getModules = getModules
