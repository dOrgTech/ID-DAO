const addresses = require("@dorgtech/id-dao-contracts/migrations/registries.json");

export const genericActions = {
  name: "Identity Registry",
  addresses: {
    main: [addresses["mainnet"]],
    rinkeby: [addresses["rinkeby"]],
    private: [addresses["development"]]
  },
  actions: [
    {
      id: "add",
      label: "Add Identity",
      description: "Add an identity to the registry.",
      notes: "https://github.com/dOrgTech/ID-DAO/blob/master/dao/contracts/IdentityRegistry.sol#L19",
      fields: [
        {
          label: "Identity Address",
          name: "id",
          placeholder: "Address (0x0000…)"
        },
        {
          label: "Identity Definition IPFS Hash",
          name: "metadata",
          placeholder: "IPFS Hash..."
        },
        {
          label: "Signed IPFS Hash",
          name: "sig",
          placeholder: "web3.sign(IPFS Hash)"
        }
      ],
      abi: {
        constant: false,
        inputs: [
          {
            name: "id",
            type: "address"
          },
          {
            name: "metadata",
            type: "bytes"
          },
          {
            name: "sig",
            type: "bytes"
          }
        ],
        name: "add",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      }
    },
    {
      id: "update",
      label: "Update Identity",
      description: "Update an identity in the registry",
      notes: "https://github.com/dOrgTech/ID-DAO/blob/master/dao/contracts/IdentityRegistry.sol#L42",
      fields: [
        {
          label: "Identity Address",
          name: "id",
          placeholder: "Address (0x0000…)"
        },
        {
          label: "Identity Definition IPFS Hash",
          name: "metadata",
          placeholder: "IPFS Hash..."
        },
        {
          label: "Signed IPFS Hash",
          name: "sig",
          placeholder: "web3.sign(IPFS Hash)"
        }
      ],
      abi: {
        constant: false,
        inputs: [
          {
            name: "id",
            type: "address"
          },
          {
            name: "metadata",
            type: "bytes"
          },
          {
            name: "sig",
            type: "bytes"
          }
        ],
        name: "update",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      }
    },
    {
      id: "remove",
      label: "Remove Identity",
      description: "Remove an identity from the registry",
      notes: "https://github.com/dOrgTech/ID-DAO/blob/master/dao/contracts/IdentityRegistry.sol#L56",
      fields: [
        {
          label: "Identity Address",
          name: "id",
          placeholder: "Address (0x0000…)"
        }
      ],
      abi: {
        constant: false,
        inputs: [
          {
            name: "id",
            type: "address"
          }
        ],
        name: "remove",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      }
    }
  ]
};
