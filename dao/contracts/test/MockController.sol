pragma solidity ^0.5.0;

import "@daostack/arc/contracts/controller/Controller.sol";

contract MockController is Controller {
  function stub() public pure returns(uint256) {
    return 5;
  }
}
