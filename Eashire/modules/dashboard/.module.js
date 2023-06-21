const fs = require('fs')

function getController() {
  console.log("===================")
  let result = {}
  const controllersPaths = fs.readdirSync(`${__dirname}/controllers`)
  controllersPaths.forEach(controllerPath => {
    console.log(controllerPath.replace(/\.[^/.]+$/, ''))
    result[controllerPath.replace(/\.[^/.]+$/, '')] = require(`${__dirname}/controllers/${controllerPath}`).process
  })

  return result
}

const controller = getController()
exports.controller = controller