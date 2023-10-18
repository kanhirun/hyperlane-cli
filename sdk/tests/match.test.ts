import {describe, beforeEach, expect, test, jest} from '@jest/globals';
import { isMatched, isMatchedFn } from '../src/utils';
import type { MatchingList } from '../src/types';

describe('isMatchedFn', () => {
  test('returns all when empty', () => {
    const originDomain = 5;
    const matchList: MatchingList = [];
    const input = [
      { args: { sender: 'alice',   recipient: 'bob', destination: 1 } },
      { args: { sender: 'charlie', recipient: 'echo', destination: 2 } },
      { args: { sender: 'frank',   recipient: 'greg', destination: 3 } },
    ];

    const results = input.filter(isMatchedFn(originDomain, matchList));

    expect(results).toEqual(input)
  });

  test('returns none when originDomain not match', () => {
    const originDomain = 5;
    const matchList: MatchingList = [{
      originDomain: 9999
    }];
    const input = [
      { args: { sender: 'alice',   recipient: 'bob', destination: 1 } },
      { args: { sender: 'charlie', recipient: 'echo', destination: 2 } },
      { args: { sender: 'frank',   recipient: 'greg', destination: 3 } },
    ];

    const results = input.filter(isMatchedFn(originDomain, matchList));

    expect(results).toEqual([])
  });

  test('filters based on one field', () => {
    const originDomain = 5;
    const matchList: MatchingList = [{
      destinationDomain: 1
    }];
    const input = [
      { args: { sender: 'frank',   recipient: 'greg', destination: 3 } },
      { args: { sender: 'alice',   recipient: 'bob', destination: 1 } },
      { args: { sender: 'charlie', recipient: 'echo', destination: 1 } },
    ];
    const expected = [
      { args: { sender: 'alice',   recipient: 'bob', destination: 1 } },
      { args: { sender: 'charlie', recipient: 'echo', destination: 1 } },
    ]

    const results = input.filter(isMatchedFn(originDomain, matchList));

    expect(results).toEqual(expected)
  });

  test('filters based on two fields', () => {
    const originDomain = 5;
    const matchList: MatchingList = [{
      destinationDomain: 1,
      senderAddress: 'charlie'
    }];
    const input = [
      { args: { sender: 'frank',   recipient: 'greg', destination: 3 } },
      { args: { sender: 'alice',   recipient: 'bob', destination: 1 } },
      { args: { sender: 'charlie', recipient: 'echo', destination: 1 } },
    ];
    const expected = [
      { args: { sender: 'charlie', recipient: 'echo', destination: 1 } },
    ]

    const results = input.filter(isMatchedFn(originDomain, matchList));

    expect(results).toEqual(expected)
  });

  test('filters based on two matches', () => {
    const originDomain = 5;
    const matchList: MatchingList = [{
      destinationDomain: 1,
    }, {
      senderAddress: 'charlie'
    }];
    const input = [
      { args: { sender: 'alice',   recipient: 'bob', destination: 1 } },
      { args: { sender: 'charlie', recipient: 'echo', destination: 1 } },
    ];
    const expected = [
      { args: { sender: 'alice', recipient: 'bob', destination: 1 } },
      { args: { sender: 'charlie', recipient: 'echo', destination: 1 } },
    ]

    const results = input.filter(isMatchedFn(originDomain, matchList));

    expect(results).toEqual(expected)
  });
});

describe('isMatched', () => {
  test('returns true for wildcard', () => {
    expect(isMatched('0xABC', '*')).toBe(true);
    expect(isMatched(2, '*')).toBe(true);
  });

  test('returns true for undefined', () => {
    expect(isMatched('0xABC', undefined)).toBe(true);
    expect(isMatched(2, undefined)).toBe(true);
  });

  test('returns false if not equal', () => {
    expect(isMatched('0xABC', '0xEFG')).toBe(false);
    expect(isMatched(2, 9999)).toBe(false);
  });

  test('returns true if matches', () => {
    expect(isMatched('0xABC', '0xABC')).toBe(true);
    expect(isMatched(2, 2)).toBe(true);
  });

  test('returns true if some matches', () => {
    expect(isMatched(2, [1,2])).toBe(true);
  });

  test('returns false if none matches', () => {
    expect(isMatched(2, [9999, 8888])).toBe(false);
  });

  test('returns false if empty', () => {
    expect(isMatched(2, [])).toBe(false);
  });

  test('returns true if as array', () => {
    expect(isMatched(2, [2])).toBe(true);
  });
});

