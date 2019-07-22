pragma solidity ^0.5.0;

import "./Registry.sol";
import "./IVerifyHuman.sol";
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract IdentityRegistry is Registry, Ownable, IVerifyHuman {

    modifier onlyHuman(address id) {
        require(isHuman(id), "ID provided is not a human");
        _;
    }

    function add(
        address id,
        bytes memory metadata
    ) public onlyOwner onlyHuman(id) {
        _add(id, metadata);
    }

    function remove(address id) public onlyOwner onlyHuman(id) {
        _remove(id);
    }

    function update(
        address id,
        bytes memory metadata
    ) public onlyOwner onlyHuman(id) {
        _update(id, metadata);
    }


    function removeSelf() public {
        _remove(msg.sender);
    }

    function isHuman(address id) public view returns (bool) {
        return registry[id].length != 0;
    }
}
