require("dotenv").config();
const waitOn = require('wait-on');

const opts = {
  resources: [
    `tcp:${process.env.ID_DAO_IPFS_PORT}`,
    `tcp:${process.env.ID_DAO_WEB3_PORT}`
  ],
  timeout: 30000
};

waitOn(opts, function (err) {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    process.exit(0);
  }
});
