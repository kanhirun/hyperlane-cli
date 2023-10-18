import {Args, Command, Flags} from '@oclif/core'
import type { Hex } from 'sdk';
import { dispatch, payForGas } from 'sdk';

export default class SendCommand extends Command {
  static args = {
    origin: Args.integer({description: `origin chain's domain id`, required: true}),
    originRpcUrl: Args.string({description: `rpc url to use for origin`, required: true}),
    messageBody: Args.string({description: `a utf-8 encoded message`, required: true}),

    /// todo handle secrets better (e.g., eth_keystore)
    privKey: Args.string({description: 'a private key', required: true}),

    destination: Args.integer({description: `destination chain's domain id`, required: true}),
    destinationRpcUrl: Args.string({description: `rpc url to use for destination`, required: true}),
    recipient: Args.string({description: `recipient address`, required: true}),
  }

  static description = 'Sends an interchain message with Hyperlane.'

  static examples = [
    `
    $ cli send 11155111 https://sepolia.infura.io/v3/<API_KEY> "some-message" <PRIVATE_KEY> 5 https://goerli.infura.io/v3/<API_KEY> 0x36FdA966CfffF8a9Cdc814f546db0e6378bFef35
    `,
  ]

  static flags = {
    mailbox: Flags.string({description: 'an override for mailbox address', required: false}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(SendCommand)

    dispatch({
      origin: {
        originDomain: args.origin,
        rpcUrl: args.originRpcUrl,
        messageBody: args.messageBody,
        privateKey: args.privKey as Hex,
        mailboxAddress: flags.mailbox as Hex | undefined,
      },
      destination: {
        destinationDomainId: args.destination,
        recipientAddress: args.recipient as Hex
      }
    })
    .then(messageId => {
      this.log(`[send.dispatch]: messageId=(${messageId})`)
      return messageId;
    }).catch(reason => {
      this.error(`[send.dispatch]: failed, reason=${reason}`);
    })
    .then(messageId => payForGas({
      origin: {
        originDomain: args.origin,
        rpcUrl: args.originRpcUrl,
        gasAmount: 100_000,
        messageId,
        privateKey: args.privKey as Hex,
      },
      destination: {
        destinationDomain: args.destination,
        destinationRpcUrl: args.destinationRpcUrl
      }
    })).then(() => {
      this.log(`[send.deliver]: success`)
    }).catch(reason => {
      this.error(`[send.deliver]: failed, reason=${reason}`);
    })
  }
}
