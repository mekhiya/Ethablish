const hre = require("hardhat");

async function main() {
  const Ethablish = await hre.ethers.getContractFactory("Ethablish");
  //Param is trusted forwarder - biconomy - EIP2771
  const ethablish = await Ethablish.deploy("0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b");

  await ethablish.deployed();

  console.log("Ethablish deployed to:", ethablish.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
