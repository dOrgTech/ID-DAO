pragma solidity ^0.5.4;

interface IVerifyHuman {
  function isHuman(address id) external view returns (bool);
}
