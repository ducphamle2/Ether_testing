const Web3 = require('web3') // Web3 0.20.4 or web3 1 beta
const truffleContract = require("truffle-contract")
const contractArtifact = require('./build/contracts/MyContract.json')

const providerUrl = 'http://localhost:8545'
const provider = new Web3.providers.HttpProvider(providerUrl)

const contract = truffleContract(contractArtifact)
contract.setProvider(provider)

// dirty hack for web3@1.0.0 support for localhost testrpc, see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
if (typeof contract.currentProvider.sendAsync !== "function") {
  contract.currentProvider.sendAsync = function() {
      return contract.currentProvider.send.apply(
        contract.currentProvider,
            arguments
      );
    };
  }

contract.deployed()
  .then(contractInstance => {
    contractInstance.events.Transfer({
      filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
      fromBlock: 0
    }, function(error, event){ console.log(event); })
    .on('data', function(event){
        console.log(event); // same results as the optional callback above
    })
    .on('changed', function(event){
      // remove event from local database
    })
  .on('error', console.error);
  })
  .catch(e => {
    console.error('Catastrophic Error!')
    console.error(e)
  })