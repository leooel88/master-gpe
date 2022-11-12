const moduleManager = require('../utils/modules');


const getViews = (moduleRoot, defaultViews) => {
  const modulesPaths = moduleManager.getModulesPaths(moduleRoot);
  const viewsPaths = [...defaultViews]

  modulesPaths.forEach(modulePath => {
    viewsPaths.push(modulePath.concat('/views/'));
  })

  return viewsPaths;
}

exports.getViews = getViews