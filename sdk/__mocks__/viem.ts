var stubbed: any = [];

const __setLogs = (values: any) => {
  stubbed = values;
}

const createPublicClient = (args: any) => {
  return {
    getContractEvents: (args: any) => {
      return stubbed;
    },
    getBlock: async () => {
      return Promise.resolve(100n);
    }
  };
}

const http = (args: any) => {
  return {};
}


export { createPublicClient, http, __setLogs };
