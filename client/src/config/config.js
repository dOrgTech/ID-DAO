interface Config {
  IdentityRegistry: IdentityRegistryConfig;
}

interface IdentityRegistryConfig {
  address: string;
  abi: object;
}

export = Config;
