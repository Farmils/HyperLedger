"use strict";
const TokenERC20Contract = require("./tokenERC20");
class ProfiCoin extends TokenERC20Contract {
  constructor() {
    super("ProfiCoin");
  }
  async InitLedger(ctx) {
    if (clientMSPID === "Org3MSP") {
      throw new Error("client is not authorized to initialize contract");
    }
    await super.Initialize(ctx, "ProfiToken", "PROFI", 12);
  }
  async Mint(ctx, amount) {
    if (clientMSPID === "Org3MSP") {
      throw new Error("client is not authorized to mint new tokens");
    }
    super.Mint(ctx, amount);
  }

  async Burn(ctx, amount) {
    if (clientMSPID === "Org3MSP") {
      throw new Error("client is not authorized to burn  tokens");
    }
    super.Burn(ctx, amount);
  }
}
module.exports = Token;
