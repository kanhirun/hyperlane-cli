import {describe, beforeEach, expect, test, jest} from '@jest/globals';
import { sepolia } from 'viem/chains';
import { getDispatchEvents } from '../src/commands/getDispatchEvents';
import { MatchingList, MatchingListElement } from '../src/types';

import { createPublicClient, http } from 'viem';

// @ts-ignore 
import { __setLogs } from 'viem';

jest.mock('viem');

describe('sender, destinationDomain', () => {
  test(`filters two fields with AND logic`, async () => {
    __setLogs([
      { args: { sender: 'alice', recipient: '_' } },
      { args: { sender: '_', recipient: 'alice' } },
    ]);
    const originDomain = 1;
    const match = [{
      senderAddress: 'alice',
      recipientAddress: 'alice'
    }];

    const results = await getDispatchEvents({ originDomain , match });

    expect(results).toEqual([]) 
  });
});

test('returns all events if match empty', async () => {
  __setLogs([ 1, 2, 3 ]);
  const results = await getDispatchEvents({ originDomain: 5, match: [] });
  expect(results).toEqual([ 1, 2, 3 ]) 
});

describe('sender', () => {
  beforeEach(() => {
    __setLogs([
      { args: { sender: 's1', recipient: 'r1', }},
      { args: { sender: 's2', recipient: 'r2' }},
      { args: { sender: 's3', recipient: 'r3' }},
    ]);
  });

  test(`filters senders`, async () => {
    const originDomain = 1;
    const match = [{ senderAddress: 's2' }];

    const results = await getDispatchEvents({ originDomain , match });

    expect(results).toEqual([
      { args: { sender: 's2', recipient: 'r2' }}
    ]);
  });

  test(`filters many senders`, async () => {
    const originDomain = 1;
    const match = [{ senderAddress: ['s3', 's2']  }];

    const results = await getDispatchEvents({ originDomain , match });

    expect(results).toEqual([
      { args: { sender: 's2', recipient: 'r2' }},
      { args: { sender: 's3', recipient: 'r3' }}
    ]);
  });
})
