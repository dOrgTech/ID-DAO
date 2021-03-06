# IdentityRegistry Contracts
![GitHub package.json version](https://img.shields.io/badge/version-v1.0.0-g)
[![CircleCI](https://circleci.com/gh/dOrgTech/ID-DAO/tree/dev.svg?style=svg)](https://circleci.com/gh/dOrgTech/ID-DAO/tree/dev)
[![codecov](https://codecov.io/gh/dOrgTech/ID-DAO/branch/dev/graph/badge.svg)](https://codecov.io/gh/dOrgTech/ID-DAO)

The **IdentityRegistry** is responsible for keeping a record of humans the DAO has verified. Functions dealing with adding, updating, and removing users are thus restricted to the DAO's Avatar, which acts as the contract's "owner".

### Usage

To test these contracts,
  * Deploy a test blockchain via `npm run chain`
  * Run tests via `npm test`

Linting scripts are also included, and are briefly described below:
  * `lint` - Lint all source files (.sol and .ts)
  * `lint:js` - Lint all TypeScript files with ESLint
  * `lint:sol:` - Lint all Solidity `.sol` contracts with solhint

Code coverage is provided thanks to [solidity-coverage](https://github.com/sc-forks/solidity-coverage):
  * `coverage` - Run code coverage of all smart contracts

### Deployment

All that is needed to set up deployment configuration with Infura is a .env file, with the following:

```
INFURA_KEY="INSERT_INFURA_KEY_HERE"
MNEMONIC="INSERT_MNEMONIC_HERE"
```

Only deployment to the Rinkeby test network is currently set up, which can be accomplished through the following command:
  * `truffle migrate --network rinkeby`
