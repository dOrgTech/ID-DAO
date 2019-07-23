# Client
- TypeScript client library
- Verify Humans `isHuman(address: Address): boolean`
- Propose Humans `addHuman(address: Address, identity: IIdentity): Transaction?`
- Propose Update `updateHuman(address: Address, identity: IIdentity): Transaction?`
- Propose Remove `removeHuman(address: Address, identity: IIdentity): Transaction?`
- Remove Self `removeSelf(): Transaction?`
- Oracles? What does this look like?
- Tests W/ DAO Setup Script

```typescript
// 1. verify human
idDAO.isHuman(address);

// 2. proposal human
const identity: Identity = {
  ?
}

// 3. update

// etc
```

Hyper TBD, just a fund brain-storm
```typescript
interface Identity {
  name: string
  media: {
    self: IPFSHash
    video: IPFSHash
  }
  social: SocialPost
  oracles: Oracle
}

class Oracle {
  public static name: string;
  protected static url: string;

  public abstract verifyIdentity(address: Address): OracleResponse;
}

class GoodDollar implements Oracle {
  public static name: string = "GoodDollar";
  protected static url: string = "https://verify.gooddollar.io/${address}";

  public verifyIdentity(address: Address): GoodDollarResponse {
    // TODO:
    // call url w/ address
    // create new GoodDollarReponse.
    // return it.
    return {
      facebookOAuth: true
    }
  }

  public facebookOAuth(...) {
    // TODO
  }

  public idVerification(...) {
    // TODO
  }
}

interface GoodDollarResponse {
  facebookOAuth?: boolean
  googleOAuth?: boolean
  govIdVerified?: boolean
}
```
