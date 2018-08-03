const crypto = require('crypto')
const request = require('supertest')

const webot = require('./webot')
const {WX_TOKEN} = require('./config')

const USER = 'odQ_C0gylEtCpMTORAqxQoLd1Zmg'
const TIMESTAMP = 1533288151

const calculateSignature = (timestamp, nonce) => {
  const s = [WX_TOKEN, timestamp, nonce].sort().join('')
  return crypto
    .createHash('sha1')
    .update(s)
    .digest('hex')
}

const signatureQuery = () => {
  const nonce = 1
  return {
    nonce,
    openid: USER,
    signature: calculateSignature(TIMESTAMP, nonce),
    timestamp: TIMESTAMP,
  }
}

const xmlMsg = msg =>
  `
<xml>
<ToUserName><![CDATA[gh_97f347ad4987]]></ToUserName>
<FromUserName><![CDATA[${USER}]]></FromUserName>
<CreateTime>${TIMESTAMP}</CreateTime>
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

const stripCreateTime = xml =>
  xml.replace(
    /<CreateTime>.*<\/CreateTime>/,
    '<CreateTime>redacted :)</CreateTime>'
  )

test('unknown command returns error message', () =>
  sendMsg('/coffee').then(rsp =>
    expect(stripCreateTime(rsp.text)).toMatchSnapshot()
  ))

test('/help command returns help text', () =>
  sendMsg('/help').then(rsp =>
    expect(stripCreateTime(rsp.text)).toMatchSnapshot()
  ))
