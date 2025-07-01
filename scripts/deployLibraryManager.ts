import { Address, toNano } from '@ton/core';
import { LibraryManager } from '../wrappers/LibraryManager';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const libraryManager = provider.open(LibraryManager.createFromConfig({owner: provider.sender().address as Address}, await compile('LibraryManager')));

    await libraryManager.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(libraryManager.address);

    // run methods on `libraryManager`
}
