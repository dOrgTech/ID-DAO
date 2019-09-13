pragma solidity ^0.5.0;

/**
 * @title IVerifyHuman
 * @author Jordan Ellis <jelli@dorg.tech>, Luis Dominguez <ld@luis.sh>
 *
 * @dev Required interface for any contract looking to be compliant with checking for human status of an address.
 */
interface IVerifyHuman {
    function isHuman(address id) external view returns (bool);
}
