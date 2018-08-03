const {handler} = require('./help')

test('return help message with user in greeting', () => {
  expect(handler('/help', 'user123')).toMatchSnapshot()
})
