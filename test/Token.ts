import { expect } from "chai";
import { network } from "hardhat";
import type { MyToken } from "../types/ethers-contracts/index.js";

const { ethers } = await network.connect();

describe("Token", function () {
  let token: MyToken;

  beforeEach(async function () {
    token = await deploy();
  });

  async function deploy() {
    const [deployer] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy(deployer);
    return token;
  }

  describe("deploy", function () {
    it("should be named MyToken", async function () {
      expect(await token.name()).to.eq("MyToken");
    });
    it("should have MTK symbol", async function () {
      expect(await token.symbol()).to.eq("MTK");
    });
    it("should have a total supply of 100,000", async function () {
      expect(await token.totalSupply()).to.eq(
        ethers.parseEther("100000")
      );
    });
    it("should mint total supply to deployer", async function () {
      const [deployer] = await ethers.getSigners();
      expect(await token.balanceOf(deployer.address)).to.eq(
        ethers.parseEther("100_000")
      );
    });
  });
});
