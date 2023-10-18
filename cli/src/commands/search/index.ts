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

    const match = args.match && JSON.parse(args.match) || [];
    console.log(match);

    const generator = getDispatchEvents({
      domainId: flags.chainId,
      rpcUrl: flags.rpcUrl,
      match
    });

    for await (const res of generator) {
      this.log(res.map((x: any) => x.args.sender));
    }
  }
}
