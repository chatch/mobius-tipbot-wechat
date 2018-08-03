const fs = require('fs')
const path = require('path')

const commands = {}

fs.readdirSync(path.join(__dirname))
  .filter(
    file =>
      file.endsWith('.js') === true &&
      file.endsWith('.test.js') === false &&
      __filename.endsWith(file) === false // NOT this file
  )
  .forEach(file => {
    const cmd = require(`./${file}`)
    if (!cmd.command) {
      console.warn(`no command defined in ${file}`)
      return
    }
    commands[cmd.command] = cmd
  })

module.exports = commands
