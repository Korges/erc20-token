// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract MyToken is ERC20, ERC20Permit {
    constructor(address recipient) ERC20("MyToken", "MTK") ERC20Permit("MyToken") {
        _mint(recipient, 100_000 * 10 ** decimals());
    }
}