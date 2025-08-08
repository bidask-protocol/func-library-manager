import { Address, beginCell, Cell, toNano } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import { Getter } from '../wrappers/Getter';

export async function run(provider: NetworkProvider) {
    let getterCodeRaw = await compile("Getter");
    let lib_prep = beginCell().storeUint(2, 8).storeBuffer(getterCodeRaw.hash()).endCell();
    const getter_code = new Cell({exotic: true, bits: lib_prep.bits, refs: lib_prep.refs});
    const getter = provider.open(Getter.createFromConfig(getter_code));

    await getter.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(getter.address);

    console.log(await getter.getTest())
}
