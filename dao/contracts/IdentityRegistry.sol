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


    /**
     * @dev Simple add function, adds an address along with metadata associated with the identity.
     * Restricted to owner.
     *  
     * @param id address Address to add
     * @param metadata bytes Metadata to link to the address
     */
    function add(
        address id,
        bytes memory metadata
    ) public onlyOwner {
        _add(id, metadata);
    }

    /**
     * @dev Simple remove function, removes an address along with metadata associated with the identity.
     * Restricted to owner.
     * 
     * @param id address Address to delete
     */
    function remove(address id) public onlyOwner {
        _remove(id);
    }

    /**
     * @dev Simple update function, updates an address along with metadata associated with the identity.
     * Restricted to owner.
     * 
     * @param id address Address to update
     * @param metadata bytes Metadata to link to the address
     */
    function update(
        address id,
        bytes memory metadata
    ) public onlyOwner {
        _update(id, metadata);
    }


    /**
     * @dev Allows a registeredidentity to remove themselves from the registry.
     * Restricted to registered identity. 
     */
    function removeSelf() public onlyHuman {
        _remove(msg.sender);
    }

    /**
     * @dev Determines whether a passed address is human or not. Checks existence in registry to determine this.
     * 
     * @param id address Address to check
     * @return bool Human status of address
     */
    function isHuman(address id) public view returns (bool) {
        return registry[id].length != 0;
    }
}
