require("dotenv").config();
const fs = require("fs");
const Zip = require("adm-zip");
const ipfsClient = require("ipfs-http-client");
const { deserialize } = require("@dorgtech/id-dao-client");
const ipfs = ipfsClient("localhost", process.env.IPFS_PORT);

async function uploadAndVerify(buffer, hash) {
  try {
    const result = await ipfs.add(buffer);

    if (result.length > 0) {
      const resultHash = result[0].path;
      if (resultHash !== hash) {
        return `Selfie hash is incorrect.\nExpected: ${hash}\nGot: ${resultHash}`
      } else {
        await ipfs.pin.add(resultHash);
        return undefined;
      }
    } else {
      return "No result returned from IPFS.";
    }
  } catch (e) {
    return e;
  }
}

async function upload() {
  const uploadedHumans = [];

  const files = fs.readdirSync('../humans/');
  for (let i = 0; i < files.length; ++i) {
    const file = files[i];

    try {
      // Crack open the zip
      const zip = new Zip(`../humans/${file}`);
      const entries = zip.getEntries();

      // Get the IdentityDefinition from the json
      const jsonIndex = entries.findIndex(
        (entry) => entry.entryName.includes(".json")
      );
      const json = entries[jsonIndex].getData().toString("utf8");
      const jsonHash = entries[jsonIndex].entryName.replace(".json", "");
      const identity = deserialize(json);

      // Upload selfie to IPFS and verify its hash
      const selfieHash = identity.uploads.selfie.hash;
      const selfieIndex = entries.findIndex(
        (entry) => entry.entryName.includes(selfieHash)
      );
      let error = await uploadAndVerify(entries[selfieIndex].getData(), selfieHash);
      if (error) {
        console.error(`Failed to upload Selfie for ${identity.address}\n${error}`);
      }

      // Upload video to IPFS and verify its hash
      const videoHash = identity.uploads.video.hash;
      const videoIndex = entries.findIndex(
        (entry) => entry.entryName.includes(videoHash)
      );
      error = await uploadAndVerify(entries[videoIndex].getData(), videoHash);
      if (error) {
        console.error(`Failed to upload Video for ${identity.address}\n${error}`);
      }

      // Upload json to IPFS and verify its hash
      error = await uploadAndVerify(json, jsonHash);
      if (error) {
        console.error(`Failed to upload JSON for ${identity.address}\n${error}`);
      }

      // Get the signature
      const sigIndex = entries.findIndex((entry) => entry.entryName === "sig");
      const sig = entries[sigIndex].getData().toString("utf8");

      uploadedHumans.push({
        address: identity.address,
        hash: jsonHash,
        sig
      });
    } catch (e) {
      console.error(`Failed to unzip and upload ${file}\n${e}`);
    }
  }

  return uploadedHumans;
}

if (require.main === module) {
  upload()
    .then((humans) => {
      console.log(JSON.stringify(humans, null, 2));
    })
    .then(() => process.exit(0))
    .catch(err => {
      console.log(err)
      process.exit(1)
    });
} else {
  module.exports = upload;
}
