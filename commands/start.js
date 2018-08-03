/**
 * Start command is an alias for help so pull in and use the help handler.
 */

const help = require('./help')

const command = `/start`
const commandDescription = command

module.exports = {command, commandDescription, handler: help.handler}
