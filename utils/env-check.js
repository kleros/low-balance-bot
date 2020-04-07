const ethers = require('ethers')

const { getAddress } = ethers.utils

// Web3
if (!process.env.PROVIDER_URL) {
  console.error(
    'No web3 provider set. Please set the PROVIDER_URL environment variable.'
  )
  process.exit(1)
}

if (!process.env.WALLETS) {
  console.error(
    'Wallets array not set. Please set the WALLETS environment variable.'
  )
  process.exit(1)
}

try {
  const wallets = JSON.parse(process.env.WALLETS)
  if (!Array.isArray(wallets)) {
    console.error('WALLETS should be an array of objects')
    process.exit(1)
  }

  // getAddress will throw if one of the addresses is not a checksummed address.
  wallets.forEach(({ address }) => getAddress(address))
} catch (err) {
  console.error('Error in WALLETS env variable.')
  throw err
}

if (!process.env.SENDGRID_API_KEY) {
  console.error(
    'SendGrid key not set. Please set the SENDGRID_API_KEY environment variable.'
  )
  process.exit(1)
}

if (!process.env.TEMPLATE_ID) {
  console.error(
    'SendGrid template ID not set. Please set the TEMPLATE_ID environment variable.'
  )
  process.exit(1)
}

if (!process.env.FROM_ADDRESS) {
  console.error(
    'Email from address not set. Please set the FROM_ADDRESS environment variable.'
  )
  process.exit(1)
}

if (!process.env.FROM_NAME) {
  console.error(
    'Email from name field not set. Please set the FROM_NAME environment variable.'
  )
  process.exit(1)
}

if (!process.env.WATCHERS) {
  console.error(
    'Watchers object not set. Please set the WATCHERS environment variable.'
  )
  process.exit(1)
}

if (
  typeof JSON.parse(process.env.WATCHERS) !== 'object' ||
  JSON.parse(process.env.WATCHERS) === null
) {
  console.error(
    'Watchers should be an object mapping emails to nicknames. Please set the WATCHERS environment variable.'
  )
  process.exit(1)
}
