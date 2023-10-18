import type { Chain } from 'viem/chains';
import type { Hex } from 'viem';
import * as _chains from 'viem/chains';
import { mainnet, testnet } from '../const';

/// This is simplified for the challenge as not all chains will have deployed contracts
export const getMailboxAddressByChain = (chain: Chain): Hex => {
  return (chain && chain.testnet) ? testnet.mailbox.address : mainnet.mailbox.address;
}

export const getIgpAddressByChain = (chain: Chain): Hex => {
  return (chain && chain.testnet) ? testnet.igp.address : mainnet.igp.address;
}

/// conventionally, Abacus Works assigns domain ids based on chain ids
export const getChainByChainId = (id: number): Chain | null => {
  const chains = _chains as { [key: string]: Chain };

  for (const key of Object.keys(chains)) {
    const chain = chains[key];
    if (chain.id === id) return chain;
  }

  return null;
}
