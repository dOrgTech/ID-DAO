# DAO - Ethereum

[![CircleCI](https://circleci.com/gh/dOrgTech/ID-DAO/tree/dev.svg?style=svg)](https://circleci.com/gh/dOrgTech/ID-DAO/tree/dev)
[![codecov](https://codecov.io/gh/dOrgTech/ID-DAO/branch/dev/graph/badge.svg)](https://codecov.io/gh/dOrgTech/ID-DAO)

## IdentityRegistry Contracts

The **IdentityRegistry** smart contracts are responsible keeping a record of users validated by the DAO as human. Functions dealing with adding, updating, and removing users are thus restricted to the DAO Avatar. Within these contracts, `onlyOwner` is the equivalent and more generic modifier used.

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

