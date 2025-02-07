'use strict';
const TokenERC20Contract = require('./tokenERC20.js');
const balancePrefix = 'balance';
const totalSupplyKey = 'totalSupply';
class ProfiCoin extends TokenERC20Contract {
    async Initialize(ctx, name, symbol, decimals) {
        await super.Initialize(ctx, name, symbol, decimals);
        const initBalances = [
            {
                userID: 'bank',
                balance: 1000 * 10 ** decimals,
            },
            {
                userID: 'driver',
                balance: 50 * 10 ** decimals,
            },
        ];
        let totalSupply = 0;
        for (const user of initBalances) {
            const balanceKey = ctx.stub.createCompositeKey(balancePrefix, [
                user.userID,
            ]);
            await ctx.stub.putState(
                balanceKey,
                Buffer.from(user.balance.toString())
            );
            totalSupply += user.balance;
        }
        await ctx.stub.putState(
            totalSupplyKey,
            Buffer.from(totalSupply.toString())
        );
    }

    async Mint(ctx, amount) {
        await this.CheckInitialized(ctx);
        console.log(amount);
        const minter = ctx.clientIdentity
            .getID()
            .split('::')[1]
            .split('/')
            .find((attr) => attr.startsWith('CN='))
            .split('=')[1];
        const amountInt = parseInt(amount);
        if (amountInt <= 0) {
            throw new Error('mint amount must be a positive integer');
        }
        const balanceKey = ctx.stub.createCompositeKey(balancePrefix, [minter]);
        const currentBalanceBytes = await ctx.stub.getState(balanceKey);
        let currentBalance;
        if (!currentBalanceBytes || currentBalanceBytes.length === 0) {
            currentBalance = 0;
        } else {
            currentBalance = parseInt(currentBalanceBytes.toString());
        }
        const updatedBalance = this.add(currentBalance, amountInt);
        await ctx.stub.putState(
            balanceKey,
            Buffer.from(updatedBalance.toString())
        );
        const totalSupplyBytes = await ctx.stub.getState(totalSupplyKey);
        let totalSupply;
        if (!totalSupplyBytes || totalSupplyBytes.length === 0) {
            console.log('Initialize the totalSupply');
            totalSupply = 0;
        } else {
            totalSupply = parseInt(totalSupplyBytes.toString());
        }
        totalSupply = this.add(totalSupply, amountInt);
        await ctx.stub.putState(
            totalSupplyKey,
            Buffer.from(totalSupply.toString())
        );
        console.log(amountInt);
        const transferEvent = { from: '0x0', to: minter, value: amountInt };
        ctx.stub.setEvent(
            'Transfer',
            Buffer.from(JSON.stringify(transferEvent))
        );
        console.log(
            `minter account ${minter} balance updated from ${currentBalance} to ${updatedBalance}`
        );
        return true;
    }

    async Transfer(ctx, to, value) {
        await this.CheckInitialized(ctx);
        const from = ctx.clientIdentity
            .getID()
            .split('::')[1]
            .split('/')
            .find((attr) => attr.startsWith('CN='))
            .split('=')[1];
        const transferResp = await this._transfer(ctx, from, to, value);
        if (!transferResp) {
            throw new Error('Failed to transfer');
        }
        const transferEvent = { from, to, value: parseInt(value) };
        ctx.stub.setEvent(
            'Transfer',
            Buffer.from(JSON.stringify(transferEvent))
        );
        return true;
    }
}

module.exports = ProfiCoin;
