require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const { API_URL_KOVAN, API_URL_MUMBAI, PRIVATE_KEY, ETHERSCAN_TOKEN, POLYGONSCAN_API_KEY } = process.env;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.7",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    kovan: {
      url: API_URL_KOVAN,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    mumbai: {
      url: API_URL_MUMBAI,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  etherscan: {
    //Mumbai
    apiKey: POLYGONSCAN_API_KEY
    // // for kovan
    // apiKey: ETHERSCAN_TOKEN
  }
};