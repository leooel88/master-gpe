const moduleManager = require('../utils/modules');


const getPartials = (moduleRoot, defaultPartials) => {
  const modulesPaths = moduleManager.getModulesPaths(moduleRoot);
  const partialsPaths = [...defaultPartials]

  modulesPaths.forEach(modulePath => {
    partialsPaths.push(modulePath.concat('/views/components'));
  })

  return partialsPaths;
}

exports.getPartials = getPartials