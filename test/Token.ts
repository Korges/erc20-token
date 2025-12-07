import { expect } from "chai";
import { network } from "hardhat";
import type { MyToken } from "../types/ethers-contracts/index.ts";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/types";

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
    it("should have a total supply of 1000", async function () {
      expect(await token.totalSupply()).to.eq(ethers.parseEther("1000"));
    });
    it("should mint total supply to deployer", async function () {
      const [deployer] = await ethers.getSigners();
      expect(await token.balanceOf(deployer.address)).to.eq(
        ethers.parseEther("1000")
      );
    });
  });

  describe("transfer", function () {
    const amount = ethers.parseEther("100");

    it("should transfer amount", async function () {
      const [from, to] = await ethers.getSigners();
      await expect(token.transfer(to.address, amount)).to.changeTokenBalances(
        ethers,
        token,
        [from, to],
        [-amount, amount]
      );
    });
    it("should transfer amount from a specific account", async function () {
      const [deployer, account0, account1] = await ethers.getSigners();
      // first we will transfer 100 to account0 (from the deployer)
      await token.transfer(account0.address, amount);
      // next, we need to connect as account0 and approve
      // the approval will allow the deployer to send tokens
      // on behalf of account0
      await token.connect(account0).approve(deployer.address, amount);
      // last, we will use transferFrom to allow the deployer to
      // transfer on behalf of account0
      await expect(
        token.transferFrom(account0.address, account1.address, amount)
      ).to.changeTokenBalances(
        ethers,
        token,
        [deployer, account0, account1],
        [0, -amount, amount]
      );
    });
  });

  describe("claim", async function () {
    let account0: HardhatEthersSigner;

    beforeEach(async function () {
      [, account0] = await ethers.getSigners();
    });

    it("should allow user to claim tokens once", async function () {
      await token.connect(account0).claim();

      const balance = await token.balanceOf(account0.address);
      expect(balance).to.equal(await token.CLAIM_AMOUNT());

      const claimed = await token.claimedBy(account0.address);
      expect(claimed).to.be.true;

      const claimedSupply = await token.claimedSupply();
      const circulatingSupply = await token.circulatingSupply();
      expect(claimedSupply).to.equal(await token.CLAIM_AMOUNT());
      expect(circulatingSupply).to.equal(
        (await token.CLAIM_AMOUNT()) + (await token.OWNER_SUPPLY())
      );
    });

    it("should revert if user tries to claim twice", async function () {
      await token.connect(account0).claim();

      await expect(token.connect(account0).claim()).to.be.revertedWith(
        "Already claimed"
      );
    });
  });
});
