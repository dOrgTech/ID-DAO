
# Additional Considerations

* Password vs. wallet phrase
  * Alternatively, PIN/phone number
  * (Forgot PIN?)
    * Seed reserved for backup
    * Add email confirmation/phone number confirmation/2FA (Google Authenticator/Duo/Authy)

* Account verification - will we be checking to see if the tweet is valid, or should we pass this responsibility onto the DAO?
  * Note: Look at HumanityDAO

* Editing information/Deleting Information - will this reflect in user flow?
  * Why would a user edit/delete information?
    * Updating public address?
  * Expiring identities as a solution

* Allow GoodDollar users to vote on other users (on the app, makes person feel like "a good citizen")?
  * Disagree - can prevent mass market to shoot this out as a DAO, simply keep as this identity verification

* User flow for User Flow that is already on already on registry, import identity somehow
  * Think of perspective from an attacker - make sure user *can't* be on the list twice
  * Maybe if non-malicious - propose a deletion/edit of an identity?
    * Issue - if malicious, then they can simply say "hey, my identity was stolen! please approve me to steal UBI funds" (much like phone company phishing)

* Should a seperate address (sender) be able to add/edit/delete identity of another person? (e.g. From 0x984: Add 0x100 to registry)
  * Could have malicious element
  * However, making it this way allows entities/dApps to add identities on their behalf
    * Otherwise, GoodDollar will have to hold private keys on-chain
  * Yes! 
    * Allow people to remove other people (counteract malicious entity)
    * What if someone dies? No access to key
    * Perhaps only can add yourself?
      * Can work around this by having GoodDollar accept a signature, GoodDollar submits

* Make sure to distinguish between on-server privacy, and on-chain Identity Registry

* Phone number - not strong, because someone can make identity Identity

* What unique info can we keep on-chain that will ensure non-duplicate identities
  * Perhaps hashing sensitive information, helping voters determine between non-duplicates?

* If logged in and still waiting for approval (and approval rejected), (Contact Us for Support if not approved)

* GoodDollar as identity oracle: "Ah nice, if you think of gooddollar's server as an identity oracle, this is exactly how https://www.brightid.org/ has implemented their identity solution. A collection of oracles that the users in the network can choose to listen to or not. Instead it'd be an "auditing DAO" that chooses which oracles are faithful to decide what's what. Initially the only oracle would be GoodDollar in this case."

* FaceID/Fingerprint; see Status wallet (mobile)

