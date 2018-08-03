const crypto = require('crypto')
const request = require('supertest')

const webot = require('./webot')
const {WX_TOKEN} = require('./config')

const USER = 'odQ_C0gylEtCpMTORAqxQoLd1Zmg'

const calculateSignature = (timestamp, nonce) => {
  const s = [WX_TOKEN, timestamp, nonce].sort().join('')
  return crypto
    .createHash('sha1')
    .update(s)
    .digest('hex')
}

const signatureQuery = () => {
  const nonce = 1
  const timestamp = Math.floor(Date.now() / 1000)
  return {
    nonce,
    openid: USER,
    signature: calculateSignature(timestamp, nonce),
    timestamp,
  }
}

const xmlMsg = msg =>
  `
<xml>
<ToUserName><![CDATA[gh_97f347ad4987]]></ToUserName>
<FromUserName><![CDATA[${USER}]]></FromUserName>
<CreateTime>1533300000</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[${msg}]]></Content>
<MsgId>6585322584931228410</MsgId>
</xml>
`.replace(/\n/g, '')

const sendMsg = msg =>
  request(webot)
    .post('/wechat')
    .set('Content-Type', 'text/xml')
    .query(signatureQuery())
    .send(xmlMsg(msg))
    .expect(200)

test('unknown command returns error message', () =>
  sendMsg('/coffee').then(rsp => expect(rsp.text).toMatchSnapshot()))

test('/help command returns help text', () =>
  sendMsg('/help').then(rsp => expect(rsp.text).toMatchSnapshot()))
