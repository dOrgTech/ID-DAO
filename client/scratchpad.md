# Scratchpad

Just some small notes on how I might proceed from here

## General

For client-side library tests, we will need to deploy an instance of our contracts (probably to local chain like Ganache), obtain ABI (does build have this, or will we have to compile?) and connect to it via web3 (how to pass provider?)


1. Run chain (`cd ../dao && npm run chain`)
2. Truffle deploy locally (`truffle migrate --network `)
  (We will have to set up in config here)
3. Initialize web3 to ganache-cli (`const web3 = new Web3('http://localhost:8545')`)
4. Interact with chain as we want! (But, what about ABI...?)
  (ahhh, ok, build/contracts/IdentityRegistry.json yields us our ABI!!! :D)
  (so, something like: 
    ```javascript
      const idRegBuild = fs.readFileSync(path.resolve('../dao/build/contracts/IdentityRegistry.json'));
      const IdentityRegistry = web3.eth.Contract(idRegBuild.abi, address);
      //Wait, darn, where to get address?
    ``` 
  )

This should be pretty straightforward... ok
