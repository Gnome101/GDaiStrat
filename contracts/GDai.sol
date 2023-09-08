// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

interface gDAI {
    function convertToAssets(
        uint256 shares
    ) external view returns (uint256 assets);

    function convertToShares(
        uint256 assets
    ) external view returns (uint256 shares);
}
