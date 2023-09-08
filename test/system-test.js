const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const {
  getQuoter,
  getLiquidity,
  getPool,
  getPoolAddress,
  getERC20,
  createPath,
  checkPrice,
  compareOutputs,
} = require("../utils/tools");
const bigDecimal = require("js-big-decimal");
describe("GDAI Reader", function () {
  const band = ethers.utils.parseEther("1000");
  const stack = ethers.utils.parseEther("10000");
  const brick = ethers.utils.parseEther("100000");
  const hundy = ethers.utils.parseEther("100");
  beforeEach(async () => {
    accounts = await ethers.getSigners(); // could also do with getNamedAccounts
    deployer = accounts[0];
    user = accounts[1];

    // await deployments.fixture(["all"]);

    const GDAIAddy = "0xd85E038593d7A098614721EaE955EC2022B9B91B";
    gDAI = await ethers.getContractAt("gDAI", GDAIAddy);
  });
  it("can use the functions", async () => {
    const assets = await gDAI.convertToAssets("1000");
    console.log(assets.toString());
  });
  it("can check price ", async () => {
    const GDAIAddy = "0xd85E038593d7A098614721EaE955EC2022B9B91B";
    const DAIAddy = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
    GDAI = await getERC20(GDAIAddy);
    DAI = await getERC20(DAIAddy);

    const swapAmount = new bigDecimal(10 ** 18);
    const address = await getPoolAddress(GDAI, DAI);
    console.log();
    //const pool500 = await getPool(address[0].poolAddress);
    // const pool3000 = await getPool(address[1].poolAddress);
    // const pool10000 = await getPool(address[2].poolAddress);

    //console.log((await getLiquidity(pool500)).toString()); // This is the largest one
    //console.log((await getLiquidity(pool3000)).toString());
    //console.log((await getLiquidity(pool10000)).toString());

    const result = await checkPrice(swapAmount, GDAI, DAI, "500");
    console.log(result);
  });
  it("compare outputs 21", async () => {
    const GDAIAddy = "0xd85E038593d7A098614721EaE955EC2022B9B91B";
    const DAIAddy = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
    GDAI = await getERC20(GDAIAddy);
    DAI = await getERC20(DAIAddy);
    fin = 0;
    const increase = new bigDecimal(10000 * 10 ** 18);
    let ratio;
    let bestAmount;
    let swapAmount = new bigDecimal(10000 * 10 ** 18);
    while (fin < 50) {
      const amount = await compareOutputs(gDAI, swapAmount, DAI, GDAI, "500");
      if (ratio < amount.divide(swapAmount)) {
        ratio = amount.divide(swapAmount);
        bestAmount = swapAnount;
      }

      ratio = amount.divide(swapAmount);
      swapAmount = swapAmount.add(increase);
      fin++;
    }
    console.log(ratio.getValue(), bestAmount.getValue());
  });
});
