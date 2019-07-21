/**

  Testing IdentityRegistry.sol

*/
'use strict';

const common = require('./common');
const util = require('util');

let instances = {};

contract('Testing IdentityRegistry', (accounts) => {

  const owner = accounts[0];
  const users = accounts.slice(1);

  it('Sample test', () => {
    assert.ok(1==1);
  })

  it('Deploy IdentityRegistry', async () => {
    instances.IdentityRegistry = await common.IdentityRegistry.new({ from: owner });
  })

  describe('Only owner can...', async () => {
    it('add', async () => {
      await assertSolidityRevert(
        async () => {
          await instances.IdentityRegistry.add(users[0].address, '', { from: users[0] });
        }
      );
    })
  })

})


// TODO: Move into seperate file: 

  //Simply function to test for Solidity revert errors; optionally takes an "expectedErr" which simply looks for a string within
  //This function has limits, however; if a function can potentially return two or more reverts, we can't quite test for each of them through expectedErr and apply if/and/or logic
  async function assertSolidityRevert(run, expectedErr = null) {
    let err;
    try {
      await run();
    } catch(_e) {
      err = _e.message;
    }
    //Ensure we've received an error
    assert.ok(err, 'No error from function call');
    assert.isTrue(err.includes('VM Exception while processing transaction: revert'), 'Error received: ' + err);
    if(expectedErr != null) assert.isTrue(err.includes(expectedErr));
    
    return err;
  }

