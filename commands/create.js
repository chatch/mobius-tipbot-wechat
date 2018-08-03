const BigNumber = require('bignumber.js')
const StellarSdk = require('stellar-sdk')

const command = `/create`
const commandDescription = `/create <funding_address> <amount>`

const validArgs = msg => {
  const args = msg.split(' ')
  if (args.length !== 3) return false

  const publicKey = args[1]
  if (StellarSdk.StrKey.isValidEd25519PublicKey(publicKey) === false)
    return false

  const amount = new BigNumber(args[2])
  if (amount.isPositive() === false) return false

  return true
}

const handler = (msg, user) => {
  if (!validArgs(msg))
    return (
      `Oops, wrong arguments. Check the command follows this form:\n` +
      `  ${commandDescription}`
    )

  // const tx = buildTx()

  return ''
}

module.exports = {command, commandDescription, handler}
