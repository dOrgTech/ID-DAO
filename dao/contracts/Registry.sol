pragma solidity ^0.5.0;

import "./IRegistry.sol";

/**
 * @title Generic Registry Contract
 * @author Luis Dominguez <ld@luis.sh>
 * @dev This is a very basic contract which acts as a simple store for addresses, with CRUD.
 * Public-facing functions are seperated from internal functions, one dedicated
 * to logic in exposing functionality, the other for the actual logic.
 *
 * Any extra data can be passed as bytes, which allows for complete flexibility.
 */

contract Registry is IRegistry {

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
      Functions of Registry, exposing functionality of internals
    */

    /**
     * @dev Simple add function, adds an address along with metadata associated with the identity.
     * Public interface for _add().
     *  
     * @param id address Address to add
     * @param metadata bytes Metadata to link to the address
     */
    function add(
        address id,
        bytes memory metadata
    ) public {
        _add(id, metadata);
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
     */
    function update(
        address id,
        bytes memory metadata
    ) public {
        _update(id, metadata);
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
     */
    function _add(
        address id,
        bytes memory metadata
    ) internal {
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
     */
    function _update(
        address id,
        bytes memory metadata
    ) internal {
        emit Update(id, registry[id], metadata);
        registry[id] = metadata;
    }

}
