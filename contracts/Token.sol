// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, ERC20Permit, Ownable {
	// ---------- CONSTANTS ----------
	uint public constant MAX_SUPPLY = 100_000 * 10 ** 18;
  uint public constant OWNER_SUPPLY = 1_000 * 10 ** 18;
	uint public constant CLAIMABLE_SUPPLY = 9_000 * 10 ** 18;
	uint public constant CLAIM_AMOUNT = 100 * 10 ** 18;

	// ---------- STATE ----------
	uint public circulatingSupply = 0;
  uint public claimedSupply = 0;

	mapping(address => bool) public claimedBy;

	// ---------- CONSTRUCTOR ----------
	constructor(
		address owner
	) ERC20("MyToken", "MTK") ERC20Permit("MyToken") Ownable(owner) {
		_mint(owner, OWNER_SUPPLY);
		circulatingSupply += OWNER_SUPPLY;
	}

	// ---------------- USER CLAIM ----------------
	function claim() external {
		require(!claimedBy[msg.sender], "Already claimed");
    require(claimedSupply + CLAIM_AMOUNT <= CLAIMABLE_SUPPLY, "Claimable Supply ended");

    claimedBy[msg.sender] = true;
		circulatingSupply += CLAIM_AMOUNT;
    claimedSupply += CLAIM_AMOUNT;

		_mint(msg.sender, CLAIM_AMOUNT);
	}
}
