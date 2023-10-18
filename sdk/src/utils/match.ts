import { Log } from 'viem';
import { MatchingList } from "../types";

export const isMatchedFn = (
  domainId: number,
  matchList: MatchingList
): <T extends any>(value: T, index: number, array: Array<T>) => boolean => {
  return (value, index, array) => {
    if (matchList.length === 0) return true;

    return matchList.some(match => {
      // @ts-ignore
      const args = value.args;

      const results = 
        isMatched(domainId, match.originDomain) &&
        isMatched(args.sender, match.senderAddress) &&
        isMatched(args.recipient, match.recipientAddress) &&
        isMatched(args.destination, match.destinationDomain);

      return results;
    });
  }
}

export const isMatched = <T>(
  a: T,
  b: '*' | T | T[] | undefined
): boolean => {
  if (b === undefined || b === '*') {
    return true;
  }

  if (Array.isArray(b)) {
    return b.some(elem => elem === a);
  }

  return a === b;
}
