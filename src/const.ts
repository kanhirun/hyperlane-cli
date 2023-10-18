import type { Hex } from 'viem';

export const mainnet = {
  mailbox: {
    address: '0x35231d4c2D8B8ADcB5617A638A0c4548684c7C70' as Hex
  },
  igp: {
    address: '0x56f52c0A1ddcD557285f7CBc782D3d83096CE1Cc' as Hex
  }
}

export const testnet = {
  mailbox: {
    address: '0xCC737a94FecaeC165AbCf12dED095BB13F037685' as Hex
  },
  igp: {
    address: '0xF987d7edcb5890cB321437d8145E3D51131298b6' as Hex
  }
}
