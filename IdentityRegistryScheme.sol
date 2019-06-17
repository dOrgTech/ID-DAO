/*

Psuedocode:


import './IdentityRegistryInterface.sol'

contract IdentityRegistryScheme is UniversalScheme, VotingMachineCallbacks, ProposalExecuteInterface {

  enum ProposalType { ADD, REMOVE, UPDATE }
  address identityRegistryAddress;

  event AddIdentityProposal(bytes32 indexed _proposalID, address _addressID, string _name, bool _isRegistered, string _metadataURI, bytes _metadata)
  event RemoveIdentityProposal(bytes32 indexed _proposalID, address _addressID, string _name, bool _isRegistered, string _metadataURI, bytes _metadata))
  event UpdateIdentityProposal(indexed _proposalID, address _addressID)

  event ProposalExecuted(bytes32 indexed _proposalID, ProposalType _proposalType)
  //TO-DO: Exactly what information should we emit here? Should we expect the proposal to go through? Also, what is advantage of deleting? Should we just edit a bool flag, cheaper gas?
  event ProposalDeleted(bytes32 indexed _proposalID, ProposalType _proposalType)

  struct IdentityProposal {
    bytes32 proposalID;
    address proposer;
    ProposalType proposalType;
    bytes32 values; //Encoded values of proposal, as is different depending on function    
  }

  // Mapping the address of proposer to proposals
  // In this paradigm, we simply store ID => IdentityProposal, keeping proposer in struct
  mapping(bytes32 => IdentityProposal) public identityProposals;

  function getProposal(address proposer, bytes32 proposalID) public view returns (ProposalType, bytes32){
    IdentityProposal memory proposal = identityProposals[proposer][proposalID];
    return (proposal.proposalType, proposal.values);
  }

  function proposeToAddIdentity(address addressID, string memory name, bool isRegistered, string memory metadataURI, bytes memory metadata) returns (bytes32)
  function proposeToRemoveIdentity(address addressID) returns (bytes32)
  function proposeToUpdateIdentity(address addressID, string memory name, bool isRegistered, string memory metadataURI, bytes memory metadata) (bytes32)

  function executeProposal(bytes32 proposalID) external onlyVotingMachine() returns(bool) {
    
    IdentityProposal memory proposal = identityProposals[proposalID];
    _deleteProposal(proposalID);
    if(proposal.proposalType == ProposalType.ADD) {
      IdentityRegistryInterface i = IdentityRegistryInterface(identityRegistryAddress);
      //decode params here
      
    }
    
  }

  function _deleteProposal(bytes32 proposalID) internal returns (bool) {
    ProposalType proposalType = identityProposals[proposalID]
    delete identityProposals[proposalID];
    emit DeleteProposal(proposalID);
  }


}

*/
