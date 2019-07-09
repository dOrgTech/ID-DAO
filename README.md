# IdentityDAO 

## Onboarding (Add Identity)

### GoodDollar

The User Onboarding piece of the GoodDollar app will have users create an account on GoodDollar. After typing in some basic information such as name and email, the user is asked to select a PIN. The user can also optionally setup an additional fingerprint/face ID form of authentication, on their phones. Finally, the user is logged in, and the GoodDollar server email the recovery seed mnemonic to the user. At this stage, the user has an account on Gooddollar, but has simply not had an identity approved yet.

In order to claim tokens, however, the identity first needs to be verified. Any action that requires identity will trigger the "Verify Identity" flow. Fields such as the selfie, video, and social account verifications will be verified by the DAO, and funneled through Alchemy as part of a voted proposal.

After submission user-side, the GoodDollar server will submit the Identity Proposal to the network on the behalf of the user (e.g. via a server-side wallet), and send a confirmation email to the user.

![](./docs/img/GoodDollar_Wireframe_Add_Identity.png)

### Data
```json
{
  "name" : "Ori Shimony",
  "address" : "0x6230204B1714C691804D1c71F325FDb0e184339Q", 
  "media": {
    "selfie" : "ipfs://ijnyttg6th7y7f5g",
    "video" : "ipfs://NUAh08hniaksm,laks",
  },
  "social" : {
    "Twitter" : "https://twitter.com/dOrg_tech/status/1110270197665951744",
    "LinkedIn" : "...",
    "Github" : "...",
  },
  "oracles" : [
    "GoodDollar",
    "Keybase",
  ]
}
```

```json
Oracle:
"GoodDollar" => "https://verify.gooddollar.org/0x6230204B1714C691804D1c71F325FDb0e184339Q"
returns:
{
  "facebook-oauth" : true,
  "google-oauth" : true,
  "gov-id-verified" : true
}
```

### Alchemy

On Alchemy, all of the publicly available proof for an identity is easily displayed within the proposal's UI. Use of "oracles" can be used to determine verification of materials from other sources; for example, this can be an opportunity to add further verification to a user by verifying that personal ID checks have passed from GoodDollar server-side, as well as social media accounts, adding further validity to submitted proposals, and easing the process of having it voted through.

![](./docs/img/Alchemy-Add-Identity.png)

### Scenario Flowchart

![](./docs/img/Scenario_Flow_Onboarding_Add_Identity.png)

### Exception Scenarios

Some of the scenarios below may be encountered along the above process and have been briefly fleshed out below. These include a user with a current account already existing on the GoodDollar server attempting to re-register, and a user that has submitted a proposal, but has had it rejected by the DAO.

![](./docs/img/Scenario_Flow_Exception_Existing_User_Attempting_to_Register.png)

![](./docs/img/Scenario_Flow_Exception_User_with_Rejected_Add_Proposal.png)

## Updating (Edit Identity)

Users will also be able to update their identity if necessary; for example, a new Twitter handle, a new personal address, or any other identifying information that may change over time may need an update at some point.

In order to make sure this information is kept up to date, users will be required to update their identity every 2 years and undergo the identity verification steps again.

### GoodDollar

![](./docs/img/GoodDollar_Wireframe_Update_Identity.png)

### Alchemy

On Alchemy, any changes or edits to a pre-existing identity will be reflected by the UI. Anything that has stayed the same will be omitted.

![](./docs/img/Alchemy-Edit-Identity.png)

### Scenario Flowchart

![](./docs/img/Scenario_Flow_Updating_Edit_Identity.png)

### Exception Scenarios

A rejected proposal to edit a user's information by the DAO is treated much like a rejected proposal to add a user, and is reflected in a very similar way user-side.

![](./docs/img/Scenario_Flow_Exception_User_with_Rejected_Edit_Proposal.png)

## Off-boarding (Remove Identity)

### GoodDollar

Removing an identity from the GoodDollar app is fairly straightforward. Within the GoodDollar app's menu bar, the user would simply tap "Delete Account", and confirm the deletion. Finally, the GoodDollar server relays the signed transaction to remove the account to the network, and an email is sent to the user on success.

![](./docs/img/GoodDollar_Wireframe_Delete_Identity.png)

### Scenario Flowchart

![](./docs/img/Scenario_Flow_Offboarding_Delete_Identity.png)

## Miscellaneous Scenarios

Any scenarios below are flows which either do not specifically pertain to any of the three main scenarios (adding, editing, removing an identity) or are interchangeable "sub-flows" referenced by the main flows.

The first two are interchangeable "sub-flows", whereas the last one, *Deletion of GoodDollar User's Identity from DAO*, reflects a case where a suspicious user from the DAO raises a proposal to remove the identity from the registry and succeeds. They can choose to either start the process again, or contact support.

### User Forgot PIN

![](./docs/img/Scenario_Flow_Exception_User_Forgot_PIN.png)

### Contact Support

![](./docs/img/Scenario_Flow_Contact_Support.png)

### Deletion of GoodDollar User's Identity from DAO

![](./docs/img/Scenario_Flow_Exception_DAO_Removes_User.png)
