var stubbed: any = [];

const __setLogs = (values: any) => {
  stubbed = values;
}

const createPublicClient = (args: any) => {
  return {
    getContractEvents: (args: any) => {
      return stubbed;
    }
  };
}

const http = (args: any) => {
  return {};
}

export { createPublicClient, http, __setLogs };
