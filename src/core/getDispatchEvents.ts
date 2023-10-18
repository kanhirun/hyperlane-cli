import type { Hex, Log } from 'viem';
import type { MatchingList } from '../types';
import {
  createPublicClient,
  http,
} from 'viem';
import mailboxAbi from '../abi/IMailbox.abi.json';
import { isMatched, isMatchedFn, getChainByChainId, getMailboxAddressByChain } from '../utils';

type GetDispatchEventsParam = {
  domainId: number;
  rpcUrl: string,
  match: MatchingList;
}

export const getDispatchEvents = async function* ({
  domainId,
  rpcUrl,
  match: matchList,
}: GetDispatchEventsParam) {
  const chain = getChainByChainId(domainId);

  if (chain === null) {
    throw new Error('chain not found or not yet supported');
  }

  const mailboxAddress = getMailboxAddressByChain(chain);

  const client = createPublicClient({
    chain,
    transport: http(rpcUrl)
  });

  // create generic pagination
  const blockStep = 100n;
  // const blockLimit = 1_000_000n;
  const blockLimit = 100_000n;
  var toBlock   = await client.getBlock().then(block => block.number);
  var fromBlock = toBlock - blockStep;
  const finalBlock = (fromBlock - blockLimit) > 0n ? (fromBlock - blockLimit) : 0n;

  const queueLimit = 10;
  var queue: any = [];

  while (fromBlock > finalBlock) {
    while (queue.length < queueLimit && fromBlock > finalBlock) {
      const events = await client.getContractEvents({
        address: mailboxAddress,
        abi: mailboxAbi,
        eventName: 'Dispatch',
        fromBlock,
        toBlock,
      });

      const filtered = events.filter(event => {
        if (matchList.length === 0) return true;

        return matchList.some(match => {
          // @ts-ignore
          const args = event.args;

          return isMatched(domainId, match.originDomain) &&
            isMatched(args.sender, match.senderAddress) &&
            isMatched(args.recipient, match.recipientAddress) &&
            isMatched(args.destination, match.destinationDomain);
        });
      });

      queue = [...queue, ...filtered];

      toBlock = fromBlock;
      fromBlock -= blockStep;
    }
    const results = queue.splice(0, queueLimit);

    yield results;
  }

  if (queue.length > 0) yield queue;
}
