const oxyCoin = artifacts.require('OxyCoin.sol');

module.exports = function(deployer,network,accounts) {
  deployer.deploy(oxyCoin);   
};
