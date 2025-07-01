import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, toNano } from '@ton/core';


export class Getter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Getter(address);
    }

    static createFromConfig(code: Cell, workchain = 0) {
        const init = { code, data: Cell.EMPTY };
        return new Getter(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY
        });
    }

    async getTest(provider: ContractProvider) {
        const result = await provider.get('test_method123456789', []);
        let num = result.stack.readNumber();
        return num;
    }
}
