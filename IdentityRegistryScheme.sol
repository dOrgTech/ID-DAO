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
  event ProposalDeleted(bytes32 indexed _proposalID, ProposalType _proposalType)

  struct IdentityProposal {
    bytes32 proposalID;
    ProposalType proposalType;
    bytes32 values; //Encoded values of proposal, as is different depending on function    
  }

  // Mapping the address of proposer to proposals
  // In this paradigm, we store sets of proposal IDs per proposer should this be simply ID => IdentityProposal, keeping proposer in struct?
  mapping(address => mapping(bytes32 => IdentityProposal)) public identityProposals;

  function getProposal(address proposer, bytes32 proposalID) public view returns (ProposalType, bytes32){
    IdentityProposal memory proposal = identityProposals[proposer][proposalID];
    return (proposal.proposalType, proposal.values);
  }

}

*/
