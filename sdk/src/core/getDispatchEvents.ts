import type { Hex, Log } from 'viem';
import type { MatchingList } from '../types';
import {
  createPublicClient,
  http,
} from 'viem';
import mailboxAbi from '../abi/IMailbox.abi.json';
import { BigInt, isMatched, isMatchedFn, getChainByChainId, getMailboxAddressByChain } from '../utils';

type GetDispatchEventsParam = {
  domainId: number;
  rpcUrl: string,
  matchList: MatchingList;
  resultSize?: number;
  step?: bigint;
  searchLimit?: bigint;
}

export const getDispatchEvents = async ({
  domainId,
  rpcUrl,
  matchList = [],
  resultSize = 10,
  step = 100n,
  searchLimit = 1_000_000n,
}: GetDispatchEventsParam, callback?: (items: Array<any>) => void) => {
  const chain = getChainByChainId(domainId);

  if (chain === null) {
    throw new Error('chain not found or not yet supported');
  }

  const mailboxAddress = getMailboxAddressByChain(chain);

  const client = createPublicClient({
    chain,
    transport: http(rpcUrl)
  });

  // todo create generic pagination
  var toBlock   = await client.getBlock().then(block => block.number);
  var fromBlock = toBlock - step;
  const finalBlock = BigInt.max(fromBlock - searchLimit, 0n);

  var queue: any = [];

  while (fromBlock > finalBlock) {
    while (queue.length < resultSize && fromBlock > finalBlock) {
      const events = await client.getContractEvents({
        address: mailboxAddress,
        abi: mailboxAbi,
        eventName: 'Dispatch',
        fromBlock,
        toBlock,
      });

      const filtered = events.filter(isMatchedFn(domainId, matchList));

      queue = [...queue, ...filtered];

      toBlock = fromBlock;
      fromBlock -= step;
    }
    const results = queue.splice(0, resultSize);

    callback && callback(results);
  }

  if (queue.length > 0 && callback) callback(queue);
}
