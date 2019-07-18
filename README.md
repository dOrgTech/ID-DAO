# GoodDollar <> Identity DAO

Welcome to the Identity DAO documentation! Please note that the system described here is tentative and highly subject to change.

## Specifications

The specification is divided into three different sections:

1. [Product](./docs/product.md): UI Mock-ups & User Flows  
2. [Protocol](./docs/protocol.md): On-Chain Architecture & Economic Modeling  
3. [Architecture](./docs/architecture.md): Technical Architecture & Process Flows  

## Background 

A decentralized source of truth for identity is one of the biggest hurdles to any human-centric blockchain use-case, be it voting or UBI.

The solution posed here is a DAO-curated identity registry. The registry is maintained by a decentralized network of incentivized curators who can profit from diligengtly voting and staking on registry proposals.

In addition to the DAOstack-powered curation system, the Identity DAO utilizes on-boarding portals to help users apply to the registry in a user-friendly manner. The first portal is the GoodDollar UBI dapp. Users will be able to apply to the registry through the dapp and begin claiming UBI once accepted.

Here is a breakdown of the primary user-groups:

| User Group | Description | Interactions with the Registry / DAO | How? |
|-|-|-|-|
| Humans | Individuals who need to access dapps that require identity | Apply to the registry | Through on-boarding portals like GoodDollar or directly on Alchemy |
| Curators | Maintainers of the registry |  Vote and stake | Directly on Alchemy |
| Portals | Platforms that help individuals apply to the registry | Apply to the registry on behalf of individuals | Directly to the blockchain through their servers via web3 |  
| Apps | Apps that need to authenticate user identity | Read from the registry | Directly from the blockchain with javascript plug-in |

These groups are not mutually exclusive. For instance, GoodDollar is both a portal that lets its users apply to the registry and an app that checks the registry to verify its users’ identities. GoodDollar could also act as a curator by voting or staking on proposals. Another cross-over example is an individual who applies to the registry and then starts participating as a curator as well.
