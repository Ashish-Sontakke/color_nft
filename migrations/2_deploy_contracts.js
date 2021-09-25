const ColorNFT = artifacts.require("ColorNFT");

module.exports = function(deployer) {
  deployer.deploy(ColorNFT);
};
