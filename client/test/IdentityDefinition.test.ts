import {
  IdentityDefinition,
  IdentityDefinitionForm,
  serialize,
  deserialize
} from "../dist";

import { expect } from "chai";

const validForm =
`{
  "name": "Bob Hutchings",
  "address": "0xfD0174784EbCe943bdb8832Ecdea9Fea30e7C7A9",
  "uploads": {
    "selfie": {
      "host": "ipfs",
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

describe("IdentityDefinition(Form)", () => {
  // TODO: invalid name
  // TODO: invalid address
  // TODO: invalid uploads
  // TODO: invalid selfie hash
  // TODO: invalid selfie source
  // TODO: only photo or only video
  // TODO: no social posts
  // TODO: single social post
  // TODO: invalid Twitter & GitHub posts
  describe("JSON", () => {
    it("JSON -> IdentityDefinition -> JSON", () => {
      const data = deserialize(validForm);
      const json = serialize(data);

      expect(json).to.be.equal(validForm);
    });

    it("JSON -> IdentityDefinitionForm -> JSON", () => {
      const form = new IdentityDefinitionForm();
      form.data = deserialize(validForm);
      const json = serialize(form.data);

      expect(json).to.be.equal(validForm);
    });
  });

  describe("Validation", () => {
    let form: IdentityDefinitionForm;

    beforeEach(() => {
      form = new IdentityDefinitionForm();
      form.data = deserialize(validForm);
    });

    it("Succeeds W/ Valid Form", async () => {
      const res = await form.validate();
      const error = form.error ? form.error : "";

      expect(res.hasError).to.be.equal(false, error);
    });
  });
});
