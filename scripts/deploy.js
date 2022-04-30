const hre = require("hardhat");

async function main() {
  const Ethablish = await hre.ethers.getContractFactory("Ethablish");
  const ethablish = await Ethablish.deploy();

  await ethablish.deployed();

  console.log("Ethablish deployed to:", ethablish.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
