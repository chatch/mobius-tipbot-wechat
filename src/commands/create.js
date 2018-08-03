const BigNumber = require('bignumber.js')
const StellarSdk = require('stellar-sdk')
const Stellar = require('../stellar')

const command = `/create`
const commandDescription = `/create <funding_address> <amount>`

const stellar = new Stellar()

const validArgs = args => {
  if (args.length !== 3) return false

  const publicKey = args[1]
  if (StellarSdk.StrKey.isValidEd25519PublicKey(publicKey) === false)
    return false

  const amount = new BigNumber(args[2])
  if (amount.isPositive() === false) return false

  return true
}

const handler = (msg, user) => {
  const args = msg.split(' ')
  if (!validArgs(args))
    return (
      `Oops, wrong arguments. Check the command follows this form:\n` +
      `  ${commandDescription}`
    )

  const fundingKey = args[1]
  const amount = new BigNumber(args[2])

  stellar
    .buildCreateAccountUrl(fundingKey, amount)
    .then(url => console.log(url))

  return 'building tx ... please wait a few moments'
}

module.exports = {command, commandDescription, handler}
