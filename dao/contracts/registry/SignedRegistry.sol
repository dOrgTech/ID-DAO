pragma solidity ^0.5.0;

import "./ISignedRegistry.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

/**
 * @title SignedRegistry
 * @author Luis Dominguez <ld@luis.sh>, Jordan Ellis <jelli@dorg.tech>
 *
 * @dev This is a very basic contract which acts as a simple store for addresses, with CRUD.
 * Public-facing functions are seperated from internal functions, one dedicated
 * to logic in exposing functionality, the other for the actual logic.
 *
 * Any extra data can be passed as bytes, which allows for complete flexibility.
 */
contract SignedRegistry is ISignedRegistry {

    using ECDSA for bytes32;

    event Add(
        address indexed _id,
        bytes indexed _metadata
    );

    event Remove(
        address indexed _id,
        bytes indexed _metadata
    );

    event Update(
        address indexed _id,
        bytes indexed _oldMetadata,
        bytes indexed _newMetadata
    );

    mapping (address => bytes) public registry;

    /**
     * @dev Throws if the data's signature doesn't match the user's public key.
     *
     * @param user address of the signer
     * @param data data being signed
     * @param sig user signed data
     */
    modifier signed(
        address user,
        bytes memory data,
        bytes memory sig
    ) {
        require(user != address(0), "user must not be zero address");
        require(
            keccak256(data).toEthSignedMessageHash().recover(sig) == user,
            "Signature does not match"
        );
        _;
    }

    /**
     * @dev Simple add function, adds an address along with metadata associated with the identity.
     * Public interface for _add().
     *
     * @param id address Address to add
     * @param metadata bytes Metadata to link to the address
     * @param sig the user's signature over this metadata
     */
    function add(
        address id,
        bytes memory metadata,
        bytes memory sig
    ) public {
        _add(id, metadata, sig);
    }

    /**
     * @dev Simple remove function, removes an address along with metadata associated with the identity.
     * Public interface for _remove().
     *
     * @param id address Address to delete
     */
    function remove(address id) public {
        _remove(id);
    }

    /**
     * @dev Simple update function, updates an address along with metadata associated with the identity.
     * Public interface for _update().
     *
     * @param id address Address to update
     * @param metadata bytes Metadata to link to the address
     * @param sig the user's signature over this metadata
     */
    function update(
        address id,
        bytes memory metadata,
        bytes memory sig
    ) public {
        _update(id, metadata, sig);
    }

    /**
      Internal functions
    */

    /**
     * @dev Adds an address along with metadata associated with the identity.
     * Internal logic for adding.
     *
     * @param id address Address to add
     * @param metadata bytes Metadata to link to the address
     * @param sig the user's signature over this metadata
     */
    function _add(
        address id,
        bytes memory metadata,
        bytes memory sig
    ) internal signed(id, metadata, sig) {
        emit Add(id, metadata);
        registry[id] = metadata;
    }

    /**
     * @dev Removes an address along with metadata associated with the identity.
     * Internal logic for deleting.
     *
     * @param id address Address to delete
     */
    function _remove(address id) internal {
        emit Remove(id, registry[id]);
        delete registry[id];
    }

    /**
     * @dev Updates an address along with metadata associated with the identity.
     * Internal logic for updating.
     *
     * @param id address Address to update
     * @param metadata bytes Metadata to link to the address
     * @param sig the user's signature over this metadata
     */
    function _update(
        address id,
        bytes memory metadata,
        bytes memory sig
    ) internal signed(id, metadata, sig) {
        emit Update(id, registry[id], metadata);
        registry[id] = metadata;
    }
}
