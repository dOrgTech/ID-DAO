pragma solidity ^0.5.0;

import "./IRegistry.sol";
import "./IVerifyHuman.sol";
import "openzepplin-eth/contracts/ownership/Ownable.sol";

contract IdentityRegistry is Ownable, IRegistry, IVerifyHuman {

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

    modifier onlyHuman(bytes id) {
        require(isHuman(id), "ID provided is not a human");
        _;
    }

    function add(
        address id,
        bytes memory metadata
    ) public onlyOwner onlyHuman(id) {
        emit Add(id, metadata);
        registry[id] = metadata;
    }

    function remove(address id) public onlyOwner onlyHuman(id) {
        emit Remove(id, registry[id]);
        delete registry[id];
    }

    function update(
        address id,
        bytes memory metadata
    ) public onlyOwner onlyHuman(id) {
        emit Update(id, registry[id], metadata);
        registry[id] = metadata;
    }

    function isHuman(address id) public view returns(bool) {
        return registry[identity] != bytes(0);
    }
}
