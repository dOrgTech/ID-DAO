import {
  IdentityDefinition,
  IdentityDefinitionForm,
  serialize,
  deserialize
} from "../dist";
import { expect } from "chai";

const identity = JSON.stringify(require("./valid-identity.json"), null, 2);

// TODO: test missing fields + empty json

describe("IdentityDefinition(Form)", () => {
  describe("JSON", () => {
    it("JSON -> IdentityDefinition -> JSON", () => {
      const data = deserialize(identity);
      const json = serialize(data);

      expect(json).to.be.equal(identity);
    });

    it("JSON -> IdentityDefinitionForm -> JSON", () => {
      const form = new IdentityDefinitionForm();
      form.data = deserialize(identity);
      const json = serialize(form.data);

      expect(json).to.be.equal(identity);
    });
  });

  describe("Validation", () => {
    let form: IdentityDefinitionForm;

    beforeEach(() => {
      form = new IdentityDefinitionForm();
      form.data = deserialize(identity);
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
