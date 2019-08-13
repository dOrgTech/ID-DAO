pragma solidity ^0.5.0;

import "./IVerifyHuman.sol";

contract HumanContract is IVerifyHuman {

    /**
     * @dev Throws if not called by a human.
     */
    modifier onlyHuman() {
        require(isHuman(msg.sender), "Sender is not a human");
        _;
    }

    /**
     * @dev An abstract function which must be implemented, which determines
     * whether a passed address is human or not.
     * 
     * @param id address Address to check
     * @return bool Human status of address
     */
    function isHuman(address id) public view returns (bool);
}

