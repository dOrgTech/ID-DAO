pragma solidity ^0.5.0;

import "./IIdentityRegistry.sol";

/**
 *
 * IdentityRegistry base contract. Contains basic mapping of identities, along with add/remove/update functions.
 * 
 * NOTE: Potential to refactor this into a library?
 *
 */
contract IdentityRegistry is IIdentityRegistry {

    event Register(
        address indexed _identity,
        string _name,
        bool _isRegistered,
        string _metadataURI,
        bytes _metadata
    );

    event UnRegister(
        address indexed _identity
    );

    event IdentityUpdated(
        address indexed _addressID,
        string _name,
        bool _isRegistered,
        string _metadataURI,
        bytes _metadata
    );

    //This may be defined in interface
    struct Identity {
        string name;
        bool isRegistered; //perhaps better retitled, isUnique?
        string metadataURI; //For IPFS, such as for images
        bytes metadata; //Perhaps include metadata URI hash to check for manipulation?
    }

    address identityRegistryScheme;
    mapping (address => Identity) identityRegistry;

    /**
     * Initialize identityDAO "owner" upon creation.
     * NOTE: Potentially extend OpenZeppelin Ownable.sol as well, keeping identityDAO field?
     */
    constructor(address _identityDAO) public {
        identityDAO = _identityDAO;
    }

    /* Public-facing functions */

    function addIdentity(address addressID, string memory name, bool isRegistered, string memory metadataURI, bytes memory metadata) public onlyIdentityRegistryScheme {
        _addIdentity(addressID, name, isRegistered, metadataURI, metadata);    
    }


    function removeIdentity(address addressID) public onlyIdentityRegistryScheme {
        _removeIdentity(addressID);
    }


    function updateIdentity(address addressID, string memory name, bool isRegistered, string memory metadataURI, bytes memory metadata) public onlyIdentityRegistryScheme {
        _updateIdentity(addressID, name, isRegistered, metadataURI, metadata);
    }

    function isUniqueIdentity(address identity) public view returns (bool){
        return identityRegistry[identity].isRegistered;
    }

    /* Internal functions */

    function _addIdentity(address addressID, string memory name, bool isRegistered, string memory metadataURI, bytes memory metadata) internal {
        require(!isUniqueIdentity(addressID));
        emit IdentityAdded(addressID, name, isRegistered, metadataURI, metadata); //Emit beforehand for Checks-Effects-Interactions safety
        identityRegistry[addressID] = Identity(name, isRegistered, metadataURI, metadata);
    }

    function _removeIdentity(address addressID) internal {
        require(isUniqueIdentity(addressID)); 
        emit IdentityRemoved(addressID);
        delete identityRegistry[addressID];
        //Perhaps something like `require(identityRegistry[addressID].isRegistered == false)` as a backup measure?
    }

    function _updateIdentity(address addressID, string memory name, bool isRegistered, string memory metadataURI, bytes memory metadata) internal {
        require(isUniqueIdentity(addressID));
        emit IdentityUpdated(addressID, name, isRegistered, metadataURI, metadata);
        identityRegistry[addressID] = Identity(name, isRegistered, metadataURI, metadata); 
    }

    modifier onlyUniqueSender {
        require(isUniqueIdentity(msg.sender));
        _;
    }

    modifier onlyIdentityRegistryScheme {
        require(msg.sender == identityRegistryScheme);
        _;
    }
}
