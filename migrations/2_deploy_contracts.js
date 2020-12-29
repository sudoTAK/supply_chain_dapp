// var FarmerRole = artifacts.require("FarmerRole");
// var DistributorRole = artifacts.require("DistributorRole");
// var RetailerRole = artifacts.require("RetailerRole");
// var ConsumerRole = artifacts.require("ConsumerRole");
var SupplyChain = artifacts.require("SupplyChain");

// migrating the appropriate contracts
module.exports = function (deployer) {
  deployer.deploy(SupplyChain); //no need to deploy other, SupplyChain inherits all other already.
};
