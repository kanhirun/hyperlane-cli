export { isMatchedFn, isMatched } from './match';
export { getChainByChainId, getMailboxAddressByChain, getIgpAddressByChain } from './chain';

export class BigInt {
  static max = (a: bigint, b: bigint) => a > b ? a: b;
}
