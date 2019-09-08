pragma solidity ^0.5.0;

/**
 * @title ISignedRegistry
 * @author Luis Dominguez <ld@luis.sh>, Jordan Ellis <jelli@dorg.tech>
 *
 * @dev Required interface for a Registry contract.
 */
interface ISignedRegistry {
    function add(address id, bytes calldata metadata, bytes calldata sig) external;
    function remove(address id) external;
    function update(address id, bytes calldata metadata, bytes calldata sig) external;
}
