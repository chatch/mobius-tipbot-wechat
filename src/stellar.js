const Mobius = require('@mobius-network/mobius-client-js')
const StellarSdk = require('stellar-sdk')

const {Keypair, Operation} = StellarSdk
const {STELLAR_NETWORK, TIPBOT_KEY} = require('../config')

const MobiAsset = Mobius.Client.stellarAsset

class Stellar {
  constructor() {
    this.isPublic = STELLAR_NETWORK === 'public'
    this.isPublic
      ? StellarSdk.Network.usePublicNetwork()
      : StellarSdk.Network.useTestNetwork()
    const horizonUrl = this.isPublic
      ? 'https://horizon.stellar.org'
      : 'https://horizon-testnet.stellar.org'
    this.server = new StellarSdk.Server(horizonUrl)
  }

  /**
   * Build a URL that lands on the Stellar Laboratory Transaction Builder with
   * a transaction that creates a new user bot account.
   */
  buildCreateAccountUrl(fundingKey, amount) {
    const newAccountKP = Keypair.random()
    const newAccountKey = newAccountKP.publicKey()

    const operations = [
      Operation.createAccount({
        destination: newAccountKey,
        startingBalance: '3.5',
      }),
      Operation.changeTrust({
        source: newAccountKey,
        asset: MobiAsset,
      }),
      Operation.setOptions({
        source: newAccountKey,
        highThreshold: 2,
        medThreshold: 1,
        lowThreshold: 1,
        masterWeight: 0,
        signer: {ed25519PublicKey: fundingKey, weight: 2},
      }),
      // add bot as signer
      Operation.setOptions({
        source: newAccountKey,
        signer: {ed25519PublicKey: TIPBOT_KEY, weight: 1},
      }),
      // fund new account
      Operation.payment({
        destination: newAccountKey,
        amount: amount.toString(),
        asset: MobiAsset,
      }),
    ]

    return this.server
      .loadAccount(fundingKey)
      .then(fundingAccount => {
        const tb = new StellarSdk.TransactionBuilder(fundingAccount)
        operations.forEach(op => tb.addOperation(op))

        const tx = tb.build()
        const xdr = tx
          .toEnvelope()
          .toXDR()
          .toString('base64')

        return this.stellarLaboratoryXdrViewerLink(xdr)
      })
      .catch(err => {
        console.error(`unexpected error: ${err}`)
        throw err
      })
  }

  stellarLaboratoryXdrViewerLink(xdr) {
    return `https://www.stellar.org/laboratory/#xdr-viewer?input=${xdr}&network=${
      this.isPublic ? 'public' : 'test'
    }`
  }
}

module.exports = Stellar
