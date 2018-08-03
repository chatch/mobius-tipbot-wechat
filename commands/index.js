const fs = require('fs')
const path = require('path')

const commands = {}

fs.readdirSync(path.join(__dirname)).forEach(file => {
  if (
    file.endsWith('.js') == false ||
    file.endsWith('.test.js') ||
    __filename.endsWith(file) // this file
  )
    return

  const cmd = require(`./${file}`)
  if (!cmd.command) {
    console.warn(`no command defined in ${file}`)
    return
  }

  commands[cmd.command] = cmd
})

module.exports = commands
