import { network } from "hardhat";
const { ethers } = await network.connect();

async function main() {
  const [deployer] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy(deployer);
  await token.waitForDeployment();

  console.log("MyToken deployed to:", await token.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
