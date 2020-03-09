from web3 import Web3
from solc import compile_source

url = "http://127.0.0.1:8545"

web3 = Web3(Web3.HTTPProvider(url))

print('is web3 connected ? ', web3.isConnected())

# read the source file and compile
f = open("smart_contracts/Voting.sol", "r")
contract_source_code = f.read()
f.close()
compiled_sol = compile_source(contract_source_code)

# get the interface of the contract
contract_interface = compiled_sol['<stdin>:Voting']

# get first account and set it as default account to deploy
web3.eth.defaultAccount = web3.eth.accounts[0]
a = web3.eth.accounts[0]
print(a)

# deploy Voting smart contract
Voting = web3.eth.contract(abi=contract_interface['abi'], bytecode=contract_interface['bin'])
# convert into array of byte 32
rama = bytearray('Rama', 'utf-32')
nick = bytearray('Nick', 'utf-32')
jose = bytearray('Jose', 'utf-32')

#submit transaction onto Ethereum
listOfCandidates = [rama, nick, jose]

tx_hash = Voting.constructor(listOfCandidates).transact()
# Wait for the transaction to be mined, and get the transaction receipt
tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)

# Create the contract instance with the newly-deployed address
contract = web3.eth.contract(
    address=tx_receipt.contractAddress,
    abi=contract_interface['abi'],
)

# print the contract
print("contract address: ", tx_receipt.contractAddress)
# Display the default greeting from the contract
print('Total vote for first account: {}'.format(
    contract.functions.totalVotesFor(rama).call()
))