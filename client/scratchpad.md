# Scratchpad

Just some small notes on how I might proceed from here

## General

For client-side library tests, we will need to deploy an instance of our contracts (probably to local chain like Ganache), obtain ABI (does build have this, or will we have to compile?) and connect to it via web3 (how to pass provider?)


1. Run chain (`cd ../dao && npm run chain`)
2. Truffle deploy locally (`truffle migrate --network `)
  (We will have to set up in config here)
3. Initialize web3 to ganache-cli
    ```javascript
      import HDWalletProvider = require('truffle-hdwallet-provider');
      const config = JSON.parse(fs.readFileSync(path.resolve('../dao/config.json')));
      const provider = new HDWalletProvider(config.seed, 'http://localhost:8545', 0, 10);
      const web3 = new Web3(provider);
    ``` 
&ast;

4. Interact with chain as we want! (But, what about ABI...?)
  (ahhh, ok, build/contracts/IdentityRegistry.json yields us our ABI!!! :D)
  (so, something like:) 
    ```javascript
      const idRegBuild = fs.readFileSync(path.resolve('../dao/build/contracts/IdentityRegistry.json'));
  
      //How to get address...? Hmmm... we know that our first account (master) will have deployed it, so web3 to look for the thing
      //Check out: https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html#getpastlogs

      const IdentityRegistry = web3.eth.Contract(idRegBuild.abi, address);
      //Wait, darn, where to get address?
      //Oh, consistent seed phrase? Like: "manual glass van agent able hedgehog moment oyster uniform arrange art charge"
    ``` 

This should be pretty straightforward... ok

&ast;NOTE: ../dao/options.json:

```javascript
{
  seed: 'manual glass van agent able hedgehog moment oyster uniform arrange art charge'
}
```
Make sure to load this into `ganache-cli` at `npm run chain`.

## Implementation

Run chain as command within local package.json `"scripts" { "chain": "cd ../dao && npm run chain" }` which will keep `ganache-cli` in view. Could make this headless to make it all work in one smooth command and return the pid for terminating later, but overkill and less control. Test script will simply be something like `"test": "(cd ../dao && truffle migrate --network) && mocha"`




## Review


In the end:

Have `client` depend on the `dao` library, use Lerna.

Also:

- Move deployments into client tests, so re-migrating is less of a hassle
- View other TypeScript libraries; `Module` class is kind of strange
- `export = ` is also very strange; look at other Typescript libraries




```javascript
import { IdentityRegistry } from "@dorgtech/id-dao"

IdentityRegistry.isHuman('0x23234234234');

import { IdentityDao } from "@dorgtech/id-dao"

const dao = new IdentityDao();
IdentityDao.isHuman('0x234234');
IdentityDao.propose('234234234');
```
