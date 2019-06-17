
// File: contracts/IdentityRegistryInterface.sol

pragma solidity ^0.5.0;

/**
 * IdentityRegistry interface.
 *
 */
interface IdentityRegistryInterface {

    function addIdentity(address addressID, string calldata name, bool isRegistered, string calldata metadataURI, bytes calldata metadata) external;
    function removeIdentity(address addressID, string calldata name, bool isRegistered, string calldata metadataURI, bytes calldata metadata) external;
    function updateIdentity(address addressID, string calldata name, bool isRegistered, string calldata metadataURI, bytes calldata metadata) external;
    function isUniqueIdentity(address addressID) external view returns (bool);
 
}

