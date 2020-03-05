pragma solidity >=0.4.21 <0.7.0;

contract MyContract {

  event Transfer(address indexed from, address indexed to, uint256 value); /* This is an event */
  function transfer(address _to) public payable {
    emit Transfer(msg.sender, _to, msg.value);
  }
}