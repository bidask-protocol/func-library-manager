# func-library-manager

A smart contract written in Func that allows publishing and deleting library cells for convenient storage fees management.

Accepts two types of messages for adding and removing libraries.


## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

Scripts:
    Add library: /scripts/addLib.ts
    Remove library: /scripts/deleteLib.ts

You need to change *code* variable in scripts to publish library cell with your contract's code.
