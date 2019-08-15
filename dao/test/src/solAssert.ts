/**

   SolAssert.js

*/

import chai = require('chai');
const assert = chai.assert;

/**
 * SolAssert static util class
 */
class SolAssert {
  /**
   * Simply function to test for Solidity revert errors; optionally takes an "expectedErr"
   * which simply looks for a string within
   *
   * This function has limits, however; if a function can potentially return two or more reverts,
   * we can't quite test for each of them through expectedErr and apply if/and/or logic
   *
   * @param {function} run - Function to test for Solidity revert errors
   * @param {string} [expectedErr=null] - Any revert string to expect; throw if not found
   */
  static async revert(run: any, expectedErr: string | null = null): string {
    let err: string = '';
    try {
      await run();
    } catch (_e) {
      err = _e.message;
    }
    // Ensure we've received an error
    assert.ok(err, 'No error from function call');
    assert.isTrue(err.includes('VM Exception while processing transaction: revert'), 'Error received: ' + err);
    if (expectedErr != null) assert.isTrue(err.includes(expectedErr));

    return err;
  }
}

export = SolAssert;
