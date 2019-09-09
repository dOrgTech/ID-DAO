/**
 * Fix the signature web3.eth.sign returns.
 *
 * @param {string} signature web3.eth.sign's signature
 * @return {string} fixed signature
 */
function fixSignature(signature) {
  // in geth its always 27/28, in ganache its 0/1. Change to 27/28 to prevent
  // signature malleability if version is 0/1
  // see https://github.com/ethereum/go-ethereum/blob/v1.8.23/internal/ethapi/api.go#L465
  let v = parseInt(signature.slice(130, 132), 16);
  if (v < 27) {
    v += 27;
  }
  const vHex = v.toString(16);
  return signature.slice(0, 130) + vHex;
}

/**
 * Sign a message in a way that's compliant with OpenZeppelin
 *
 * @param {Web3} web3 web3 instance
 * @param {string} message message to be signed
 * @param {string} address account address that will sign the message
 * @return {string} signature
 */
async function signMessage(web3, message, address) {
  return fixSignature(await web3.eth.sign(
    web3.utils.keccak256(message),
    address
  ));
}

module.exports = {
  signMessage,
};
