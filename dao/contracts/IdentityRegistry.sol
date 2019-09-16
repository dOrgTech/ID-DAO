pragma solidity ^0.5.0;

import "./registry/SignedRegistry.sol";
import "./human/HumanContract.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

/**
 * @title IdentityRegistry
 * @author Luis Dominguez <ld@luis.sh>, Jordan Ellis <jelli@dorg.tech>
 *
 * @dev An Identity Registry contract built off of Registry. Re-exposes functionality
 * in restricting it to the owner. Additional removeSelf() function added, allowing for
 * any registered identity to remove themselves as they wish.
 */
contract IdentityRegistry is SignedRegistry, Ownable, HumanContract {

    /**
     * @dev Simple add function, adds an address along with metadata associated with the identity.
     * Restricted to owner.
     *
     * @param id address to add
     * @param metadata a hash of the identity metadata definition
     * @param sig the user's signature over this metadata
     */
    function add(
        address id,
        bytes memory metadata,
        bytes memory sig
    ) public onlyOwner {
        _add(id, metadata, sig);
    }

    /**
     * @dev Simple update function, updates an address along with metadata associated with the identity.
     * Restricted to owner.
     *
     * @param id address to update
     * @param metadata a hash of the identity metadata definition
     * @param sig the user's signature over this metadata
     */
    function update(
        address id,
        bytes memory metadata,
        bytes memory sig
    ) public onlyOwner {
        _update(id, metadata, sig);
    }

    /**
     * @dev Simple remove function, removes an address along with metadata associated with the identity.
     * Restricted to owner.
     *
     * @param id address to delete
     */
    function remove(address id) public onlyOwner {
        _remove(id);
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
     * @param id address to check
     * @return bool Human status of address
     */
    function isHuman(address id) public view returns (bool) {
        return registry[id].length != 0;
    }
}
