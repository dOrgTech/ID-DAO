# Client
- TypeScript client library
- Verify Humans `isHuman(address: Address): boolean`
- Propose Humans `addHuman(address: Address, identity: IIdentity): Transaction?`
- Propose Update `updateHuman(address: Address, identity: IIdentity): Transaction?`
- Propose Remove `removeHuman(address: Address, identity: IIdentity): Transaction?`
- Remove Self `removeSelf(): Transaction?`
- Tests W/ DAO Setup Script
