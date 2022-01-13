const chalk = require('chalk')

function dim() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.dim.call(chalk, ...arguments))
  }
}

function cyan() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.cyan.call(chalk, ...arguments))
  }
}

function yellow() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.yellow.call(chalk, ...arguments))
  }
}

function green() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.green.call(chalk, ...arguments))
  }
}

function displayResult(name, result) {
  if (!result.newlyDeployed) {
    yellow(`Re-used existing ${name} at ${result.address}`)
  } else {
    green(`${name} deployed at ${result.address}`)
  }
}

const chainName = (chainId) => {
  switch(chainId) {
    case 1: return 'Mainnet';
    case 3: return 'Ropsten';
    case 4: return 'Rinkeby';
    case 5: return 'Goerli';
    case 42: return 'Kovan';
    case 56: return 'Binance Smart Chain';
    case 77: return 'POA Sokol';
    case 97: return 'Binance Smart Chain (testnet)';
    case 99: return 'POA';
    case 100: return 'xDai';
    case 137: return 'Matic';
    case 31337: return 'HardhatEVM';
    case 80001: return 'Matic (Mumbai)';
    default: return 'Unknown';
  }
}

module.exports = async (hardhat) => {
  const { getNamedAccounts, deployments, getChainId, ethers } = hardhat
  const { deploy } = deployments

  const harnessDisabled = !!process.env.DISABLE_HARNESS

  let {
    deployer,
    rng,
    admin,
    sablier,
    reserveRegistry,
    testnetCDai
  } = await getNamedAccounts()
  const chainId = parseInt(await getChainId(), 10)
  // 31337 is unit testing, 1337 is for coverage
  const isTestEnvironment = chainId === 31337 || chainId === 1337

  const signer = await ethers.provider.getSigner(deployer)

  dim("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
  dim("PoolTogether Pool Contracts - Deploy Script")
  dim("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n")

  dim(`network: ${chainName(chainId)} (${isTestEnvironment ? 'local' : 'remote'})`)
  dim(`deployer: ${deployer}`)
  if (!admin) {
    admin = signer._address
  }
  dim("admin:", admin)


    const contract = await hardhat.ethers.getContractAt(
      "PeriodicPrizeStrategy",
      "0x5626012be177b0fcecfeb44447f63f7cfae0f6dd",
      signer
    )
    //if (admin !== deployer) {
     const value = await contract.transferOwnership("0x546e972b48B83c0fEaE843ffb55A2F1D8897Eb7B")
dim("NTT value:", value)
    //}


  dim("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
  green("Contract Deployments Complete!")
  dim("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n")

};
