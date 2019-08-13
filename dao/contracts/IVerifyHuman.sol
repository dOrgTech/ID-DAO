pragma solidity ^0.5.4;

/**
 * Required interface for any contract looking to be compliant with checking for human status of an address.
 */

interface IVerifyHuman {
  function isHuman(address id) external view returns (bool);
}
