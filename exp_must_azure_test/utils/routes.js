const fs = require('fs')

const moduleManager = require('./modules');

function setRoutes(app, moduleRoot) {
  const routesConfig = getRoutesConfig(moduleRoot);

  routesConfig.forEach(routeConfig => {
    console.log(routeConfig)
    app.use('/' + routeConfig.routeName, require(routeConfig.routePath))
  })
}

function getRoutesConfig (moduleRoot) {
  const modulesPaths = moduleManager.getModulesPaths(moduleRoot);
  const routesPaths = []

  modulesPaths.forEach(modulePath => {
    if (!fs.existsSync(modulePath + '/routes')) return
    
    const filesPaths = fs.readdirSync(modulePath + '/routes')

    filesPaths.forEach(file => {
      routesPaths.push({routeName: file.replace(/\.[^/.]+$/, ""), routePath: modulePath + '/routes/' + file})
    })
  });

  return routesPaths
}

exports.setRoutes = setRoutes

