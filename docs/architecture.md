# Architecture
Below is a technical specification for the:
* Identity Definition Schema
* Identity Registry & ID-DAO
* Onboaring App
* App Server

Please note that the **current version of the architecture is tentative**, and is subject to change at any moment.

## Overview (User Story)
![](./img/out/Architecture_Overview.png)  

The user who's wishing to be verified as a human enters through an onboarding application, in this case, GoodDollar. (1) In this application they fill out details necessary to verify their identity. Their private key is accessible through the application, as it's required for signing. (2.1) These credentials are then sent to the App Server where they'll be (a) validated (b) stored (c) and proposed to the Identity DAO on behalf of the user, eliminating gas costs. (2.2) App Servers can also act as Oracles, enabling sensitive information attestation (ex: OAuth, Government IDs, Address, etc).  

Now that our proposal is posted to the DAO, (3) voters decide if it is valid or not. Their deliberation will be aided by additional 3rd party services that can help spot duplicates. Once the vote passes or fails, (4) voters are rewarded or penalized based on if their vote was correct or incorrect. They can be rewarded REP (non-transferable voting power) and currency, or penalized REP.  

## Identity Definition Schema
An Identity is defined by a metadata JSON object that's stored in IPFS. The hash of this Identity Definition file is proposed to the DAO, where if passed, will be entered into the registry:
```JSON
{
  "name": "Bob Hutchings",
  "address": "0x1bc9e52baa93dab1a47c3168fd82ed08856ec83",
  "uploads": {
    "selfie": {
      "host": "ipfs",
      "hash": "QmSrPmbaUKA3ZodhzPWZnpFgcPMFWF4QsxXbkWfEptTBJd"
    },
    "video": {
      "host": "gun",
      "hash": "WeStGmTvKOZ3ZfdacKASnpFcsCFGGV1WxcCvnLzBmvVCNq"
    }
  },
  "socialPosts": {
    "twitter": "https://twitter.com/Hutchin_Bunchin/status/1110270197665951744",
    "github": "https://gist.github.com/Hutchin_Bunchin/883534836ed2f0e0ffc700b96bd092cd",
    "facebook": "https://www.facebook.com/bob.hutchings.21/posts/3165931083449513?__tn__=-R"
  },
  "oracles": [
    "GoodDollar",
    "Keybase",
  ],
  "version": "1"
}
```

### Field Descriptions
* **name**: name of the human.  
* **address**: public Ethereum address.  
* **uploads**: uploaded proof.  
  * **selfie**: a selfie of this human, preferably with **address** written on a piece of paper.  
    * **host**: location of the content's host service (ipfs, gundb, https://..., etc).  
    * **hash**: hash of the content, used as a key when fetching from the host.  
  * **video**: a selfie video of this human, preferably with **address** written on a piece of paper.  
    * **host**: ...  
    * **hash**: ...  
* **socialPosts**: social identity verification posts.  
  * **twitter**: a public Twitter post with **address** written in it.  
  * **github**: a public GitHub gist with **address** written in it.  
  * **facebook**: a public Facebook post with **address** written in it.  
* **oracles**: oracle service providers this **address** has registered with. For security purposes, it's up to the voter's application to understand how to contact these named oracles.  
* **version**: version of the Identity Definition schema.  

## Identity Registry & DAO
The smart contract architecture for the Identity DAO project is fairly simple. The [**IdentityRegistry**](../contracts/IdentityRegistry.sol) contract stores a mapping of user addresses to hashes of their **Identity Definition** described above. This hash can be used to retrieve the data from IPFS.  

The [**IdentityRegistry**](../contracts/IdentityRegistry.sol) is owned by the DAO's Avatar, which means a proposal must first be passed by the voters for any modifying functions to be called. The [**IdentityRegistry**](../contracts/IdentityRegistry.sol) contract exposes 3 functions for the DAO to call: `add(...)`, `remove(...)`, and `update(...)`.

Users can call `removeSelf()` at any time if they'd wish to be removed from the registry.

## Onboarding App
The onboarding app's responsibilities are:
* Enable the user to create their **Identity Definition**.  
* Request their private key sign the hash(**Identity Definition**).
* Querying the Identity Registry to see if they've been registered.
* Query the DAO to see what the status of their proposal is.

For more information, please see the [product](./product.md) documentation.  

## App Server
The app server is an optional convenience for the user. Some roles the app server may provide are:
* **Content Storage**: Persistence of the user's **Identity Definition** file.
* **Oracle**: Attest to the validity of private information (ex: OAuth Tokens, State IDs, etc).  
* **Transaction Proxy**: Handle all interactions with the Identity DAO on behalf of the user. Signatures are required to ensure consent.  

### Content Storage
Two different pieces of content are stored / persisted by the App Server:
* Identity Definition - Stored in IPFS as it must be publicly available.
* User Content (Selfie, Video) - Can be stored in any "host" (IPFS, GunDB, etc), as the user might want to keep this data private to just the members of the DAO using an access control list.  

### Oracle
The App Server can expose an **Oracle API** for returning additional user verification information. This API should return a basic response to be parsed by caller.  

An example Oracle query might look like:
```JSON
Oracle:
"GoodDollar" => "https://verify.gooddollar.org/0x1bc9e52baa93dab1a47c3168fd82ed08856ec83"

returns:
{
  "facebook-oauth" : true,
  "google-oauth" : true,
  "gov-id-verified" : true
}
```

The returned value above confirms that the user with the address `0x1bc9e52baa93dab1a47c3168fd82ed08856ec83` has been **verified** from the GoodDollar server with Facebook and Google OAuth, and has passed an internal government ID check. This can give potential voters supporting ground in approving or refusing new identities. This information would likely be held in an internal user database.

### Transaction Proxy
The App Server can cover the user's gas costs to avoid onboarding friction. This can be done using Meta Transactions or a by proposing on the user's behalf.

## JavaScript Library
For development convenience, all of the above will be exposed through a JavaScript library. Example of what using this library may look like:

```javascript
const IdentityDAO = require(‘identity-dao’);
const identityDAO = new IdentityDAO(web3);
    
// Returns a boolean
IdentityDAO.isHuman(‘0xc1B1b64c33e0578DBa9E2CEacf0F8763128ddF63’);
    
// Sends an addProposal, using the defaultAccount from web3.
// Alternate constructor inputs can be used to modify this.
IdentityDAO.proposeAdd(
  ‘Vitalik Buterin’,
  ‘0x5E0318D57c2F0d1262df93478A92EeDAd246A374’,
  ‘QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG’
);
```
