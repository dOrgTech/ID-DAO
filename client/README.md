# ID-DAO Client Library

## Identity Definition Form
`Note: IdentityDefinitionForm is a "formstate" form. The below example should suffice, but for more information about using the formstate library, see: https://formstate.github.io/#/?id=quick-example`
```TypeScript
import {
  IdentityDefinition,
  IdentityDefinitionForm,
  serialize,
  deserialize
} from "@dorgtech/id-dao-client";

// Eead some JSON from a file or a request body
let json =
`{
  "name": "Bob Hutchings",
  "address": "bad address",
  "uploads": {
    "selfie": {
      "host": "bad host type",
      "hash": "QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o"
    },
    "video": {
      "host": "gun",
      "hash": "QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o"
    }
  },
  "socialPosts": {
    "twitter": "https://twitter.com/dOrgJelli/status/1172340539376599046",
    "github": "https://gist.github.com/dOrgJelli/5088cddf1c58d417b9654500b49d4aa2"
  },
  "version": "1"
}`;

// Convert to IdentityDefinition
let data: IdentityDefinition = deserialize(json);

// Create an IdentityDefinitionForm
const form = new IdentityDefinitionForm();

// Initialize it with our data
form.data = data;

// Run the form's validation over our IdentityDefinition data
const res = await form.validate();

if (res.hasError) {
  // bad address
  console.log(form.error);
}

// Make an edit to a field of the form
form.$.address.value = "0xfD0174784EbCe943bdb8832Ecdea9Fea30e7C7A9";

// Validate our form again
...
// uploads.selfie.host contains a bad value

// Make an edit
form.$.uploads.$.selfie.$.host.value = "ipfs";

// Validate our form again
...

// All checks pass, let's turn it back into JSON
data = form.data;
json = serialize(data);
```
