import { address, Address, toNano } from '@ton/core';
import { LibraryManager } from '../wrappers/LibraryManager';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const libraryManager = provider.open(LibraryManager.createFromAddress(address(await provider.ui().input("Library manager address: "))));

    let code = await compile("Getter")

    await libraryManager.sendDeleteLibrary(provider.sender(), code);
}
