pragma solidity ^0.5.4;

interface IIdentityRegistry {
    function addIdentity(address id, string calldata name, bool isRegistered, string calldata metadataURI, bytes calldata metadata) external;
    function removeIdentity(address id, string calldata name, bool isRegistered, string calldata metadataURI, bytes calldata metadata) external;
    function updateIdentity(address id, string calldata name, bool isRegistered, string calldata metadataURI, bytes calldata metadata) external;
    function isUniqueIdentity(address id) external view returns (bool);
}
