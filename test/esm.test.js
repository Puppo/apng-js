import { describe, it, expect } from 'vitest';
import parseAPNG, { isNotPNG, isNotAPNG } from '../lib/index.esm.js';
import { runParseAPNGSuite } from './fixtures/parse-apng-suite.js';

describe('ESM export', () => {
  describe('exports', () => {
    it('exposes parseAPNG as the default export', () => {
      expect(typeof parseAPNG).toBe('function');
    });

    it('exposes isNotPNG as a named export', () => {
      expect(typeof isNotPNG).toBe('function');
    });

    it('exposes isNotAPNG as a named export', () => {
      expect(typeof isNotAPNG).toBe('function');
    });
  });

  runParseAPNGSuite(parseAPNG, isNotPNG, isNotAPNG);
});
