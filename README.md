# IdentityDAO 

## Add I.D.

### GoodDollar User On-boarding

![](./docs/img/out/GoodDollar_Wireframe_Add_Identity.png)

After the user goes through GoodDollar's login in / create account flow, they'll be asked to verify their identity. The user will be asked to provide a selfie, video, and social account verifications. These will all be verified by the DAO through a proposal accessible through alchemy.

*Example Proposal Payload:*
```json
{
  "name" : "Bob Hutchings",
  "address" : "0x1bc9e52baa93dab1a47c3168fd82ed08856ec83", 
  "media": {
    "selfie" : "ipfs://QmSrPmbaUKA3ZodhzPWZnpFgcPMFWF4QsxXbkWfEptTBJd",
    "video" : "ipfs://WeStGmTvKOZ3ZfdacKASnpFcsCFGGV1WxcCvnLzBmvVCNq",
  },
  "social" : {
    "Twitter" : "https://twitter.com/Hutchin_Bunchin/status/1110270197665951744",
    "LinkedIn" : "...",
    "Github" : "...",
  },
  "oracles" : [
    "GoodDollar",
    "Keybase",
  ]
}
```

*Example Oracle Query:*
```json
Oracle:
"GoodDollar" => "https://verify.gooddollar.org/0x1bc9e52baa93dab1a47c3168fd82ed08856ec83"
returns:
{
  "facebook-oauth" : true,
  "google-oauth" : true,
  "gov-id-verified" : true
}
```

### Alchemy Add I.D. Verification

![](./docs/img/out/Alchemy-Add-Identity.png)

In Alchemy, the proposal payload that was prepared in the GoodDollar app is shown in the UI. Any verifications from GoodDollar's oracle are queried by Alchemy and shown. Two primary use cases for this oracle are government ID verification and external account OAuths. With this information, human voters can check these to determine whether the proposal is real. 

### Scenario Flowchart

![](./docs/img/out/Scenario_Flow_Onboarding_Add_Identity.png)

### Exception Scenarios

Some of the scenarios below may be encountered along the above process and have been briefly fleshed out below. These include a user with a current account already existing on the GoodDollar server attempting to re-register, and a user that has submitted a proposal, but has had it rejected by the DAO.

![](./docs/img/out/Scenario_Flow_Exception_Existing_User_Attempting_to_Register.png)

![](./docs/img/out/Scenario_Flow_Exception_User_with_Rejected_Add_Proposal.png)


## Edit I.D.

### GoodDollar User Profile Update

![](./docs/img/out/GoodDollar_Wireframe_Update_Identity.png)

### Alchemy Edit I.D. Verification

![](./docs/img/out/Alchemy-Edit-Identity.png)

On Alchemy, any changes or edits to a pre-existing identity will be reflected by the UI. Anything that has stayed the same will be omitted.

### Scenario Flowchart

![](./docs/img/out/Scenario_Flow_Updating_Edit_Identity.png)

### Exception Scenarios

A rejected proposal to edit a user's information by the DAO is treated much like a rejected proposal to add a user, and is reflected in a very similar way user-side.

![](./docs/img/out/Scenario_Flow_Exception_User_with_Rejected_Edit_Proposal.png)

## Delete I.D.

### GoodDollar User Off-boarding

![](./docs/img/out/GoodDollar_Wireframe_Delete_Identity.png)

Deleting an identity from the GoodDollar app is fairly straightforward. Within the GoodDollar app's menu bar, the user would simply tap "Delete Account", and confirm the deletion. Finally, the GoodDollar server relays the signed transaction to remove the account to the network, and an email is sent to the user on success.

### Scenario Flowchart

![](./docs/img/out/Scenario_Flow_Offboarding_Delete_Identity.png)

## Miscellaneous Scenarios

### User Forgot PIN

![](./docs/img/out/Scenario_Flow_Exception_User_Forgot_PIN.png)

### Contact Support

![](./docs/img/out/Scenario_Flow_Contact_Support.png)

### DAO Removes GoodDollar User's Identity

![](./docs/img/out/Scenario_Flow_Exception_DAO_Removes_User.png)
