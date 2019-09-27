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

  constructor(IdentityRegistry _registry) public {
    registry = _registry;
  }

  function claim(Avatar _avatar, address _human) public returns(uint256 reputation) {
    require(registry.isHuman(_human), "human is not registered");

    // Fetch the amount of reputation the human is claiming.
    // As an optimization, this is simply stored in the controller
    // as this scheme's params, instead of doing the typical hashing and storing.
    reputation = uint256(getParametersFromController(_avatar));

    require(reputation > 0, "reputation must be greater than 0");
    require(
      _avatar.nativeReputation().balanceOf(_human) == 0,
      "human has already claimed reputation"
    );
    require(
      ControllerInterface(_avatar.owner()).mintReputation(
        uint(reputation), _human, address(_avatar)
      ),
      "failed to mintReputation"
    );
  }
}
