const exphbs = require('express-handlebars')

const helpersManager = require('./helpers')
const layoutsManager = require('./layouts')
const partialsManager = require('./partials')
const viewsManager = require('./views')

function getEngine() {
	const { helpers, layouts, partials } = getConfig(`${__dirname}/../../../modules`)
	console.log(layouts)
	console.log(partials)

	const hbs = exphbs.create({
		helpers: helpers,
		defaultLayout: `${__dirname}/../../../views/layouts/main`,
		partialsDir: partials,
		layoutsDir: layouts,
	})

	return hbs.engine
}

function getConfig(moduleRoot) {
	return {
		helpers: helpersManager.getHelpers(),
		layouts: layoutsManager.getLayouts(moduleRoot, [`${__dirname}/../../../views/layouts`]),
		partials: partialsManager.getPartials(moduleRoot, [
			`${__dirname}/../../../views/components/`,
			// `${__dirname}/../../../views/components/buttons`,
			// `${__dirname}/../../../views/components/buttons/formButtons`,
			// `${__dirname}/../../../views/components/buttons/linkButtons`,
			// `${__dirname}/../../../views/components/buttons/linkButtons/linkButtonsNormal`,
			// `${__dirname}/../../../views/components/buttons/linkButtons/linkButtonsSmall`,
			// `${__dirname}/../../../views/components/svg/outline`,
			// `${__dirname}/../../../views/components/svg/solid`,
		]),
	}
}

function getViews(moduleRoot) {
	return viewsManager.getViews(moduleRoot, [`${__dirname}/../../../views/`])
}

exports.getEngine = getEngine
exports.getViews = getViews
