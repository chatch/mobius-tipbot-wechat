const express = require('express')

const commands = require('./commands')
const {WX_TOKEN} = require('./config')

const mp = require('wechat-mp')(WX_TOKEN)

const toCmdKey = cmdStr =>
  cmdStr.substring(
    0,
    cmdStr.indexOf(' ') !== -1 ? cmdStr.indexOf(' ') : cmdStr.length
  )

const textReply = (res, text) => {
  res.body = {
    msgType: 'text',
    content: text,
  }
  console.log(`reply: ${JSON.stringify(res.body)}`)
}

const commandHandler = (req, res, next) => {
  const cmdStr = req.body.text
  const user = req.body.uid
  console.log(`cmd: ${cmdStr}`)

  const cmdKey = toCmdKey(cmdStr)
  let reply
  if (commands[cmdKey]) {
    reply = commands[cmdKey].handler(cmdStr, user)
  } else {
    reply = `Command [${cmdKey}] unknown.\nUse /help to see a list of commands.`
  }

  textReply(res, reply)

  next()
}

const app = express()
app.use('/wechat', mp.start())
app.post('/wechat', commandHandler, mp.end())

module.exports = app
