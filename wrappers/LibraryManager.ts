import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, toNano } from '@ton/core';
import { crc32 } from 'zlib';

export const Opcodes = {
    add_lib: crc32("op::add_lib"),
    delete_lib: crc32("op::delete_lib"),
}

export type LibraryManagerConfig = {owner: Address};

export function libraryManagerConfigToCell(config: LibraryManagerConfig): Cell {
    return beginCell().storeAddress(config.owner).endCell();
}

export class LibraryManager implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new LibraryManager(address);
    }

    static createFromConfig(config: LibraryManagerConfig, code: Cell, workchain = -1) {
        const data = libraryManagerConfigToCell(config);
        const init = { code, data };
        return new LibraryManager(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendAddLibrary(provider: ContractProvider, via: Sender, code: Cell, value: bigint = toNano("0.1")) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(Opcodes.add_lib, 32).storeRef(code).endCell(),
        });
    }

    async sendDeleteLibrary(provider: ContractProvider, via: Sender, code: Cell, value: bigint = toNano("0.1")) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(Opcodes.delete_lib, 32).storeRef(code).endCell(),
        });
    }
}
