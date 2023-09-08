const { ethers, getNamedAccounts, network } = require("hardhat");
const bigDecimal = require("js-big-decimal");
const decim = new bigDecimal(10 ** 18);
async function checkPrice(amountEthToSwap, token1, token2, fee) {
  const swapPath = await createPath(token1, token2, fee);
  const Quoter = await getQuoter();
  const amount = new bigDecimal(
    (
      await Quoter.callStatic.quoteExactInput(
        swapPath,
        amountEthToSwap.getValue()
      )
    ).toString()
  );
  const decim = new bigDecimal(10 ** 18);
  const token2Amount = amount.divide(decim);
  const token1Amount = amountEthToSwap.divide(decim);
  // console.log(
  //   `Trading ${token1Amount.getValue()} of ${await token1.symbol()} will get you ${token2Amount.getValue()} of ${await token2.symbol()}`
  // );
  return amount;
}
async function getQuoter() {
  const QuoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
  const Quoter = await ethers.getContractAt("IQuoter", QuoterAddress);
  return Quoter;
}
function createPath(token1, token2, poolFee) {
  const swapPath = ethers.utils.solidityPack(
    ["address", "uint24", "address"],
    [token1.address, poolFee, token2.address]
  );
  return swapPath;
}
async function getPoolAddress(token1, token2) {
  const FEE_LEVELS = [100, 500, 3000, 10000];
  let goodFee = [];
  let goodPools = [];
  const V3Factory = await getFactory();
  for (let i = 0; i < 4; i++) {
    const poolAddress = await V3Factory.getPool(
      token1.address,
      token2.address,
      FEE_LEVELS[i]
    );
    if (poolAddress !== "0x0000000000000000000000000000000000000000") {
      // console.log(
      //   `The fee level of ${FEE_LEVELS[i]} has address ${poolAddress}`
      // );
      const feeLevel = FEE_LEVELS[i];
      goodPools.push({ poolAddress, feeLevel });
    }
  }
  return goodPools;
}
async function getLiquidity(pool) {
  const liquidity = await pool.liquidity();
  return liquidity;
}
async function getPool(poolAddress) {
  const V3Pool = await ethers.getContractAt("IUniswapV3Pool", poolAddress);
  return V3Pool;
}
async function getFactory() {
  const UniV3FactoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
  const V3Factory = await ethers.getContractAt(
    "IUniswapV3Factory",
    UniV3FactoryAddress
  );
  return V3Factory;
}
async function getERC20(tokenAddress) {
  const erc20 = await ethers.getContractAt("IERC20", tokenAddress);
  return erc20;
}
async function compareOutputs(GDAI, amountETHToSwap, token1, token2, fee) {
  const gdaiAMOUNT = await checkPrice(amountETHToSwap, token1, token2, fee);
  const daiAMOUNT = new bigDecimal(
    await GDAI.convertToAssets(gdaiAMOUNT.getValue())
  );
  console.log(
    `You would provide ${amountETHToSwap
      .divide(decim)
      .getValue()} DAI to swap for ${gdaiAMOUNT
      .divide(decim)
      .getValue()} GDAI which can be exchanged for ${daiAMOUNT
      .divide(decim)
      .getValue()}DAI`
  );

  console.log(
    `You would profit: ${daiAMOUNT
      .subtract(amountETHToSwap)
      .divide(decim)
      .getValue()}`
  );
  return daiAMOUNT;
}
module.exports = {
  getQuoter,
  getLiquidity,
  getPool,
  getPoolAddress,
  getFactory,
  getERC20,
  createPath,
  checkPrice,
  compareOutputs,
};
