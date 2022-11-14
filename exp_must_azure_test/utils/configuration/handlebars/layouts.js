const moduleManager = require('../../modules');


const getLayouts = (moduleRoot, defaultLayouts) => {
  const modulesPaths = moduleManager.getModulesPaths(moduleRoot);
  const layoutsPaths = [...defaultLayouts]

  modulesPaths.forEach(modulePath => {
    layoutsPaths.push(modulePath.concat('/views/layouts'));
  })

  return layoutsPaths;
}

exports.getLayouts = getLayouts