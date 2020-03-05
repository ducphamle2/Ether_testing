var HelloWorld = artifacts.require("MyContract");

module.exports = function(deployer) {
  deployer.deploy(HelloWorld);
};