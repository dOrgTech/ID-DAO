let proxy: string;

export const setIdDaoProxy = (proxyURL: string) => {
  proxy = proxyURL;
};

export const getIdDaoProxy = (): string => {
  if (!proxy) {
    proxy = "http://localhost:3003/id-dao/verify";
  }

  return proxy;
};
