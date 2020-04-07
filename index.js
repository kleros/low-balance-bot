// Run env variable checks.
require('./utils/env-check')

const ethers = require('ethers')
const level = require('level')

const bot = require('./bots/low-balance')

// Setup provider contract instance.
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL)

// Open DB
const db = level('./db')

console.info('Booting...')
const runBots = async () => {
  console.info('')
  console.info('Checking alarms...')
  const [network] = await Promise.all([provider.getNetwork()])

  const { name: chainName, chainId } = network
  console.info('Network:', chainName)
  console.info('')

  const wallets = JSON.parse(process.env.WALLETS)

  wallets.forEach(({ address, message, thresholdETH }) =>
    bot({
      provider,
      walletAddress: address,
      message,
      thresholdETH,
      chainName,
      chainId,
      db
    })
  )
}

runBots() // Run bots on startup.
setInterval(
  runBots,
  process.env.POLL_INTERVAL_MILLISECONDS
    ? Number(process.env.POLL_INTERVAL_MILLISECONDS)
    : 5 * 60 * 1000 // Default, 5 minutes
)
