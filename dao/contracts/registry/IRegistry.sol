pragma solidity ^0.5.4;

/**
 * @dev Required interface for a Registry contract.
 */

interface IRegistry {
    function add(address id, bytes calldata metadata) external;
    function remove(address id) external;
    function update(address id, bytes calldata metadata) external;
}
