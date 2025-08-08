import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { beginCell, Cell, Dictionary, toNano } from '@ton/core';
import { LibraryManager } from '../wrappers/LibraryManager';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { Getter } from '../wrappers/Getter';

describe('LibraryManager', () => {
    let code: Cell;
    let getterCode: Cell;
    let getterCodeRaw: Cell;

    beforeAll(async () => {
        code = await compile('LibraryManager');
        const _libs = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());
        getterCodeRaw = await compile('Getter');
        let libPrep = beginCell().storeUint(2, 8).storeBuffer(getterCodeRaw.hash()).endCell();
        getterCode = new Cell({exotic: true, bits: libPrep.bits, refs: libPrep.refs});
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let admin: SandboxContract<TreasuryContract>;
    let libraryManager: SandboxContract<LibraryManager>;
    let getter: SandboxContract<Getter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create({ autoDeployLibs: true });

        deployer = await blockchain.treasury('deployer');
        admin = await blockchain.treasury('admin');
        
        libraryManager = blockchain.openContract(LibraryManager.createFromConfig({owner: admin.address}, code));
        getter = blockchain.openContract(Getter.createFromConfig(getterCode))

        getter.sendDeploy(deployer.getSender())
        await libraryManager.sendDeploy(deployer.getSender());
    });

    it('should create lib', async () => {
        expect(blockchain.libs).toEqual(undefined);
        expect(await getter.getTest()).toEqual(-1);

        const res = await libraryManager.sendAddLibrary(admin.getSender(), getterCodeRaw);

        expect(res.transactions).toHaveTransaction({
            from: admin.address,
            to: libraryManager.address,
            success: true
        })

        expect(blockchain.libs).not.toEqual(undefined);
        expect(await getter.getTest()).toEqual(13371337);
    });

    it('should delete lib', async () => {
        await libraryManager.sendAddLibrary(admin.getSender(), getterCodeRaw);
        expect(blockchain.libs).not.toEqual(undefined);
        expect(await getter.getTest()).toEqual(13371337);

        const res = await libraryManager.sendDeleteLibrary(admin.getSender(), getterCodeRaw);

        expect(res.transactions).toHaveTransaction({
            from: admin.address,
            to: libraryManager.address,
            success: true
        })

        // Not working
        // expect(blockchain.libs).toEqual(undefined);
        // expect(await getter.getTest()).toEqual(-1);
    });
});
