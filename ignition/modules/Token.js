/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable node/no-missing-require */
const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('TokenModule', m => {
  // deploy the DevToken contract
  const token = m.contract('DevToken');

  // Placeholder for additional operations later
  // example: mint additional tokens to specific adddressess
  // m.call(token, 'mint', [address, amount])

  return { token };
});
