pragma solidity ^0.5.4;

/**
 * @title IRegistry
 * @author Luis Dominguez <ld@luis.sh>, Jordan Ellis <jelli@dorg.tech>
 * 
 * @dev Required interface for a Registry contract.
 */

interface IRegistry {
    function add(address id, bytes calldata metadata) external;
    function remove(address id) external;
    function update(address id, bytes calldata metadata) external;
}
