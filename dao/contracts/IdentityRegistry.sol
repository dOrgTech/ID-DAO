pragma solidity ^0.5.0;

import "./IRegistry.sol";

contract IdentityRegistry is IRegistry {

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

    mapping (address => bytes) registry;

    function _add(
        address id,
        bytes memory metadata
    ) internal {
        emit Add(id, metadata);
        registry[id] = metadata;
    }

    function _remove(address id) internal {
        emit Remove(id, registry[id]);
        delete registry[id];
    }

    function _update(
        address id,
        bytes memory metadata
    ) internal {
        emit Update(id, registry[id], metadata);
        registry[id] = metadata;
    }

}
