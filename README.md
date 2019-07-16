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

Here is a breakdown of the primary user-groups:

| User Group | Description | Interactions with the Registry / DAO | How? |
|-|-|-|-|
| Humans | Individuals who want to prove they are unique humans |  
| Curators | Maintain the registry |  
| Apps | Apps that want to check if their users are unique humans | Javascript plug-in that calls isHuman() on registry |  
| Portals | Apps and other 3rd parties that help individuals prove they are unique humans | Submit proposals (add, edit or remove) on behalf of users to the DAO | Directly to the blockchain through their servers via web3 |  

These groups are not mutually exclusive. A Portal, such as GoodDollar, can also act as Curator by voting and staking on proposals. Humans can also be Curators.

The introduction of an Identity DAO to the GoodDollar project is meant to provide a powerful method in helping determine identity. By having users request identity submission to a DAO, a voting majority of trusted identities must verify and pass them. Since these decisions on managing identities are also public, there is an element of transparency in ensuring the validity of all those accepted. Identites can be added, updated, and removed by group consensus, acting as an active mechanism for keeping the integrity of the registry.
