Web3 = require('web3');
var fs = require('fs');

web3 = new Web3("http://localhost:8545");

web3.eth.getAccounts(console.log);

bytecode = fs.readFileSync('smart_contracts/Voting.bin').toString()

abi = JSON.parse(fs.readFileSync('smart_contracts/Voting.abi').toString())

deployedContract = new web3.eth.Contract(abi)

listOfCandidates = ['Rama', 'Nick', 'Jose']

deployedContract.deploy({ // deploy the contract using one of the 10 accounts as a deployer
    data: bytecode,
    arguments: [listOfCandidates.map(name => web3.utils.asciiToHex(name))]
}).send({
    from: '0xFF940e7Fa464091DC0AF737ca6885631C377A99B',
    gas: 1500000,
    gasPrice: web3.utils.toWei('0.00003', 'ether')
}).then((newContractInstance) => {
    deployedContract.options.address = newContractInstance.options.address
    console.log(newContractInstance.options.address)
}).then(() => {
    deployedContract.methods.totalVotesFor(web3.utils.asciiToHex('Rama')).call(console.log)
}).then(() => {
    deployedContract.methods.voteForCandidate(web3.utils.asciiToHex('Rama')).send({from: '0x3aF2e16C55E802A52a9a558bAf33aba9a73c1464'})
    .then(() => {
        deployedContract.methods.voteForCandidate(web3.utils.asciiToHex('Rama')).send({from: '0x3aF2e16C55E802A52a9a558bAf33aba9a73c1464'})
        .then(() => {
            deployedContract.methods.totalVotesFor(web3.utils.asciiToHex('Rama')).call(console.log)
        })
    })
})