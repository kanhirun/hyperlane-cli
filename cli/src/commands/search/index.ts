import {Args, Command, Flags} from '@oclif/core'
import { getDispatchEvents } from 'sdk';

export default class SearchCommand extends Command {
  static args = {
    match: Args.string({description: 'a json string of type MatchingList', required: false})
  }

  static description = `Searches a specified chain's mailbox for messages based on criteria`

  static examples = [
    `./cli/bin/dev.js --chainId 11155111 --rpcUrl https://sepolia.infura.io/v3/<API_KEY>`,
    `./cli/bin/dev.js search '[{ "sender": "<ADDRESS>" }]' --chainId 11155111 --rpcUrl https://sepolia.infura.io/v3/<API_KEY>`
  ]

  static flags = {
    chainId: Flags.integer({description: 'chain id', required: true}),
    rpcUrl: Flags.string({description: 'rpc url', required: true}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(SearchCommand)

    const matchList = args.match && JSON.parse(args.match) || [];

    await getDispatchEvents({
      domainId: flags.chainId,
      rpcUrl: flags.rpcUrl,
      matchList,
      resultSize: 10,
      step: 100n,
      searchLimit: 1_000_000n,
    }, (logs) => {
      const formatted = logs.map((log: any) => {
        return {
          sender: log.args.sender,
          recipient: log.args.recipient,
          destination: log.args.destination
        }
      });
      console.log(formatted);
    });
  }
}
