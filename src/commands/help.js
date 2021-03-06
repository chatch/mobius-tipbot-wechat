const command = `/help`
const commandDescription = command

const helpRsp = user => `Hi, ${user}, I am Mobius TipBot!

/balance will show your earned tips amount.

/withdraw <address> <amount> will withdraw accumulated tips to your Stellar account. Omit amount to withdraw all the tips at once

If you need to create a wallet see the Mobius StellarTerm Wallet Guide! https://bit.ly/mobi_stg

/create <funding_address> <amount> - create and fund your own Tipping Account to send tips from (no more 1 tip per hour limit!). \`<funding_address>\` - is your current Stellar account that will be used fund your Tipping Account. \`<amount>\` - the amount that Tipping Account will be funded with

/unregister <withdraw_address> - unregister your Tipping Account and withdraw your funds. You will revert to tipping from the default pool and be limited to 1 tip per hour  \`<withdraw_address>\` - Stellar address where your funds will be withdrawn to and Tipping Account will be merged into

/my_address - returns your Tipping Account that was created by /create. If you run out of tokens send more here to continue tipping!
`

const handler = (msg, user) => {
  return helpRsp(user)
}

module.exports = {command, commandDescription, handler}
