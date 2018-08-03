const {handler, commandDescription} = require('./create')

const invalidArgsMsg =
  `Oops, wrong arguments. Check the command follows this form:\n` +
  `  ${commandDescription}`

const VALID_PUBLIC_KEY =
  'GBKNW2QNQK4RCFYX3DV4TVSKZBL3YZXE4UKAIUY7XLLVAFV7MMSELK6K'

test('validates command arguments', () => {
  expect(handler('/create', 'user123')).toEqual(invalidArgsMsg)
  expect(handler('/create GGGGGGG', 'user123')).toEqual(invalidArgsMsg)
  expect(handler('/create GGGGGGG 100', 'user123')).toEqual(invalidArgsMsg)
  expect(handler(`/create ${VALID_PUBLIC_KEY} number`, 'user123')).toEqual(
    invalidArgsMsg
  )
})
