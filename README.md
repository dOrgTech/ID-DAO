# IdentityDAO 

## Onboarding (Add Identity)

### GoodDollar

The User Onboarding piece of the GoodDollar app will have users create an account on GoodDollar. After typing in some basic information such as name and email, the user is asked to select a PIN. The user can also optionally setup an additional fingerprint/face ID form of authentication, on their phones. Finally, the user is logged in, and the GoodDollar server email the recovery seed mnemonic to the user. At this stage, the user has an account on Gooddollar, but has simply not had an identity approved yet.

In order to claim tokens, however, the identity first needs to be verified. Any action that requires identity will trigger the "Verify Identity" flow. Fields such as the selfie, video, and social account verifications will be verified by the DAO, and funneled through Alchemy as part of a voted proposal.

After submission user-side, the GoodDollar server will submit the Identity Proposal to the network on the behalf of the user (e.g. via a server-side wallet), and send a confirmation email to the user.

![](../img/idDAO-GoodDollar_Wireframe_Add_Identity-444e74ef-f8cb-4b96-9336-22eda40df6e4.png)

### Alchemy

On Alchemy, all of the publicly available proof for an identity is easily displayed within the proposal's UI. Use of "oracles" can be used to determine verification of materials from other sources; for example, this can be an opportunity to add further verification to a user by verifying that personal ID checks have passed from GoodDollar server-side, as well as social media accounts, adding further validity to submitted proposals, and easing the process of having it voted through.

![](../img/Alchemy-Add-Identity-b3866762-5716-430f-86e3-8a623aa5b5f0.png)

### Scenario Flowchart

![](idDAO-Scenario_Flow_Onboarding_Add_Identity-cba01805-de12-4534-a2a3-a38ca99a2576.png)

### Exception Scenarios

Some of the scenarios below may be encountered along the above process and have been briefly fleshed out below. These include a user with a current account already existing on the GoodDollar server attempting to re-register, and a user that has submitted a proposal, but has had it rejected by the DAO.

![](idDAO-Scenario_Flow_Exception_Scenario_User_with_Existing_GoodDollar_Attempting_to_Register-acef9a67-8137-4262-8ef1-efa68707e638.png)

![](idDAO-Scenario_Flow_Exception_Scenario_User_with_Rejected_Approval_Add-da15c995-6df2-4b1b-a5c5-f8317e0c15a8.png)

## Updating (Edit Identity)

Users will also be able to update their identity if necessary; for example, a new Twitter handle, a new personal address, or any other identifying information that may change over time may need an update at some point.

In order to make sure this information is kept up to date, users will be required to update their identity every 2 years and undergo the identity verification steps again.

### GoodDollar

![](idDAO-GoodDollar_Wireframe_Update_Identity-057158a4-16bd-4cd2-a15c-b7ec97f3bafc.png)

### Alchemy

On Alchemy, any changes or edits to a pre-existing identity will be reflected by the UI. Anything that has stayed the same will be omitted.

![](Alchemy-Edit-Identity-a79769d7-0702-4c15-b91c-5c7d202299f8.png)

### Scenario Flowchart

![](idDAO-Scenario_Flow_Updating_Edit_Identity-d4bc63df-2438-44aa-a5d3-2e722333fb51.png)

### Exception Scenarios

A rejected proposal to edit a user's information by the DAO is treated much like a rejected proposal to add a user, and is reflected in a very similar way user-side.

![](idDAO-Scenario_Flow_Exception_Scenario_User_with_Rejected_Approval_Edit-07bf1b58-32a0-4a52-b825-8cb742e462d1.png)

## Off-boarding (Remove Identity)

### GoodDollar

Removing an identity from the GoodDollar app is fairly straightforward. Within the GoodDollar app's menu bar, the user would simply tap "Delete Account", and confirm the deletion. Finally, the GoodDollar server relays the signed transaction to remove the account to the network, and an email is sent to the user on success.

![](idDAO-GoodDollar_Wireframe_Delete_Identity-0ece4d2d-32f6-4a50-99a7-53d52dba4676.png)

### Scenario Flowchart

![](idDAO-Scenario_Flow_Offboarding_Delete_Identity-d6ace9ad-9dd0-4c46-9e32-af6ca3e32163.png)

## Miscellaneous Scenarios

Any scenarios below are flows which either do not specifically pertain to any of the three main scenarios (adding, editing, removing an identity) or are interchangeable "sub-flows" referenced by the main flows.

The first two are interchangeable "sub-flows", whereas the last one, *Deletion of GoodDollar User's Identity from DAO*, reflects a case where a suspicious user from the DAO raises a proposal to remove the identity from the registry and succeeds. They can choose to either start the process again, or contact support.

### User Forgot PIN

![](idDAO-Scenario_Flow_Exception_Scenario_User_Forgot_PIN-b8eba32e-2a70-4d3e-8247-7d2f2367e666.png)

### Contact Support

![](idDAO-Scenario_Flow_Contact_Support-be98ad1c-f805-4287-86c0-0d8f2abc3252.png)

### Deletion of GoodDollar User's Identity from DAO

![](idDAO-Scenario_Flow_Exception_Scenario_Outside_Party_Deletes_GoodDollar_Users_Identity_on_DAO-080d55ff-8550-4a0d-92c3-0cfc15162abd.png)
