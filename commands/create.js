const BigNumber = require('bignumber.js')
const Mobius = require('mobius-client-js')
const StellarSdk = require('stellar-sdk')

const {KeyPair, Operation} = StellarSdk
const {STELLAR_NETWORK, TIPBOT_KEY} = require('./config')

const command = `/create`
const commandDescription = `/create <funding_address> <amount>`

const validArgs = args => {
  if (args.length !== 3) return false

  const publicKey = args[1]
  if (StellarSdk.StrKey.isValidEd25519PublicKey(publicKey) === false)
    return false

  const amount = new BigNumber(args[2])
  if (amount.isPositive() === false) return false

  return true
}

const createAccountOp = newAccountKey =>
  Operation.createAccount({
    destination: newAccountKey,
    starting_balance: 2.5 + 1,
  })

const changeTrustOp = newAccountKey =>
  Operation.changeTrust({
    source_account: newAccountKey,
    asset: Mobius.assetIssuer(),
  })

const setOptionsOp = (newAccountKey, fundingKey) =>
  Operation.setOptions({
    source_account: newAccountKey,
    high_threshold: 2,
    med_threshold: 1,
    low_threshold: 1,
    master_weight: 0,
    signer: {ed25519PublicKey: fundingKey, weight: 2},
  })

const addBotAsSignerOp = (newAccountKey, botKey) =>
  Operation.setOptions({
    source_account: newAccountKey,
    signer: {ed25519PublicKey: botKey, weight: 1},
  })

const paymentOp = (newAccountKey, amount) =>
  Operation.payment({
    destination: newAccountKey,
    amount: amount.toString(),
  })

const buildCreateAccountTx = (fundingKey, amount, newAccountKP) => {
  const newAccountKey = newAccountKP.publicKey()

  const operations = [
    createAccountOp(newAccountKey),
    changeTrustOp(newAccountKey),
    setOptionsOp(newAccountKey),
    addBotAsSignerOp(newAccountKey, TIPBOT_KEY),
    paymentOp(newAccountKey, amount),
  ]

  const horizonUrl =
    STELLAR_NETWORK === 'testnet'
      ? 'https://horizon-testnet.stellar.org'
      : 'https://horizon.stellar.org'
  const server = new StellarSdk.Server(horizonUrl)

  return server
    .accounts()
    .accountId(fundingKey)
    .call()
    .then(fundingAccount => {
      const tb = new TransactionBuilder(fundingAccount)
      operations.forEach(op => tb.addOperation(op))
      return tb.build()
    })
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
  const newAccountKP = Keypair.random()

  buildCreateAccountTx(fundingKey, amount, newAccountKP).then(tx =>
    console.log(tx)
  )

  return 'building tx ... please wait a few moments'
}

module.exports = {command, commandDescription, handler}
