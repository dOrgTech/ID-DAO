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
  // TODO: only photo or only video
  // TODO: no social posts
  // TODO: single social post
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

    it("Valid Form", async () => {
      const res = await form.validate();
      const error = form.error ? form.error : "";

      expect(res.hasError).to.be.equal(false, error);
    });

    it("No Name", async () => {
      form.$.name.value = "";
      const res = await form.validate();
      expect(res.hasError).to.be.equal(true);
    });

    it("Invalid Address", async () => {
      form.$.address.value = "foo";
      const res = await form.validate();
      expect(res.hasError).to.be.equal(true);
    });

    it("Invalid Content Hash", async () => {
      form.$.uploads.$.selfie.$.hash.value = "foo";
      const res = await form.validate();
      expect(res.hasError).to.be.equal(true);
    });

    it("Invalid Content Source", async () => {
      form.$.uploads.$.selfie.$.host.value = "foo";
      const res = await form.validate();
      expect(res.hasError).to.be.equal(true);
    });

    it("Invalid Twitter Post URL", async () => {
      form.$.socialPosts.$.twitter.value = "foo";
      const res = await form.validate();
      expect(res.hasError).to.be.equal(true);
    });

    it("Invalid GitHub Gist URL", async () => {
      form.$.socialPosts.$.github.value = "foo";
      const res = await form.validate();
      expect(res.hasError).to.be.equal(true);
    });

    it("Tweet Missing Address", async () => {
      // early out if we're missing our environment variables
      if (!process.env.TWITTER_CONSUMER_KEY) {
        return;
      }

      form.$.socialPosts.$.twitter.value = "https://twitter.com/dOrgJelli/status/1171854275573637120";
      const res = await form.validate();
      expect(res.hasError).to.be.equal(true);
    });

    it("Gist Missing Address", async () => {
      form.$.socialPosts.$.github.value = "https://gist.github.com/dOrgJelli/b38f55534d928fc5ae2e1b7cae625848";
      const res = await form.validate();
      expect(res.hasError).to.be.equal(true);
    });
  });
});
