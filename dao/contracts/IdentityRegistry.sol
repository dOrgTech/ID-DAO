pragma solidity ^0.5.0;

import "./registry/Registry.sol";
import "./human/HumanContract.sol";
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

/**
 * @title IdentityRegistry
 * @author Luis Dominguez <ld@luis.sh>, Jordan Ellis <jelli@dorg.tech>
 * 
 * @dev An Identity Registry contract built off of Registry. Re-exposes functionality
 * in restricting it to the owner. Additional removeSelf() function added, allowing for
 * any registered identity to remove themselves as they wish.
 */
contract IdentityRegistry is Registry, Ownable, HumanContract {

    function add(
        address id,
        bytes memory metadata
    ) public onlyOwner {
        _add(id, metadata);
    }

    function remove(address id) public onlyOwner {
        _remove(id);
    }

    function update(
        address id,
        bytes memory metadata
    ) public onlyOwner {
        _update(id, metadata);
    }


    function removeSelf() public {
        _remove(msg.sender);
    }

    function isHuman(address id) public view returns (bool) {
        return registry[id].length != 0;
    }
}
