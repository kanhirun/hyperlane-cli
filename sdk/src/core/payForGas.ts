import { 
  http,
  createPublicClient,
  createWalletClient,
  toHex,
  publicActions,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { Hex, Address } from 'viem';
import { getChainByChainId, getIgpAddressByChain, getMailboxAddressByChain } from '../utils';

import mailboxAbi from '../abi/IMailbox.abi.json';
import igpAbi from '../abi/IInterchainGasPaymaster.abi.json';

type PayForGasParams = {
  origin: {
    originDomain: number,
    rpcUrl: string,
    messageId: Hex,
    gasAmount: number,
    igpAddress?: Address,
    refundAddress: Address,
    privateKey: Hex
  },
  destination: {
    destinationDomain: number,
    destinationRpcUrl: string,
  }
}

export const payForGas = async ({
  origin: {
    originDomain,
    rpcUrl: originRpcUrl,
    gasAmount,
    igpAddress: overrideIgpAddress,  // make me optional
    messageId,
    refundAddress,
    privateKey,
  },
  destination: {
    destinationDomain,
    destinationRpcUrl,
  }
}: PayForGasParams): Promise<boolean> => {
  const account = privateKeyToAccount(privateKey);
  const originChain = getChainByChainId(originDomain);
  const destinationChain = getChainByChainId(destinationDomain);

  if (originChain === null || destinationChain === null) {
    throw new Error('chain not found or not yet supported');
  }

  const igpAddress = overrideIgpAddress || getIgpAddressByChain(originChain);
  const destinationMailboxAddress = getMailboxAddressByChain(destinationChain);

  const originClient = createWalletClient({
    chain: originChain,
    account,
    transport: http(originRpcUrl)
  }).extend(publicActions);

  const quotedGasPayment = await originClient.readContract({
    abi: igpAbi,
    address: igpAddress,
    functionName: 'quoteGasPayment',
    args: [
      destinationDomain,
      gasAmount,
    ]
  }) as bigint;

  const txHash = await originClient.writeContract({
    abi: igpAbi,
    address: igpAddress,
    functionName: 'payForGas',
    args: [
      messageId,
      destinationDomain,
      gasAmount,
      refundAddress
    ],
    value: quotedGasPayment,
  });

  const destinationClient = createPublicClient({
    chain: destinationChain,
    transport: http(destinationRpcUrl)
  });

  return new Promise((resolve, reject) => {
    const unwatch = destinationClient.watchContractEvent({
      address: destinationMailboxAddress,
      abi: mailboxAbi,
      onLogs: logs => {
        resolve(true);
        unwatch();
      },
      eventName: 'ProcessId',
      args: [
        messageId
      ]
    });
  });
}

