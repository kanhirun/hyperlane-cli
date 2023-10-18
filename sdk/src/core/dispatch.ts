import type { Address, Hex } from 'viem';
import { 
  http,
  createWalletClient,
  toHex,
  publicActions,
  pad,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { getChainByChainId, getMailboxAddressByChain } from '../utils';
import mailboxAbi from '../abi/IMailbox.abi.json';

type DispatchParams = {
  origin: {
    originDomain: number,
    mailboxAddress?: Address,
    rpcUrl: string,
    messageBody: string,
    privateKey: Hex
  },
  destination: {
    destinationDomainId: number, // make me consistent
    recipientAddress: Hex
  }
}

export const dispatch = async ({
  origin: {
    originDomain,
    mailboxAddress,
    rpcUrl,
    messageBody,
    privateKey,  // todo handle secrets
  },
  destination: {
    destinationDomainId,
    recipientAddress,
  }
}: DispatchParams): Promise<Hex> => {
  const account = privateKeyToAccount(privateKey);
  const chain   = getChainByChainId(originDomain);

  if (chain === null) {
    throw new Error('chain not found or not yet supported');
  }

  const address = mailboxAddress || getMailboxAddressByChain(chain);

  const client = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl)
  }).extend(publicActions);

  const txHash = await client.writeContract({
    address,
    abi: mailboxAbi,
    functionName: 'dispatch',
    args: [
      destinationDomainId,
      pad(recipientAddress, { dir: 'left', size: 32 }),
      toHex(messageBody)
    ]
  });

  return new Promise((resolve, reject) => {
    const unwatch = client.watchContractEvent({
      address,
      abi: mailboxAbi,
      onLogs: logs => {
        const log = logs[0];
        if (log.transactionHash === txHash && log.topics[1]) {
          const dispatchId = log.topics[1];
          resolve(dispatchId);
          unwatch();
        }
      },
      batch: false,
      eventName: 'DispatchId',
    });
  });
}
