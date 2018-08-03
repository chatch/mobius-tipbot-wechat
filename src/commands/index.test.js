const commands = require('./index')

test('all commands collected', () => {
  expect(Object.keys(commands).length).toEqual(3)
})
