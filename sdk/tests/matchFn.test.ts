import {describe, beforeEach, expect, test, jest} from '@jest/globals';
import { matchFn } from '../src/commands/getDispatchEvents';

describe('matchFn', () => {
  test('returns true for wildcard', () => {
    expect(matchFn('0xABC', '*')).toBe(true);
    expect(matchFn(2, '*')).toBe(true);
  });

  test('returns true for undefined', () => {
    expect(matchFn('0xABC', undefined)).toBe(true);
    expect(matchFn(2, undefined)).toBe(true);
  });

  test('returns false if not equal', () => {
    expect(matchFn('0xABC', '0xEFG')).toBe(false);
    expect(matchFn(2, 9999)).toBe(false);
  });

  test('returns true if matches', () => {
    expect(matchFn('0xABC', '0xABC')).toBe(true);
    expect(matchFn(2, 2)).toBe(true);
  });

  test('returns true if some matches', () => {
    expect(matchFn(2, [1,2])).toBe(true);
  });

  test('returns false if none matches', () => {
    expect(matchFn(2, [9999, 8888])).toBe(false);
  });

  test('returns false if empty', () => {
    expect(matchFn(2, [])).toBe(false);
  });

  test('returns true if as array', () => {
    expect(matchFn(2, [2])).toBe(true);
  });
});

