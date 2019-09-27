pragma solidity ^0.5.0;

import "@daostack/infra/contracts/Reputation.sol";
import "@daostack/arc/contracts/universalSchemes/UniversalScheme.sol";
import "./IdentityRegistry.sol";

contract HumanReputationClaim is UniversalScheme {

  event HumanReputationClaimed(
    address indexed _avatar,
    address indexed _human,
    uint256 _amount
  );

  // A registry of humans
  IdentityRegistry public registry;

  // Flag letting us know if a user has claimed before
  // (Avatar=>Human=>Claimed)
  mapping(address=>mapping(address=>bool)) public claimed;

  struct Parameters {
    uint256 claimAmount;
  }

  mapping(bytes32=>Parameters) public parameters;

  constructor(IdentityRegistry _registry) public {
    registry = _registry;
  }

  function claim(Avatar _avatar, address _human) public returns(uint256 reputation) {
    require(registry.isHuman(_human), "human is not registered");

    // Fetch the amount of reputation the human is claiming.
    reputation = parameters[getParametersFromController(_avatar)].claimAmount;

    require(
      claimed[address(_avatar)][_human] == false,
      "human has already claimed reputation"
    );
    require(
      ControllerInterface(_avatar.owner()).mintReputation(
        uint(reputation), _human, address(_avatar)
      ),
      "failed to mintReputation"
    );

    claimed[address(_avatar)][_human] = true;
    emit HumanReputationClaimed(address(_avatar), _human, reputation);
  }

  function hasClaimed(Avatar _avatar, address _human) public view returns(bool) {
    return claimed[address(_avatar)][_human];
  }

  function setParameters(uint256 _claimAmount) public returns(bytes32 paramsHash) {
    paramsHash = getParametersHash(_claimAmount);
    parameters[paramsHash].claimAmount = _claimAmount;
  }

  function getParametersHash(uint256 _claimAmount) public pure returns(bytes32) {
    return keccak256(abi.encodePacked(_claimAmount));
  }
}
