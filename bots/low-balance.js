const {
  ethers: {
    utils: { parseEther, formatEther }
  }
} = require('ethers')

const alarm = require('../utils/alarm')

// Sends out email to WATCHERS, if the a wallet balance falls below a threshold.
module.exports = async ({
  provider,
  message,
  thresholdETH,
  walletAddress,
  chainName,
  chainId,
  db
}) => {
  let balance
  try {
    balance = await provider.getBalance(walletAddress)
    console.info('Balance:', formatEther(balance), 'Ξ')
  } catch (err) {
    console.error('Error fetching wallet balance.')
    throw err
  }

  const threshold = thresholdETH ? parseEther(thresholdETH) : parseEther('0.05')

  // Do we have enough funds?
  if (balance.gt(threshold)) return

  // Did 48 hours pass since the last alarm?
  let lastAlarmTime = 0
  try {
    lastAlarmTime = await db.get(walletAddress)
  } catch (err) {
    if (err.type !== 'NotFoundError') throw new Error(err)
  }

  const nowHours = Date.now() / 1000 / 60 / 60
  const period = process.env.ALARM_PERIOD_HOURS
    ? Number(process.env.ALARM_PERIOD_HOURS)
    : 24 * 3
  if (nowHours - lastAlarmTime < period) return

  console.info('Wallet balance is below threshold.')
  console.info('Balance threshold:', thresholdETH, 'ETH')

  await db.put(walletAddress, JSON.stringify(nowHours))
  alarm({
    subject: 'Warning: Wallet is running low on ETH',
    message: `the wallet ${walletAddress} is running low on ETH.
    <br>
    <br>${message}
    <br>
    <br>The bot will stop complaining if the wallet balance is above ${thresholdETH} Ξ.
    <br>Balance when this email was dispatched: ${formatEther(balance)} Ξ.`,
    chainName,
    chainId,
    templateId: process.env.TEMPLATE_ID,
    secondary: walletAddress
  })
}
